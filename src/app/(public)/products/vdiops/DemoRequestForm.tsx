"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const POOL_TYPES = [
  { value: "manual-fc", label: "Manual / Full Clone" },
  { value: "instant-clone", label: "Instant Clone" },
  { value: "mixed", label: "혼합" },
] as const;

type Step = "form" | "submitting" | "done" | "error";

const inputClass = (invalid: boolean) =>
  `w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
    invalid ? "border-red-400 bg-red-50/50" : "border-gray-300"
  }`;

export default function DemoRequestForm() {
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [horizonVersion, setHorizonVersion] = useState("");
  const [poolType, setPoolType] = useState("");
  const [vmCount, setVmCount] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const errorBoxRef = useRef<HTMLDivElement>(null);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!organization.trim()) next.organization = "기관명을 입력해 주세요.";
    if (!name.trim()) next.name = "담당자 이름을 입력해 주세요.";
    if (!email.trim()) next.email = "이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "이메일 형식을 확인해 주세요.";
    if (phone && !/^[0-9+\-\s()]{0,30}$/.test(phone)) next.phone = "연락처 형식을 확인해 주세요.";
    if (!consent) next.consent = "개인정보 수집·이용 동의가 필요합니다.";
    return next;
  }

  const FIELD_ORDER = ["organization", "name", "email", "phone", "consent"];

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
          : `입력을 확인해 주세요. ${Object.keys(found).length}개 항목이 남았습니다.`,
      );
      const el = firstKey ? document.getElementById(`demo-${firstKey}`) : null;
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        (el as HTMLElement).focus({ preventScroll: true });
      } else {
        errorBoxRef.current?.focus();
      }
      return;
    }

    const poolLabel = POOL_TYPES.find((p) => p.value === poolType)?.label;
    const details = [
      horizonVersion.trim() && `- Horizon 버전: ${horizonVersion.trim()}`,
      poolLabel && `- 풀 유형: ${poolLabel}`,
      vmCount.trim() && `- VM 대수: ${vmCount.trim()}`,
    ].filter(Boolean);
    const body = [
      "VDIOps 데모 신청",
      "",
      message.trim() || "(메시지 없음)",
      "",
      "[환경]",
      ...(details.length > 0 ? details : ["- 미입력"]),
    ].join("\n");

    setStep("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          phone: phone.trim() || null,
          interestAreas: ["vdiops"],
          message: body,
          source: "vdiops-demo",
          consentMarketing: false,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송에 실패했습니다.");
      setStep("error");
    }
  }

  if (step === "done") {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6 sm:p-10 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 kr-keep-all">
          데모 신청이 접수되었습니다
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 kr-keep-all">
          1영업일 안에 담당 엔지니어가 회신해 대상 여부를 확인하고 일정을 잡습니다.
        </p>
        <Link
          href="/tools/vdi-ops-checklist"
          className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
        >
          VDI 운영 진단 체크리스트 채우기
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="demo-organization" className="block text-sm font-medium text-gray-700 mb-1.5">
            기관명 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="demo-organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            aria-invalid={!!fieldErrors.organization}
            aria-describedby={fieldErrors.organization ? "demo-organization-error" : undefined}
            className={inputClass(!!fieldErrors.organization)}
          />
          {fieldErrors.organization && (
            <p id="demo-organization-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.organization}</p>
          )}
        </div>
        <div>
          <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            담당자 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="demo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "demo-name-error" : undefined}
            className={inputClass(!!fieldErrors.name)}
          />
          {fieldErrors.name && (
            <p id="demo-name-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            이메일 <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="demo-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "demo-email-error" : undefined}
            className={inputClass(!!fieldErrors.email)}
          />
          {fieldErrors.email && (
            <p id="demo-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="demo-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            전화 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <input
            id="demo-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="044-000-0000"
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "demo-phone-error" : undefined}
            className={inputClass(!!fieldErrors.phone)}
          />
          {fieldErrors.phone && (
            <p id="demo-phone-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.phone}</p>
          )}
        </div>
        <div>
          <label htmlFor="demo-horizon" className="block text-sm font-medium text-gray-700 mb-1.5">
            Horizon 버전 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <input
            id="demo-horizon"
            type="text"
            value={horizonVersion}
            onChange={(e) => setHorizonVersion(e.target.value)}
            placeholder="예: 8.12, 2312"
            className={inputClass(false)}
          />
        </div>
        <div>
          <label htmlFor="demo-pool" className="block text-sm font-medium text-gray-700 mb-1.5">
            풀 유형 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <select
            id="demo-pool"
            value={poolType}
            onChange={(e) => setPoolType(e.target.value)}
            className={`${inputClass(false)} bg-white`}
          >
            <option value="">선택</option>
            {POOL_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="demo-vm" className="block text-sm font-medium text-gray-700 mb-1.5">
            VM 대수 <span className="text-xs text-gray-600">(선택)</span>
          </label>
          <input
            id="demo-vm"
            type="text"
            inputMode="numeric"
            value={vmCount}
            onChange={(e) => setVmCount(e.target.value)}
            placeholder="예: 300"
            className={inputClass(false)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="demo-message" className="block text-sm font-medium text-gray-700 mb-1.5">
          메시지 <span className="text-xs text-gray-600">(선택)</span>
        </label>
        <textarea
          id="demo-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="예: Manual 풀 VM을 운영자가 직접 만들고 있고, 담당자 한 명이 교체를 맡고 있습니다. 희망 일정은 다음 주 오후입니다."
          className={inputClass(false)}
        />
      </div>

      <div className="space-y-2">
        <label
          className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
            fieldErrors.consent ? "bg-red-50 border border-red-300" : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input
            id="demo-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!fieldErrors.consent}
            aria-describedby={fieldErrors.consent ? "demo-consent-error" : undefined}
            className="mt-0.5 w-6 h-6 flex-shrink-0 accent-gray-900"
          />
          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
            <strong className="text-gray-900">[필수]</strong> 개인정보 수집·이용 및 국외이전(위탁)에 동의합니다.
            <span className="block text-2xs text-gray-500 mt-1">
              수집 항목: 기관명·담당자·이메일·전화·환경 정보·메시지 · 이용 목적: 데모 일정 조율과 회신
              · 보관 기간: 상담 완료 후 1년 · 국외이전: Supabase·Vercel·Resend(미국)에 저장·호스팅·이메일 발송을 위탁합니다.
              <Link href="/legal/privacy" target="_blank" className="text-gray-900 underline ml-1 inline-flex items-center min-h-[24px]">
                전체 처리방침 보기
              </Link>
            </span>
          </span>
        </label>
        {fieldErrors.consent && (
          <p id="demo-consent-error" className="px-1 text-xs text-red-700">{fieldErrors.consent}</p>
        )}
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
        className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm sm:text-base transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {step === "submitting" ? "전송 중..." : "데모 신청 보내기"}
      </button>
      <p className="text-center text-xs text-gray-600 kr-keep-all">
        1영업일 안에 담당 엔지니어가 회신합니다. 영업 전화를 돌리지 않습니다.
      </p>
    </form>
  );
}
