import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

/** GET /api/portal/requests/[id]/attachments — list org-visible attachments */
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
  const isInternal = user.role === "reviewer" || user.role === "admin";

  let query = admin
    .from("review_attachments")
    .select("*")
    .eq("request_id", id)
    .order("created_at", { ascending: false });

  if (!isInternal) {
    query = query.eq("visibility", "org");
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

/** POST /api/portal/requests/[id]/attachments — upload a file */
export async function POST(
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

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string) ?? "general";
  const visibility = (formData.get("visibility") as string) ?? "org";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const storageKey = `${request.org_id}/${id}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("review-attachments")
    .upload(storageKey, buffer, {
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await admin
    .from("review_attachments")
    .insert({
      request_id: id,
      org_id: request.org_id,
      uploaded_by: user.id,
      kind,
      storage_key: storageKey,
      file_name: file.name,
      file_size: file.size,
      content_type: file.type || null,
      visibility,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "attachment.uploaded",
    payload: { file_name: file.name, kind },
  });

  return NextResponse.json({ data }, { status: 201 });
}
