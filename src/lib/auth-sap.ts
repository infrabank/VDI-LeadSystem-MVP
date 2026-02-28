import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrgMember, OrgRole } from "@/lib/types/sap";

export interface SAPUser {
  id: string;
  email: string;
  orgId: string;
  orgName: string;
  role: OrgRole;
}

/**
 * Get the current user's org membership. Returns null if not a member of any org.
 */
export async function getOrgMembership(
  userId: string
): Promise<(OrgMember & { org_name: string }) | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("org_members")
    .select("*, organizations(name)")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!data) return null;

  return {
    ...data,
    org_name: (data as Record<string, unknown>).organizations
      ? ((data as Record<string, unknown>).organizations as { name: string }).name
      : "",
  };
}

/**
 * Require an authenticated portal user (sales role).
 * Redirects to /portal/login if not authenticated or not a sales/admin member.
 */
export async function requirePortalAuth(): Promise<SAPUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const membership = await getOrgMembership(user.id);
  if (!membership) {
    redirect("/portal/login");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    orgId: membership.org_id,
    orgName: membership.org_name,
    role: membership.role,
  };
}

/**
 * Require an authenticated reviewer or admin.
 * Redirects to /admin/login if not authenticated or lacks role.
 */
export async function requireReviewer(): Promise<SAPUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const membership = await getOrgMembership(user.id);
  if (!membership || !["reviewer", "admin"].includes(membership.role)) {
    redirect("/admin/login");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    orgId: membership.org_id,
    orgName: membership.org_name,
    role: membership.role,
  };
}

/**
 * Get current user for API routes (no redirect, returns null).
 */
export async function getAPIUser(): Promise<SAPUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const membership = await getOrgMembership(user.id);
  if (!membership) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    orgId: membership.org_id,
    orgName: membership.org_name,
    role: membership.role,
  };
}

/**
 * Verify a user can access a specific request (org check).
 * Reviewers/admins can access any request.
 */
export async function canAccessRequest(
  user: SAPUser,
  requestOrgId: string
): Promise<boolean> {
  if (user.role === "reviewer" || user.role === "admin") {
    return true;
  }
  return user.orgId === requestOrgId;
}

/**
 * Verify the request belongs to the user's org. Returns the request or null.
 */
export async function getAuthorizedRequest(
  requestId: string,
  user: SAPUser
) {
  const admin = createAdminClient();
  const { data: request } = await admin
    .from("review_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (!request) return null;

  const allowed = await canAccessRequest(user, request.org_id);
  if (!allowed) return null;

  return request;
}
