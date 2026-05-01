-- 014_reports_token_expiry.sql
-- Red Team Round 2 (2026-05-01) — CRITICAL 2: access_token 영구 유효 차단
--
-- 문제: 004_reports.sql 의 reports 테이블에 expires_at 컬럼이 없어
--       URL에 노출된 access_token이 영구 유효 → Referer leak·검색 인덱싱·로그 잔존
--       시 진단 결과(개인정보 포함)가 무기한 외부 노출 위험.
--
-- 조치:
--   1. expires_at TIMESTAMPTZ 추가 (기본 90일)
--   2. 기존 row는 created_at + 90일로 backfill (보수적)
--   3. NOT NULL 제약
--   4. 만료된 row 조회 차단을 위한 부분 인덱스
--   5. /api/reports/[token]/page.tsx 서버 사이드에서 expires_at < now() 체크 필수

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Backfill 기존 row — created_at + 90일
UPDATE reports
   SET expires_at = COALESCE(created_at, NOW()) + INTERVAL '90 days'
 WHERE expires_at IS NULL;

-- 신규 row 기본값 + NOT NULL
ALTER TABLE reports
  ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '90 days'),
  ALTER COLUMN expires_at SET NOT NULL;

-- 만료 안 된 토큰만 빠르게 조회하기 위한 부분 인덱스
CREATE INDEX IF NOT EXISTS reports_active_token_idx
  ON reports (access_token)
  WHERE expires_at > NOW();

COMMENT ON COLUMN reports.expires_at IS
  'Token 만료 시각 (기본 발급 + 90일). 만료 후 access_token으로 조회 시 서버 사이드에서 410 Gone 반환.';
