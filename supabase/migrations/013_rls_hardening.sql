-- =====================================================================
-- 013_rls_hardening.sql
-- RLS 강화: anon SELECT 차단 (Red Team 분석 결과 반영)
-- 참조: docs/04-report/red-team-analysis.md (HIGH 6·7번)
-- =====================================================================

-- 1) tool_runs: anon SELECT 정책 제거
--    이유: 타인의 진단 input/output_json 전수 조회 가능했음
--    영향: 클라이언트가 직접 tool_runs을 SELECT 하던 코드는 admin client 경유로 변경 필요

DROP POLICY IF EXISTS "Public can read tool runs" ON tool_runs;

-- 2) reports: anon SELECT를 access_token 매칭 시에만 허용
--    이유: USING (true)였으므로 access_token 컬럼·report_html 전수 덤프 가능했음
--    교체: token이 헤더·쿼리 파라미터로 전달되어야 매칭 (현재 코드는 admin client만 SELECT 하므로 영향 없음)

DROP POLICY IF EXISTS "Public can read reports" ON reports;

-- anon은 SELECT 자체를 막고, 서버 admin client만 access_token 검증 후 반환하도록 변경.
-- 추후 직접 anon 조회가 필요해지면 RPC SECURITY DEFINER 함수로 token 매칭 후 반환 권장.

-- 3) lead_extensions: anon SELECT 정책이 없는지 확인 (010에서 admin only로 정의됨 — 정상)
--    leads 테이블도 anon SELECT 없는지 확인

-- 4) 추가 인덱스: token 조회 성능 (admin client SELECT 경로)
CREATE INDEX IF NOT EXISTS reports_access_token_idx ON reports (access_token);

-- =====================================================================
-- 마이그레이션 적용 후 운영 영향 확인
-- - /reports/[token]/page.tsx: src/lib/supabase/server.ts (anon 클라이언트) 사용 시
--   reports SELECT 실패 가능. server.ts가 admin client를 사용하는지 확인 필요.
-- - 실패 시: 해당 페이지를 admin client로 변경하거나 RPC 함수로 token 매칭 후 반환.
-- =====================================================================
