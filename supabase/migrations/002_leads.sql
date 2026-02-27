-- leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  company text,
  source text,
  consent_marketing boolean DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX leads_email_idx ON leads (email);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

-- Auto-update updated_at
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public: insert only (upsert handled via API with service role)
CREATE POLICY "Public can create leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated (admin): read + update
CREATE POLICY "Admin can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
