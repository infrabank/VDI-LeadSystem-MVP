import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Record an audit log entry. Fire-and-forget — does not throw on failure.
 */
export async function logAudit(params: {
  orgId?: string | null;
  requestId?: string | null;
  actorUserId: string;
  action: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      org_id: params.orgId ?? null,
      request_id: params.requestId ?? null,
      actor_user_id: params.actorUserId,
      action: params.action,
      payload: params.payload ?? {},
    });
  } catch {
    // Audit logging should never break the main flow
    console.error("[audit] Failed to write audit log:", params.action);
  }
}
