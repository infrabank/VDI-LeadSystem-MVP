import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
import { VALID_TRANSITIONS, type RequestStatus } from "@/lib/types/sap";

/** GET /api/admin/reviews/[id] — full review detail */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAPIUser();
  if (!user || !["reviewer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const request = await getAuthorizedRequest(id, user);
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = createAdminClient();
  const [attachRes, scoreRes, reportRes, auditRes] = await Promise.all([
    admin
      .from("review_attachments")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    admin
      .from("review_scores")
      .select("*")
      .eq("request_id", id)
      .order("domain"),
    admin
      .from("review_reports")
      .select("*")
      .eq("request_id", id)
      .order("version", { ascending: false }),
    admin
      .from("audit_logs")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return NextResponse.json({
    data: {
      ...request,
      attachments: attachRes.data ?? [],
      scores: scoreRes.data ?? [],
      reports: reportRes.data ?? [],
      audit_logs: auditRes.data ?? [],
    },
  });
}

/** PUT /api/admin/reviews/[id] — update status, priority, assignment, notes */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAPIUser();
  if (!user || !["reviewer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const request = await getAuthorizedRequest(id, user);
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  // Status transition
  if (body.status && body.status !== request.status) {
    const allowed = VALID_TRANSITIONS[request.status as RequestStatus] ?? [];
    if (!allowed.includes(body.status)) {
      return NextResponse.json(
        {
          error: `Invalid transition: ${request.status} → ${body.status}. Allowed: ${allowed.join(", ")}`,
        },
        { status: 400 }
      );
    }
    updates.status = body.status;
  }

  if (body.priority) updates.priority = body.priority;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
  if (body.notes_internal !== undefined) updates.notes_internal = body.notes_internal;
  if (body.notes_external !== undefined) updates.notes_external = body.notes_external;
  if (body.eval_weight_tech !== undefined) updates.eval_weight_tech = body.eval_weight_tech;
  if (body.eval_weight_price !== undefined) updates.eval_weight_price = body.eval_weight_price;
  if (body.compliance_level !== undefined) updates.compliance_level = body.compliance_level;
  if (body.due_at) updates.due_at = body.due_at;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("review_requests")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "request.updated",
    payload: updates as Record<string, unknown>,
  });

  return NextResponse.json({ data });
}
