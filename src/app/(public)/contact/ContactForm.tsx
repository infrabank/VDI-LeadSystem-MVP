"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * 기관 유형 — 영업 채널 분류용. SI·보안 리셀러·연구기관은 실제 발주·제안 채널이 다르므로 별도 분류.
 */
const ORG_TYPES = [
  { value: "central", label: "중앙행정기관" },
  { value: "local", label: "지방자치단체" },
  { value: "public-corp", label: "공공기관·공기업" },
  { value: "research", label: "정부 출연 연구기관" },
  { value: "agency", label: "소속·산하기관" },
  { value: "si-partner", label: "SI·보안 리셀러·컨소시엄" },
  { value: "private", label: "민간기업" },
  { value: "other", label: "기타" },
];

/**
 * 문의 유형 3종 — 고객군별로 필요한 입력 항목과 언어가 다름 (2026-07 개편).
 * 유형 선택 시 상세 필드가 바뀌고, interestAreas·메시지 상세 블록이 자동 구성됨.
 */
type InquiryType = "vdi" | "maintenance" | "si";

const INQUIRY_TYPES: {
  value: InquiryType;
  label: string;
  desc: string;
  interest: string;
  submitLabel: string;
  messagePlaceholder: string;
}[] = [
  {
    value: "vdi",
    label: "VDI 장애·기술지원",
    desc: "Citrix·Horizon 접속장애, 프로파일, 인증서, 업그레이드",
    interest: "vdi",
    submitLabel: "VDI 장애 상담 보내기",
    messagePlaceholder:
      "현재 증상을 아는 만큼만 적어주세요. 예: 외부에서 Horizon 접속 시 인증서 오류가 뜨고, 내부 접속은 정상입니다.",
  },
  {
    value: "maintenance",
    label: "전산 통합 유지보수",
    desc: "PC·서버·네트워크·백업 정기 점검과 장애 대응",
    interest: "it-maintenance",
    submitLabel: "유지보수 상담 보내기",
    messagePlaceholder:
      "가장 불편한 문제부터 적어주세요. 예: 공유폴더가 자주 끊기고, 백업이 되는지 확인이 안 됩니다.",
  },
  {
    value: "si",
    label: "SI 프로젝트 협업",
    desc: "제안 단계 기술 검토, VDI·가상화·백업 전문 영역 참여",
    interest: "integrated-maintenance",
    submitLabel: "협업 문의 보내기",
    messagePlaceholder:
      "사업 개요와 필요한 역할을 적어주세요. 예: 공공기관 전산유지보수 제안에 VDI 파트 기술지원이 필요합니다.",
  },
];

/** URL param(interest/type) → 문의 유형 자동 선택 */
function inferType(typeParam: string | null, interestParam: string | null): InquiryType {
  if (typeParam === "vdi" || typeParam === "maintenance" || typeParam === "si") return typeParam;
  if (interestParam) {
    if (["vdi", "citrix", "horizon"].includes(interestParam)) return "vdi";
    if (["si-advisory", "integrated-maintenance"].includes(interestParam)) return "si";
    if (
      ["it-maintenance", "server-network", "pc-support", "monthly-checkup",
        "incident-response", "operations-improvement", "recovery-verification",
        "acronis"].includes(interestParam)
    ) {
      return "maintenance";
    }
  }
  return "vdi";
}

type Step = "form" | "submitting" | "done" | "error";

/** 유형별 상세 필드 값 (전부 선택 항목 — 입력 부담 최소화, 미입력 시 통화로 확인) */
interface DetailFields {
  [key: string]: string;
}

const DETAIL_FIELD_DEFS: Record<
  InquiryType,
  { key: string; label: string; placeholder?: string; options?: string[] }[]
> = {
  vdi: [
    { key: "product", label: "제품·버전", placeholder: "예: Citrix VAD 2203 LTSR / Horizon 8.12" },
    { key: "scale", label: "사용자·서버 규모", placeholder: "예: 동시접속 300명, VDA 20대" },
    { key: "since", label: "장애 발생 시점", placeholder: "예: 어제 오후 인증서 교체 이후" },
    {
      key: "urgency",
      label: "긴급도",
      options: ["서비스 중단 상태", "일부 사용자 장애", "불편하지만 운영 중", "사전 검토 단계"],
    },
    { key: "remote", label: "원격 접속 가능 여부", options: ["가능", "불가(방문 필요)", "확인 필요"] },
  ],
  maintenance: [
    { key: "location", label: "위치", placeholder: "예: 세종시" },
    { key: "scale", label: "임직원·PC 수", placeholder: "예: 임직원 40명 · PC 45대" },
    { key: "devices", label: "서버·NAS·네트워크 장비", placeholder: "예: 서버 2대, NAS 1대, 방화벽 1대" },
    { key: "currentVendor", label: "현재 유지보수 업체", options: ["없음", "있음", "계약 종료 예정"] },
    { key: "visit", label: "방문 점검 희망", options: ["방문 점검 희망", "원격 우선", "협의"] },
  ],
  si: [
    { key: "project", label: "사업명", placeholder: "예: OO기관 전산통합유지보수" },
    { key: "stage", label: "진행 단계", options: ["제안 준비", "제안 진행 중", "수주 후 수행", "운영 중 사업"] },
    { key: "area", label: "필요한 기술 영역", placeholder: "예: Horizon 운영 + 백업 복구검증" },
    { key: "schedule", label: "예상 일정", placeholder: "예: 3월 제안, 5월 착수" },
    { key: "residency", label: "상주·비상주", options: ["비상주", "상주 필요", "협의"] },
  ],
};

export default function ContactForm() {
  const searchParams = useSearchParams();

  // Pre-fill from query string (e.g. /contact?source=vdi-support&interest=vdi&subject=...)
  const sourceParam = searchParams.get("source") || "contact";
  const interestParam = searchParams.get("interest");
  const typeParam = searchParams.get("type");
  const subjectHint = searchParams.get("subject") || "";

  const [inquiryType, setInquiryType] = useState<InquiryType>("vdi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [phone, setPhone] = useState("");
  // 유형별로 분리 보관한다. 하나의 객체를 공유하면 유형을 바꿀 때 입력을 버려야 한다.
  const [detailsByType, setDetailsByType] = useState<Record<InquiryType, DetailFields>>({
    vdi: {},
    maintenance: {},
    si: {},
  });
  const [message, setMessage] = useState("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const errorBoxRef = useRef<HTMLDivElement>(null);

  // 첫 마운트 시 query param으로 유형·메시지 사전 채우기
  useEffect(() => {
    setInquiryType(inferType(typeParam, interestParam));
    if (subjectHint) {
      setMessage(`${subjectHint}\n\n`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeType = INQUIRY_TYPES.find((t) => t.value === inquiryType)!;
  const detailDefs = DETAIL_FIELD_DEFS[inquiryType];
  const details = detailsByType[inquiryType];

  function setDetail(key: string, value: string) {
    setDetailsByType((prev) => ({
      ...prev,
      [inquiryType]: { ...prev[inquiryType], [key]: value },
    }));
  }

  function switchType(t: InquiryType) {
    setInquiryType(t);
  }

  /** 제출 시점에 전체 필드를 한 번에 검사한다. 조건을 하나씩 끊어 문자열 하나만
      돌려주면 폼 아래쪽 오류만 보이고 어느 입력이 문제인지 알 수 없다. */
  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "이름을 입력해주세요.";
    if (!email.trim()) next.email = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "이메일 형식을 확인해주세요.";
    if (!organization.trim()) next.organization = "기관·회사명을 입력해주세요.";
    if (message.trim().length < 10) next.message = "문의 내용을 10자 이상 입력해주세요.";
    if (!consentRequired) next.consentRequired = "개인정보 수집·이용 동의가 필요합니다.";
    return next;
  }

  const FIELD_ORDER = ["name", "email", "organization", "message", "consentRequired"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const found = validate();
    setFieldErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = FIELD_ORDER.find((k) => found[k]);
      setError(
        Object.keys(found).length === 1
          ? found[firstKey!]
          : `입력을 확인해주세요. ${Object.keys(found).length}개 항목이 남았습니다.`,
      );
      const el = firstKey ? document.getElementById(firstKey) : null;
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        (el as HTMLElement).focus({ preventScroll: true });
      } else {
        errorBoxRef.current?.focus();
      }
      return;
    }

    // 유형별 상세 필드를 메시지 뒤에 구조화 블록으로 첨부 (API 스키마 변경 없이 전달)
    const detailLines = detailDefs
      .filter((d) => details[d.key]?.trim())
      .map((d) => `- ${d.label}: ${details[d.key].trim()}`);
    const detailBlock =
      detailLines.length > 0
        ? `\n\n[${activeType.label} 상세]\n${detailLines.join("\n")}`
        : "";

    setStep("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          organizationType: organizationType || null,
          department: null,
          phone: phone.trim() || null,
          interestAreas: [activeType.interest],
          message: `${message.trim()}${detailBlock}`,
          source: sourceParam,
          consentMarketing,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "전송 실패. 잠시 후 다시 시도해주세요.");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송 실패");
      setStep("error");
    }
  }

  if (step === "done") {
    return (
      <div className="bg-white rounded-xl border border-emerald-200 p-6 sm:p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
          <svg aria-hidden="true" className="w-7 h-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 kr-keep-all">
          문의가 접수되었습니다
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 kr-keep-all">
          평일 1영업일 내 담당 엔지니어가 직접 회신드립니다. 로그·스크린샷·구성도가 있다면
          회신 메일에 답장으로 첨부해 주세요.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
        >
          홈으로
        </Link>
      </div>
    );
  }

  return (
    // noValidate: 브라우저 기본 검증이 먼저 제출을 막으면 아래 handleSubmit이 실행되지 않아
    // role=alert 요약, aria-invalid, 첫 오류 필드 포커스 이동이 전부 동작하지 않는다.
    // 네이티브 말풍선은 DOM에 텍스트를 남기지 않아 지원 기술이 읽을 것도 없다.
    <form
      noValidate
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-6"
    >
      {/* 문의 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          문의 유형 <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {INQUIRY_TYPES.map((t) => {
            const active = inquiryType === t.value;
            return (
              <button
                type="button"
                key={t.value}
                onClick={() => switchType(t.value)}
                aria-pressed={active}
                className={`text-left p-3.5 rounded-lg border transition-colors kr-keep-all ${
                  active
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-300"
                }`}
              >
                <span className={`block text-sm font-bold mb-0.5 ${active ? "text-blue-700" : "text-gray-900"}`}>
                  {t.label}
                </span>
                <span className="block text-2xs text-gray-600 leading-snug">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 이름·이메일 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            이름 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.name ? "border-red-400 bg-red-50/50" : "border-gray-300"
            }`}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            이메일 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.email ? "border-red-400 bg-red-50/50" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      {/* 기관·기관유형·연락처 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1.5">
            기관·회사명 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            aria-invalid={!!fieldErrors.organization}
            aria-describedby={fieldErrors.organization ? "organization-error" : undefined}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.organization ? "border-red-400 bg-red-50/50" : "border-gray-300"
            }`}
          />
          {fieldErrors.organization && (
            <p id="organization-error" className="mt-1.5 text-xs text-red-700">
              {fieldErrors.organization}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1.5">
            기관 유형 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <select
            id="organizationType"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">선택</option>
            {ORG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            연락처 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="02-1234-5678"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 문의 내용 */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          문의 내용 <span className="text-red-600" aria-hidden="true">*</span>
          <span className="ml-2 text-xs text-gray-500">(최소 10자 · 아는 만큼만)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder={activeType.messagePlaceholder}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors.message ? "border-red-400 bg-red-50/50" : "border-gray-300"
          }`}
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.message}</p>
        )}
      </div>

      {/* 유형별 상세 (전부 선택 항목) — 기본 접힘.
          첫 화면에 필수 5개만 남겨, "아는 것만 적으면 된다"는 안내와 폼을 일치시킨다. */}
      <details className="rounded-lg border border-gray-200 bg-gray-50/60">
        <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none">
          <span className="text-sm font-medium text-gray-800">
            상세 정보 <span className="text-xs font-normal text-gray-600">(선택, 적어주시면 회신이 빨라집니다)</span>
          </span>
          <svg aria-hidden="true" className="faq-chevron w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 pb-4">
        <p className="text-xs text-gray-600 mb-3 kr-keep-all">
          모르는 항목은 비워두셔도 됩니다. 세부 내용은 회신·통화에서 확인합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {detailDefs.map((d) => (
            <div key={d.key}>
              <label htmlFor={`detail-${d.key}`} className="block text-xs font-medium text-gray-500 mb-1">
                {d.label}
              </label>
              {d.options ? (
                <select
                  id={`detail-${d.key}`}
                  value={details[d.key] || ""}
                  onChange={(e) => setDetail(d.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">선택</option>
                  {d.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`detail-${d.key}`}
                  type="text"
                  value={details[d.key] || ""}
                  onChange={(e) => setDetail(d.key, e.target.value)}
                  placeholder={d.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
        {inquiryType === "vdi" && (
          <p className="text-2xs text-gray-600 mt-2 kr-keep-all">
            로그·스크린샷·구성도는 접수 후 받으시는 회신 메일에 답장으로 첨부해 주세요.
          </p>
        )}
        </div>
      </details>

      {/* 동의 — 필수와 선택 분리 (개인정보보호법 준수) */}
      <div className="space-y-2.5">
        <label
          className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
            fieldErrors.consentRequired
              ? "bg-red-50 border border-red-300"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input
            id="consentRequired"
            type="checkbox"
            checked={consentRequired}
            onChange={(e) => setConsentRequired(e.target.checked)}
            aria-invalid={!!fieldErrors.consentRequired}
            aria-describedby={fieldErrors.consentRequired ? "consent-error" : undefined}
            className="mt-0.5 w-6 h-6 flex-shrink-0 accent-blue-600"
          />
          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
            <strong className="text-gray-900">[필수]</strong> 개인정보 수집·이용 및 국외이전(위탁)에 동의합니다.
            <span className="block text-2xs text-gray-500 mt-1">
              수집 항목: 이름·이메일·기관명·연락처·문의내용 · 이용 목적: 상담 응대 및 회신
              · 보관 기간: 상담 완료 후 1년
              <span className="block mt-0.5">
                국외이전: Supabase·Vercel·Resend(미국)에 데이터 저장·호스팅·이메일 발송을 위탁합니다.
              </span>
              <span className="block mt-0.5 text-gray-500">
                정보주체는 동의를 거부할 권리가 있으며, 거부 시 본 폼을 통한 상담 접수가 불가합니다 (이메일{" "}
                <a href="mailto:contact@mlkit.co.kr" className="text-blue-600 underline">
                  contact@mlkit.co.kr
                </a>
                {" "}직접 문의는 가능).
              </span>
              <Link href="/legal/privacy" target="_blank" className="text-blue-600 underline mt-1 inline-flex items-center min-h-[24px]">
                전체 처리방침 보기 →
              </Link>
            </span>
          </span>
        </label>
        {fieldErrors.consentRequired && (
          <p id="consent-error" className="px-1 text-xs text-red-700">
            {fieldErrors.consentRequired}
          </p>
        )}
        <label className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
            className="mt-0.5 w-6 h-6 flex-shrink-0 accent-blue-600"
          />
          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
            <strong className="text-gray-500">[선택]</strong> 마케팅·뉴스레터 수신에 동의합니다.
            <span className="block text-2xs text-gray-500 mt-1">
              미동의 시에도 상담 응대는 정상 진행됩니다. 동의는 언제든 이메일 1회 회신으로 철회 가능합니다.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div
          ref={errorBoxRef}
          role="alert"
          tabIndex={-1}
          className="px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800 kr-keep-all"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={step === "submitting"}
        className="w-full px-6 py-3 sm:py-3.5 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-sm shadow-amber-200/70 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {step === "submitting" ? "전송 중..." : activeType.submitLabel}
      </button>
      <p className="text-center text-xs text-gray-600 kr-keep-all">
        1영업일 내 담당 엔지니어가 직접 회신합니다 · 영업 전화를 돌리지 않습니다
      </p>
    </form>
  );
}
