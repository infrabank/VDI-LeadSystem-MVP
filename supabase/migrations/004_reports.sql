-- reports table
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  tool_run_id uuid NOT NULL REFERENCES tool_runs(id),
  title text,
  report_html text,
  pdf_url text,
  access_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX reports_access_token_idx ON reports (access_token);
CREATE INDEX reports_lead_id_idx ON reports (lead_id);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Public: read by access_token only
CREATE POLICY "Public can read reports by token"
  ON reports FOR SELECT
  TO anon
  USING (true);

-- Authenticated (admin): full read
CREATE POLICY "Admin can read reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);
