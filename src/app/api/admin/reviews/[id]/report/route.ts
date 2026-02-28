import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
import { generateDraftReport } from "@/lib/sap/report-generator";
import type { ReviewRequest, ReviewScore } from "@/lib/types/sap";

/** POST /api/admin/reviews/[id]/report — generate draft report from scores */
export async function POST(
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

  // Get scores
  const { data: scores } = await admin
    .from("review_scores")
    .select("*")
    .eq("request_id", id);

  if (!scores || scores.length === 0) {
    return NextResponse.json(
      { error: "No scores found. Score all domains before generating a report." },
      { status: 400 }
    );
  }

  // Determine next version
  const { data: existing } = await admin
    .from("review_reports")
    .select("version")
    .eq("request_id", id)
    .order("version", { ascending: false })
    .limit(1);

  const nextVersion = (existing?.[0]?.version ?? 0) + 1;

  // Generate content
  const content = generateDraftReport(
    request as ReviewRequest,
    scores as ReviewScore[]
  );

  // Insert report
  const { data: report, error } = await admin
    .from("review_reports")
    .insert({
      request_id: id,
      version: nextVersion,
      state: "draft",
      content_json: content,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Auto-transition to draft_ready if in_review
  if (request.status === "in_review") {
    await admin
      .from("review_requests")
      .update({ status: "draft_ready" })
      .eq("id", id);
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "report.draft_generated",
    payload: { version: nextVersion },
  });

  return NextResponse.json({ data: report }, { status: 201 });
}

/** PUT /api/admin/reviews/[id]/report — edit draft report content */
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
  const { report_id, content_json } = body;

  if (!report_id || !content_json) {
    return NextResponse.json(
      { error: "report_id and content_json required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Verify report exists and is draft
  const { data: existing } = await admin
    .from("review_reports")
    .select("*")
    .eq("id", report_id)
    .eq("request_id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (existing.state === "final") {
    return NextResponse.json(
      { error: "Cannot edit a finalized report" },
      { status: 400 }
    );
  }

  const { data, error } = await admin
    .from("review_reports")
    .update({ content_json })
    .eq("id", report_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "report.edited",
    payload: { report_id },
  });

  return NextResponse.json({ data });
}
