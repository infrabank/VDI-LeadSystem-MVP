-- Storage buckets (run in Supabase SQL Editor)

-- Cover images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- PDF reports bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: covers
CREATE POLICY "Public can read covers"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'covers');

CREATE POLICY "Admin can upload covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Admin can delete covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers');

-- Storage policies: reports (PDF)
CREATE POLICY "Public can read reports"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'reports');

CREATE POLICY "Service can upload reports"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'reports');
