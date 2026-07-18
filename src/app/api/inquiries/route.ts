import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyInquiry } from "@/lib/notify";
import { apiError, validationError } from "@/lib/api-error";

interface InquiryInput {
  email: string;
  name: string;
  organization?: string;
  organizationType?: string;
  department?: string;
  phone?: string;
  interestAreas?: string[];
  message: string;
  source?: string;
  consentMarketing?: boolean;
}

// ContactForm의 ORG_TYPES와 반드시 일치해야 함 — 빠지면 해당 유형이 조용히 null 처리됨
const ALLOWED_ORG_TYPES = new Set([
  "central",
  "local",
  "public-corp",
  "research",
  "agency",
  "si-partner",
  "private",
  "other",
]);

export async function POST(request: NextRequest) {
  const body = (await request.json()) as InquiryInput;

  // 입력 검증 (필수·길이·형식)
  if (!body.email) return validationError("이메일", "missing");
  if (!body.name) return validationError("이름", "missing");
  if (!body.message) return validationError("문의 내용", "missing");
  if (body.message.trim().length < 10) return validationError("문의 내용", "too_short");
  if (body.message.length > 5000) return validationError("문의 내용", "too_long");
  if (body.name.length > 100) return validationError("이름", "too_long");
  if (body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return validationError("이메일", "invalid");
  }
  if (body.organization && body.organization.length > 200) return validationError("기관명", "too_long");
  if (body.phone && !/^[0-9+\-\s()]{0,30}$/.test(body.phone)) return validationError("연락처", "invalid");

  const supabase = createAdminClient();
  const source = body.source || "contact";

  // 1) Lead upsert (email 기준)
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .upsert(
      {
        email: body.email,
        name: body.name,
        company: body.organization || null,
        source,
        consent_marketing: !!body.consentMarketing,
      },
      { onConflict: "email" }
    )
    .select("id, email")
    .single();

  if (leadErr || !lead) {
    return apiError(leadErr, 400, "request_failed");
  }

  // 2) Lead extension upsert (메시지·관심영역 등)
  const orgType =
    body.organizationType && ALLOWED_ORG_TYPES.has(body.organizationType)
      ? body.organizationType
      : null;

  const { error: extErr } = await supabase
    .from("lead_extensions")
    .upsert(
      {
        lead_id: lead.id,
        organization_name: body.organization || null,
        organization_type: orgType,
        department: body.department || null,
        phone: body.phone || null,
        interest_area: body.interestAreas || [],
        message: body.message,
      },
      { onConflict: "lead_id" }
    );

  if (extErr) {
    return apiError(extErr, 400, "request_failed");
  }

  // 3) 상태 이력 기록 (best-effort)
  await supabase.from("lead_status_history").insert({
    lead_id: lead.id,
    from_status: null,
    to_status: "new",
    note: `상담 문의 (${source})`,
  });

  // 4) 알림 발송 (best-effort, 실패해도 success 유지)
  try {
    await notifyInquiry({
      name: body.name,
      email: body.email,
      organization: body.organization,
      department: body.department,
      phone: body.phone,
      interestAreas: body.interestAreas,
      message: body.message,
      source,
      leadId: lead.id,
      createdAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    });
  } catch (err) {
    console.warn("[inquiries] notification failed (non-blocking):", err);
  }

  return NextResponse.json({
    ok: true,
    lead_id: lead.id,
  });
}

export const dynamic = "force-dynamic";
