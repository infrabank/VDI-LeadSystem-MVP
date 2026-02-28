-- Add backup retention months to review_requests
ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS backup_retention_months integer DEFAULT NULL;

COMMENT ON COLUMN review_requests.backup_retention_months
  IS 'Backup data retention period in months (NULL = not specified)';
