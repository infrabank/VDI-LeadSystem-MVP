-- =====================================================================
-- 011_backup_readiness.sql
-- 백업·사이버복원력 자가 진단 도구 (Phase 2.1 / 데이터 보호 Practice)
-- 설계: docs/02-design/features/backup-readiness.design.md
--
-- tool_runs.tool_type은 free text이므로 별도 enum 변경 없음.
-- 신규 tool_type 값: 'backup_readiness'
--
-- leads.source 신규 값: 'backup-readiness'
-- =====================================================================

-- 인덱스: tool_type 기준 통계 쿼리 성능 개선 (다중 도구 운영 시)
CREATE INDEX IF NOT EXISTS tool_runs_tool_type_idx ON tool_runs (tool_type, created_at DESC);

-- 코멘트로 등록된 tool_type 기록 (운영 추적용)
COMMENT ON COLUMN tool_runs.tool_type IS
  'Tool identifier — values: risk_assessment | n2sf_readiness | vdi_role | roi | backup_readiness';

-- =====================================================================
-- 끝 — 신규 테이블/컬럼 없음, 인덱스·코멘트만 추가
-- =====================================================================
