import { NextRequest, NextResponse } from "next/server";
import { getAPIUser } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

/** GET /api/admin/organizations — list all organizations */
export async function GET() {
  const user = await getAPIUser();
  if (!user || !["reviewer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organizations")
    .select("*, org_members(count)")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

/** POST /api/admin/organizations — create a new organization */
export async function POST(req: NextRequest) {
  const user = await getAPIUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "name and slug are required" },
      { status: 400 }
    );
  }

  // Sanitize slug
  const slug = body.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organizations")
    .insert({
      name: body.name,
      slug,
      domain: body.domain ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit({
    actorUserId: user.id,
    action: "organization.created",
    payload: { org_id: data.id, name: body.name },
  });

  return NextResponse.json({ data }, { status: 201 });
}
