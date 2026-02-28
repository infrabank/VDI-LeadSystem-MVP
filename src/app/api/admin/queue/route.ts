import { NextRequest, NextResponse } from "next/server";
import { getAPIUser } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET /api/admin/queue — reviewer queue with filters */
export async function GET(req: NextRequest) {
  const user = await getAPIUser();
  if (!user || !["reviewer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const orgId = url.searchParams.get("org_id");
  const sortBy = url.searchParams.get("sort") ?? "due_at";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("review_requests")
    .select("*, organizations(name, slug)", { count: "exact" })
    .order(sortBy === "created_at" ? "created_at" : "due_at", {
      ascending: sortBy === "due_at",
    })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  } else {
    // By default exclude closed
    query = query.neq("status", "closed");
  }

  if (priority) {
    query = query.eq("priority", priority);
  }

  if (orgId) {
    query = query.eq("org_id", orgId);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, total: count, page, limit });
}
