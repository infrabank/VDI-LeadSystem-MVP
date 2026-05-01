"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ORG_TYPES = [
  { value: "central", label: "중앙행정기관" },
  { value: "local", label: "지방자치단체" },
  { value: "public-corp", label: "공공기관/공기업" },
  { value: "agency", label: "소속·산하기관" },
  { value: "private", label: "민간기업" },
  { value: "other", label: "기타" },
];

const INTEREST_AREAS = [
  { value: "secure-workspace", label: "보안 워크스페이스 (VDI·Zero Trust)" },
  { value: "n2sf", label: "N²SF 정렬·전환" },
  { value: "data-protection", label: "데이터 보호 (Acronis 백업·DR)" },
  { value: "ransomware", label: "랜섬웨어 대응·복원력" },
  { value: "managed-service", label: "MSP 운영 서비스" },
  { value: "other", label: "기타" },
];

type Step = "form" | "submitting" | "done" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();

  // Pre-fill from query string (e.g. /contact?source=data-protection&interest=ransomware)
  const sourceParam = searchParams.get("source") || "contact";
  const interestParam = searchParams.get("interest");
  const subjectHint = searchParams.get("subject") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");

  // 첫 마운트 시 query param으로 관심영역·메시지 사전 채우기
  useEffect(() => {
    if (interestParam && INTEREST_AREAS.some((a) => a.value === interestParam)) {
      setInterestAreas([interestParam]);
    }
    if (subjectHint) {
      setMessage(`${subjectHint}\n\n`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleInterest(value: string) {
    setInterestAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    if (!organization.trim()) return setError("기관·회사명을 입력해주세요.");
    if (message.trim().length < 10) return setError("문의 내용을 10자 이상 입력해주세요.");
    if (!consentRequired) return setError("개인정보 수집·이용 동의가 필요합니다 (필수).");

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
          department: department.trim() || null,
          phone: phone.trim() || null,
          interestAreas,
          message: message.trim(),
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
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 kr-keep-all">
          문의가 접수되었습니다
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 kr-keep-all">
          평일 1영업일 내 담당자가 회신드립니다. 긴급 사안은 직접 이메일도 함께 활용해주세요.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold"
        >
          홈으로
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 space-y-5"
    >
      {/* 이름·이메일 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 기관·기관유형 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1.5">
            기관·회사명 <span className="text-red-500">*</span>
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1.5">
            기관 유형
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
      </div>

      {/* 부서·전화 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
            부서·직책
          </label>
          <input
            id="department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            연락처
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

      {/* 관심영역 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          관심 영역 <span className="text-xs text-gray-400">(복수 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_AREAS.map((a) => {
            const active = interestAreas.includes(a.value);
            return (
              <button
                type="button"
                key={a.value}
                onClick={() => toggleInterest(a.value)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors kr-keep-all ${
                  active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 메시지 */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          문의 내용 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400">(최소 10자)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="현재 환경, 검토 중인 솔루션, 일정 등을 자유롭게 적어주세요."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 동의 — 필수와 선택 분리 (개인정보보호법 준수) */}
      <div className="space-y-2.5">
        <label className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={consentRequired}
            onChange={(e) => setConsentRequired(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600"
          />
          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
            <strong className="text-gray-900">[필수]</strong> 개인정보 수집·이용에 동의합니다.
            <span className="block text-[11px] text-gray-500 mt-1">
              수집 항목: 이름·이메일·기관명·부서·연락처·문의내용 · 이용 목적: 상담 응대 및 회신
              · 보관 기간: 상담 완료 후 1년 ·{" "}
              <Link href="/legal/privacy" target="_blank" className="text-blue-600 underline">
                전체 처리방침 보기
              </Link>
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600"
          />
          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed kr-keep-all">
            <strong className="text-gray-500">[선택]</strong> 마케팅·뉴스레터 수신에 동의합니다.
            <span className="block text-[11px] text-gray-500 mt-1">
              미동의 시에도 상담 응대는 정상 진행됩니다. 동의는 언제든 이메일 1회 회신으로 철회 가능합니다.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 kr-keep-all">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={step === "submitting"}
        className="w-full px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base shadow-sm shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {step === "submitting" ? "전송 중..." : "상담 문의 보내기"}
      </button>
    </form>
  );
}
