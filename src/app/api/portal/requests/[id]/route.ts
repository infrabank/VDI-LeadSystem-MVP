import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET /api/portal/requests/[id] — request detail with attachments, scores, reports */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAPIUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const request = await getAuthorizedRequest(id, user);
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = createAdminClient();

  // Fetch related data in parallel
  const [attachRes, scoreRes, reportRes] = await Promise.all([
    admin
      .from("review_attachments")
      .select("*")
      .eq("request_id", id)
      .eq("visibility", "org")
      .order("created_at", { ascending: false }),
    admin
      .from("review_scores")
      .select("*")
      .eq("request_id", id)
      .order("domain"),
    admin
      .from("review_reports")
      .select("id, request_id, version, state, pdf_storage_key, created_at")
      .eq("request_id", id)
      .eq("state", "final")
      .order("version", { ascending: false })
      .limit(1),
  ]);

  return NextResponse.json({
    data: {
      ...request,
      attachments: attachRes.data ?? [],
      scores: scoreRes.data ?? [],
      final_report: reportRes.data?.[0] ?? null,
    },
  });
}
