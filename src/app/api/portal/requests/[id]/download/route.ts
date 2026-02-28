import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET /api/portal/requests/[id]/download?type=report|attachment&key=... */
export async function GET(
  req: NextRequest,
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

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const key = url.searchParams.get("key");

  if (!type || !key) {
    return NextResponse.json(
      { error: "type and key query params required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  if (type === "report") {
    // Verify this report belongs to the request and is final (for portal users)
    const { data: report } = await admin
      .from("review_reports")
      .select("state, pdf_storage_key")
      .eq("request_id", id)
      .eq("pdf_storage_key", key)
      .single();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Portal users can only download final reports
    if (report.state !== "final" && !["reviewer", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Report not ready" }, { status: 403 });
    }

    const { data } = await admin.storage
      .from("reports")
      .createSignedUrl(key, 300); // 5 min expiry

    if (!data?.signedUrl) {
      return NextResponse.json({ error: "Download unavailable" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  }

  if (type === "attachment") {
    // Verify attachment belongs to request and is accessible
    const { data: attachment } = await admin
      .from("review_attachments")
      .select("visibility, org_id")
      .eq("request_id", id)
      .eq("storage_key", key)
      .single();

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }

    // Check visibility
    if (
      attachment.visibility === "internal" &&
      !["reviewer", "admin"].includes(user.role)
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { data } = await admin.storage
      .from("review-attachments")
      .createSignedUrl(key, 300);

    if (!data?.signedUrl) {
      return NextResponse.json({ error: "Download unavailable" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
