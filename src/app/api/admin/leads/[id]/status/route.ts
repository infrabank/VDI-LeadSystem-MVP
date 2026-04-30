import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = new Set([
  "new",
  "reviewing",
  "meeting_scheduled",
  "proposing",
  "on_hold",
  "won",
  "lost",
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  const { id: leadId } = await params;

  const body = await request.json();
  const { status, note } = body as { status?: string; note?: string };

  if (!status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const createdBy = user?.email ?? null;

  const supabase = createAdminClient();

  // 1. Read current status
  const { data: current, error: readError } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .single();

  if (readError || !current) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const fromStatus = current.status as string;

  // 2. Update status
  const { error: updateError } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  // 3. Insert history (non-fatal)
  if (fromStatus !== status) {
    const { error: histError } = await supabase
      .from("lead_status_history")
      .insert({
        lead_id: leadId,
        from_status: fromStatus,
        to_status: status,
        note: note || null,
        created_by: createdBy,
      });
    if (histError) {
      console.error("[status_history insert]", histError.message);
    }
  }

  return NextResponse.json({
    lead_id: leadId,
    from_status: fromStatus,
    to_status: status,
  });
}
