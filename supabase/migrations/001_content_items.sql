-- content_items table
CREATE TABLE content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('article', 'case', 'checklist', 'comparison')),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  excerpt text,
  body_md text,
  cover_image_url text,
  tags text[] DEFAULT '{}',
  category text,
  seo_title text,
  seo_description text,
  faq_json jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Full-Text Search
ALTER TABLE content_items ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(body_md, '')), 'C')
  ) STORED;

-- Indexes
CREATE INDEX content_items_fts_idx ON content_items USING gin(fts);
CREATE INDEX content_items_status_published_idx ON content_items (status, published_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Public: only published
CREATE POLICY "Public can read published content"
  ON content_items FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated (admin): full access
CREATE POLICY "Admin full access to content"
  ON content_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
