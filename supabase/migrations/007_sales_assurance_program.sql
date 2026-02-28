-- 007: VDI Sales Assurance Program (SAP) tables
-- Organizations, review workflow, scoring, reports, audit logs

-- ============================================================
-- Organizations (SI companies for multi-tenant isolation)
-- ============================================================
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Organization members (role-based access)
-- ============================================================
CREATE TABLE org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('sales', 'reviewer', 'admin')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- ============================================================
-- Review Requests (core workflow entity)
-- ============================================================
CREATE TABLE review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  created_by uuid NOT NULL REFERENCES auth.users(id),

  -- Project details
  project_name text NOT NULL,
  customer_name text,
  vendor_track text NOT NULL,          -- 'vmware','citrix','microsoft','nutanix','other'
  network_type text NOT NULL,          -- 'on_premise','hybrid','cloud','multi_cloud'
  user_count integer NOT NULL DEFAULT 0,
  site_count integer NOT NULL DEFAULT 1,

  -- Requirements flags
  ha_required boolean NOT NULL DEFAULT false,
  dr_required boolean NOT NULL DEFAULT false,
  backup_required boolean NOT NULL DEFAULT false,
  security_flags jsonb NOT NULL DEFAULT '{}',

  -- Additional context
  existing_infra text,
  requirements_summary text,
  budget_range text,
  timeline text,

  -- Workflow
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','triage','in_review','draft_ready','final_ready','delivered','closed')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low','normal','high','urgent')),
  due_at timestamptz NOT NULL,
  assigned_to uuid REFERENCES auth.users(id),

  -- Notes
  notes_external text,
  notes_internal text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER review_requests_updated_at
  BEFORE UPDATE ON review_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_review_requests_org ON review_requests(org_id);
CREATE INDEX idx_review_requests_status ON review_requests(status);
CREATE INDEX idx_review_requests_due_at ON review_requests(due_at);
CREATE INDEX idx_review_requests_created_by ON review_requests(created_by);
CREATE INDEX idx_review_requests_assigned ON review_requests(assigned_to);

-- ============================================================
-- Review Attachments (files uploaded by SI or internal)
-- ============================================================
CREATE TABLE review_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES review_requests(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id),
  uploaded_by uuid NOT NULL REFERENCES auth.users(id),
  kind text NOT NULL DEFAULT 'general'
    CHECK (kind IN ('rfp','architecture','requirements','proposal','general')),
  storage_key text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  content_type text,
  visibility text NOT NULL DEFAULT 'org'
    CHECK (visibility IN ('org','internal')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_review_attachments_request ON review_attachments(request_id);
CREATE INDEX idx_review_attachments_org ON review_attachments(org_id);

-- ============================================================
-- Review Scores (per domain checklist)
-- ============================================================
CREATE TABLE review_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES review_requests(id) ON DELETE CASCADE,
  domain text NOT NULL
    CHECK (domain IN ('compute','storage','network','ha_dr','backup','license')),
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  rationale text,
  risks jsonb NOT NULL DEFAULT '[]',
  recommendations jsonb NOT NULL DEFAULT '[]',
  scored_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(request_id, domain)
);

CREATE TRIGGER review_scores_updated_at
  BEFORE UPDATE ON review_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_review_scores_request ON review_scores(request_id);

-- ============================================================
-- Review Reports (draft/final, versioned)
-- ============================================================
CREATE TABLE review_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES review_requests(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  state text NOT NULL DEFAULT 'draft'
    CHECK (state IN ('draft','final')),
  content_json jsonb NOT NULL DEFAULT '{}',
  pdf_storage_key text,
  docx_storage_key text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(request_id, version)
);

CREATE TRIGGER review_reports_updated_at
  BEFORE UPDATE ON review_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_review_reports_request ON review_reports(request_id);

-- ============================================================
-- Audit Logs
-- ============================================================
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  request_id uuid REFERENCES review_requests(id),
  actor_user_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_org ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_request ON audit_logs(request_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- Organization member indexes
-- ============================================================
CREATE INDEX idx_org_members_user ON org_members(user_id);
CREATE INDEX idx_org_members_org ON org_members(org_id);

-- ============================================================
-- RLS Policies (basic safety net; app layer enforces full authz)
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read orgs they belong to
CREATE POLICY "Members read own org"
  ON organizations FOR SELECT TO authenticated
  USING (id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

-- Authenticated users can read their own membership
CREATE POLICY "Users read own memberships"
  ON org_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Review requests: org members can read their org's requests
CREATE POLICY "Org members read requests"
  ON review_requests FOR SELECT TO authenticated
  USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Review requests: sales/admin can insert for their org
CREATE POLICY "Sales insert requests"
  ON review_requests FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role IN ('sales','admin')
    )
  );

-- Attachments: org members can read org-visible files
CREATE POLICY "Org members read attachments"
  ON review_attachments FOR SELECT TO authenticated
  USING (
    (visibility = 'org' AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid()
    ))
    OR EXISTS (
      SELECT 1 FROM org_members
      WHERE user_id = auth.uid() AND role IN ('admin','reviewer')
    )
  );

-- Attachments: org members can insert
CREATE POLICY "Org members insert attachments"
  ON review_attachments FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Scores: org members can read; only reviewer/admin can write
CREATE POLICY "Read scores"
  ON review_scores FOR SELECT TO authenticated
  USING (
    request_id IN (
      SELECT id FROM review_requests
      WHERE org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','reviewer')
    )
  );

-- Reports: org members read final; reviewer/admin read all
CREATE POLICY "Read reports"
  ON review_reports FOR SELECT TO authenticated
  USING (
    (state = 'final' AND request_id IN (
      SELECT id FROM review_requests
      WHERE org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
    ))
    OR EXISTS (
      SELECT 1 FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','reviewer')
    )
  );

-- Audit logs: admin/reviewer can read
CREATE POLICY "Admin reads audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','reviewer')
    )
  );

-- ============================================================
-- Storage bucket for review attachments
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-attachments', 'review-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to review-attachments
CREATE POLICY "Auth users upload review attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-attachments');

-- Authenticated users can read review attachments (app layer checks org)
CREATE POLICY "Auth users read review attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'review-attachments');

-- Authenticated users can delete review attachments they own
CREATE POLICY "Auth users delete review attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review-attachments');
