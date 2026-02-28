import { NextRequest, NextResponse } from "next/server";
import { getAPIUser } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

/** GET /api/portal/requests — list requests for the user's org */
export async function GET(req: NextRequest) {
  const user = await getAPIUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("review_requests")
    .select("*", { count: "exact" })
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, total: count, page, limit });
}

/** POST /api/portal/requests — create a new review request */
export async function POST(req: NextRequest) {
  const user = await getAPIUser();
  if (!user || !["sales", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Validate required fields
  const required = ["project_name", "vendor_track", "network_type", "user_count"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const now = new Date();
  const dueAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // +48h

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("review_requests")
    .insert({
      org_id: user.orgId,
      created_by: user.id,
      project_name: body.project_name,
      customer_name: body.customer_name ?? null,
      vendor_track: body.vendor_track,
      network_type: body.network_type,
      user_count: parseInt(body.user_count, 10) || 0,
      site_count: parseInt(body.site_count, 10) || 1,
      ha_required: !!body.ha_required,
      dr_required: !!body.dr_required,
      backup_required: !!body.backup_required,
      backup_retention_months: body.backup_retention_months ? parseInt(body.backup_retention_months, 10) : null,
      security_flags: body.security_flags ?? {},
      existing_infra: body.existing_infra ?? null,
      requirements_summary: body.requirements_summary ?? null,
      budget_range: body.budget_range ?? null,
      timeline: body.timeline ?? null,
      priority: body.priority ?? "normal",
      notes_external: body.notes_external ?? null,
      due_at: dueAt.toISOString(),
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit({
    orgId: user.orgId,
    requestId: data.id,
    actorUserId: user.id,
    action: "request.created",
    payload: { project_name: body.project_name },
  });

  return NextResponse.json({ data }, { status: 201 });
}
