import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface LeadExtensionInput {
  organization_name?: string | null;
  organization_type?: string | null;
  department?: string | null;
  phone?: string | null;
  interest_area?: string[] | null;
  message?: string | null;
}

const ALLOWED_ORG_TYPES = new Set([
  "central",
  "local",
  "public-corp",
  "agency",
  "private",
  "other",
]);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    name,
    company,
    source,
    consent_marketing,
    extension,
  } = body as {
    email?: string;
    name?: string | null;
    company?: string | null;
    source?: string | null;
    consent_marketing?: boolean;
    extension?: LeadExtensionInput;
  };

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Upsert lead by email
  const { data: lead, error } = await supabase
    .from("leads")
    .upsert(
      {
        email,
        name: name || null,
        company: company || null,
        source: source || "direct",
        consent_marketing: consent_marketing || false,
      },
      { onConflict: "email" }
    )
    .select("id, email")
    .single();

  if (error || !lead) {
    return NextResponse.json(
      { error: error?.message || "Lead upsert failed" },
      { status: 400 }
    );
  }

  // Optional: lead_extensions upsert
  if (extension && typeof extension === "object") {
    const orgType = extension.organization_type;
    const safeOrgType =
      orgType && ALLOWED_ORG_TYPES.has(orgType) ? orgType : null;

    const { error: extError } = await supabase
      .from("lead_extensions")
      .upsert(
        {
          lead_id: lead.id,
          organization_name: extension.organization_name ?? null,
          organization_type: safeOrgType,
          department: extension.department ?? null,
          phone: extension.phone ?? null,
          interest_area: Array.isArray(extension.interest_area)
            ? extension.interest_area
            : [],
          message: extension.message ?? null,
        },
        { onConflict: "lead_id" }
      );

    if (extError) {
      // 확장은 비치명적 — 로깅 후 lead만 반환
      console.error("[lead_extensions upsert]", extError.message);
    }
  }

  return NextResponse.json(lead, { status: 201 });
}
