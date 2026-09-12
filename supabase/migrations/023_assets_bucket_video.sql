-- assets 공개 버킷에 데모 영상(mp4)을 허용한다.
-- 2026-09-12 기준 Vinchin 제품 페이지의 랩 실측 데모 영상 5편(videos/vinchin/*.mp4, 총 36MB)과
-- 포스터 이미지 5장(videos/vinchin/*.jpg)을 보관한다. 영상은 public/ 폴더에 두지 않는다.
-- (Vercel 배포마다 산출물에 실려 Deployment Storage를 소모하기 때문이다. 022 마이그레이션 주석 참고)
-- 버킷 설정은 Storage API(PUT /storage/v1/bucket/assets)로 이미 반영했고, 이 파일은 이력 기록용이다.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'video/mp4'
]
WHERE id = 'assets';
