-- tool_runs table
CREATE TABLE tool_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  tool_type text NOT NULL DEFAULT 'risk_assessment',
  input_json jsonb NOT NULL,
  output_json jsonb,
  score integer,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX tool_runs_lead_id_idx ON tool_runs (lead_id);

-- RLS
ALTER TABLE tool_runs ENABLE ROW LEVEL SECURITY;

-- Public: insert
CREATE POLICY "Public can create tool runs"
  ON tool_runs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public: read own run (via API, not direct — but allow for report generation)
CREATE POLICY "Public can read tool runs"
  ON tool_runs FOR SELECT
  TO anon
  USING (true);

-- Authenticated (admin): full read
CREATE POLICY "Admin can read tool runs"
  ON tool_runs FOR SELECT
  TO authenticated
  USING (true);
