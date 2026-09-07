-- 정적 대용량 자산(브로슈어 PDF 등)용 공개 버킷.
-- public/ 폴더에 두면 Vercel 배포 한 건마다 산출물에 포함되어 Deployment Storage를 소모하므로
-- Supabase Storage로 옮긴다. 2026-09-07 기준 brochures/vinchin-product-brochure.pdf(13MB)를 보관한다.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  52428800,
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read assets"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'assets');

CREATE POLICY "Service can upload assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assets');
