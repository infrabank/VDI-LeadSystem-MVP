/**
 * Inquiry notification helper.
 *
 * 알림 채널 (env 기반, 우선순위 순):
 *   1) INQUIRY_WEBHOOK_URL  — 임의 webhook (Slack/Discord/Zapier/Make/IFTTT/n8n 등)
 *   2) INQUIRY_EMAIL_TO + RESEND_API_KEY  — Resend.com API (https://resend.com)
 *   3) 미설정 시 — console.log only (DB 저장은 정상 진행)
 *
 * 모든 알림 실패는 swallow — DB 저장 자체는 막지 않음.
 *
 * ── PII 정책 (Red Team Round 2 — 2026-05-01) ──
 *   • Resend(이메일): 회사 자체 메일 → PII 전체 허용 (담당자 회신 필요).
 *   • Webhook (Slack/Discord/Zapier 등): 외부 SaaS — PII 마스킹.
 *     - 이름: 첫 글자 + "**" (예: "홍**")
 *     - 이메일: 도메인만 (예: "***@kistim.re.kr")
 *     - 전화: 끝 4자리만 (예: "***-***-1234")
 *     - 메시지: 본문 송신 안 함 (lead_id로 DB 조회 유도)
 *   • 처리방침에 위탁 항목 명시 (privacy/page.tsx 표).
 */

export interface InquiryPayload {
  name: string;
  email: string;
  organization?: string;
  department?: string;
  phone?: string;
  interestAreas?: string[];
  message: string;
  source: string;
  leadId?: string;
  createdAt: string;
}

const SITE_NAME = "Myloket";

// ── PII 마스킹 헬퍼 (외부 webhook 송신용) ──

function maskName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "(미입력)";
  if (trimmed.length === 1) return `${trimmed}*`;
  return `${trimmed[0]}${"*".repeat(Math.min(trimmed.length - 1, 3))}`;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `***@${email.slice(at + 1)}`;
}

function maskPhone(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `***-***-${digits.slice(-4)}`;
}

function maskOrgCategory(org?: string): string {
  if (!org) return "(미입력)";
  // 기관명 자체는 외부 webhook으로 보내지 않음 — 길이만 노출 (식별 회피)
  return `[기관명 ${org.length}자]`;
}

function formatPlainText(p: InquiryPayload): string {
  const lines = [
    `[${SITE_NAME}] 신규 상담 문의`,
    "",
    `· 이름: ${p.name}`,
    `· 이메일: ${p.email}`,
  ];
  if (p.organization) lines.push(`· 기관: ${p.organization}`);
  if (p.department) lines.push(`· 부서: ${p.department}`);
  if (p.phone) lines.push(`· 전화: ${p.phone}`);
  if (p.interestAreas?.length) lines.push(`· 관심영역: ${p.interestAreas.join(", ")}`);
  lines.push(`· 유입: ${p.source}`);
  lines.push("", "── 메시지 ──", p.message, "", `접수: ${p.createdAt}`);
  if (p.leadId) lines.push(`Lead ID: ${p.leadId}`);
  return lines.join("\n");
}

/**
 * 외부 webhook용 PII-마스킹 본문.
 * 식별 가능한 정보 최소화 — 상세는 admin 콘솔에서 lead_id로 조회.
 */
function formatWebhookText(p: InquiryPayload): string {
  const lines = [
    `[${SITE_NAME}] 신규 상담 문의 (마스킹)`,
    "",
    `· 이름: ${maskName(p.name)}`,
    `· 이메일: ${maskEmail(p.email)}`,
    `· 기관: ${maskOrgCategory(p.organization)}`,
  ];
  if (p.phone) lines.push(`· 전화: ${maskPhone(p.phone)}`);
  if (p.interestAreas?.length) lines.push(`· 관심영역: ${p.interestAreas.join(", ")}`);
  lines.push(`· 유입: ${p.source}`);
  lines.push(`· 접수: ${p.createdAt}`);
  if (p.leadId) lines.push("", `▶ 상세 조회는 admin 콘솔에서 Lead ID로 확인: ${p.leadId}`);
  return lines.join("\n");
}

/**
 * Slack/Discord/일반 webhook 호환 payload (PII 마스킹).
 * Slack은 `text` 필드를 사용, Discord는 `content`.
 *
 * 의도적으로 raw payload(p)는 송신 안 함 — 처방의 "Slack/Discord 위탁 시 마스킹 항목만"을 코드로 강제.
 */
function formatWebhookBody(p: InquiryPayload): Record<string, unknown> {
  const text = formatWebhookText(p);
  return {
    text,
    content: text,
    // 외부 SaaS에 raw PII를 절대 송신하지 않음 (Red Team Round 2 — CRITICAL 3)
    masked: true,
    lead_id: p.leadId,
    source: p.source,
  };
}

async function sendWebhook(url: string, p: InquiryPayload): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatWebhookBody(p)),
  });
  if (!res.ok) {
    console.warn(`[notify] webhook responded ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

async function sendResendEmail(p: InquiryPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_EMAIL_TO;
  const from = process.env.INQUIRY_EMAIL_FROM || "noreply@mlkit.co.kr";
  if (!apiKey || !to) return;

  const subject = `[${SITE_NAME}] 신규 상담 — ${p.organization || p.name}`;
  const text = formatPlainText(p);
  const html = `<pre style="font-family:Pretendard,system-ui,sans-serif;white-space:pre-wrap;line-height:1.6;font-size:14px;">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")}</pre>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });
  if (!res.ok) {
    console.warn(`[notify] resend responded ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

/**
 * 알림 발송 — 모든 채널 시도, 실패해도 throw 안 함.
 */
export async function notifyInquiry(p: InquiryPayload): Promise<void> {
  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;

  const tasks: Promise<void>[] = [];

  if (webhookUrl) {
    tasks.push(sendWebhook(webhookUrl, p).catch((err) => console.warn("[notify] webhook error", err)));
  }

  if (process.env.RESEND_API_KEY && process.env.INQUIRY_EMAIL_TO) {
    tasks.push(sendResendEmail(p).catch((err) => console.warn("[notify] resend error", err)));
  }

  if (tasks.length === 0) {
    // 알림 채널 미설정 — console.log fallback
    console.log("[inquiry] 알림 채널 미설정. INQUIRY_WEBHOOK_URL 또는 RESEND_API_KEY 설정 권장.");
    console.log("[inquiry payload]", formatPlainText(p));
    return;
  }

  await Promise.allSettled(tasks);
}
