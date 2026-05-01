import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyInquiry } from "@/lib/notify";

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

const ALLOWED_ORG_TYPES = new Set([
  "central",
  "local",
  "public-corp",
  "agency",
  "private",
  "other",
]);

export async function POST(request: NextRequest) {
  const body = (await request.json()) as InquiryInput;

  if (!body.email || !body.name || !body.message) {
    return NextResponse.json(
      { error: "name, email, message are required" },
      { status: 400 }
    );
  }
  if (body.message.trim().length < 10) {
    return NextResponse.json(
      { error: "message must be at least 10 characters" },
      { status: 400 }
    );
  }

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
    return NextResponse.json(
      { error: leadErr?.message || "Lead upsert failed" },
      { status: 400 }
    );
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
    // 메시지 저장 실패는 critical — 사용자에게 알림
    return NextResponse.json(
      { error: extErr.message || "Inquiry save failed" },
      { status: 400 }
    );
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
