-- Trust & Track — architecture guards
-- Apply after the Prisma-generated base migration.
-- These constraints cannot be expressed fully in Prisma schema syntax.

BEGIN;

-- One open task per safe deduplication key. Completed/closed work must not block
-- a genuinely new occurrence of the same issue later.
CREATE UNIQUE INDEX IF NOT EXISTS tasks_dedup_open
  ON tasks (dedup_key)
  WHERE dedup_key IS NOT NULL
    AND status NOT IN ('completed', 'closed_no_action', 'cancelled');

-- Gmail polling intentionally overlaps windows. This partial unique index makes
-- retries and replays idempotent while allowing manual/milestone events to have
-- no Gmail message ID.
CREATE UNIQUE INDEX IF NOT EXISTS source_events_gmail_message_unique
  ON source_events (tenant_id, gmail_message_id)
  WHERE gmail_message_id IS NOT NULL;

-- Approval is a contributor workflow flag, not an electronic signature.
ALTER TABLE contributor_requests
  DROP CONSTRAINT IF EXISTS contributor_approval_consistency;
ALTER TABLE contributor_requests
  ADD CONSTRAINT contributor_approval_consistency
  CHECK (is_approval OR approved IS NULL);

-- Append-only audit log. Application permissions are not sufficient; reject
-- mutation at the database layer.
CREATE OR REPLACE FUNCTION reject_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: % is not permitted', TG_OP
    USING ERRCODE = '55000';
END;
$$;

DROP TRIGGER IF EXISTS audit_log_reject_update ON audit_log;
CREATE TRIGGER audit_log_reject_update
BEFORE UPDATE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION reject_audit_log_mutation();

DROP TRIGGER IF EXISTS audit_log_reject_delete ON audit_log;
CREATE TRIGGER audit_log_reject_delete
BEFORE DELETE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION reject_audit_log_mutation();

COMMIT;
