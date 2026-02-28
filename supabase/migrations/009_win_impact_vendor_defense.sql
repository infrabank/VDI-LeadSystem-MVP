-- Win Impact Score assumptions + Vendor Defense support
-- Add evaluation weight and compliance fields to review_requests

ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS eval_weight_tech integer DEFAULT 70,
  ADD COLUMN IF NOT EXISTS eval_weight_price integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS compliance_level text DEFAULT 'medium'
    CHECK (compliance_level IN ('low', 'medium', 'high'));

COMMENT ON COLUMN review_requests.eval_weight_tech
  IS '기술평가 비중(%) — Win Impact Score 계산용';
COMMENT ON COLUMN review_requests.eval_weight_price
  IS '가격평가 비중(%) — Win Impact Score 계산용';
COMMENT ON COLUMN review_requests.compliance_level
  IS '보안/감사 강도 (low|medium|high) — Win Impact Score 가중치 조정용';
