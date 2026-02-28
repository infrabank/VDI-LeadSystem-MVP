import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

const VALID_DOMAINS = ["compute", "storage", "network", "ha_dr", "backup", "license"];

/** POST /api/admin/reviews/[id]/scores — upsert scores for a request */
export async function POST(
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

  // Accept single score or array of scores
  const scores = Array.isArray(body) ? body : [body];
  const results = [];

  const admin = createAdminClient();

  for (const scoreInput of scores) {
    if (!VALID_DOMAINS.includes(scoreInput.domain)) {
      return NextResponse.json(
        { error: `Invalid domain: ${scoreInput.domain}` },
        { status: 400 }
      );
    }

    const scoreVal = Math.max(0, Math.min(100, parseInt(scoreInput.score, 10) || 0));

    const { data, error } = await admin
      .from("review_scores")
      .upsert(
        {
          request_id: id,
          domain: scoreInput.domain,
          score: scoreVal,
          rationale: scoreInput.rationale ?? null,
          risks: scoreInput.risks ?? [],
          recommendations: scoreInput.recommendations ?? [],
          scored_by: user.id,
        },
        { onConflict: "request_id,domain" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    results.push(data);
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "scores.updated",
    payload: { domains: scores.map((s: { domain: string }) => s.domain) },
  });

  return NextResponse.json({ data: results });
}
