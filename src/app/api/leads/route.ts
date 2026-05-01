import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, validationError } from "@/lib/api-error";

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

  // Red Team Round 2 — HIGH 3: 입력 검증 + Postgres 에러 마스킹
  if (!email) return validationError("이메일", "missing");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return validationError("이메일", "invalid");
  }
  if (name && name.length > 100) return validationError("이름", "too_long");
  if (company && company.length > 200) return validationError("기관명", "too_long");

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
    return apiError(error, 400, "request_failed");
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
