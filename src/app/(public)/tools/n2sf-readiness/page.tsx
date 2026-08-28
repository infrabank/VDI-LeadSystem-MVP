"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  SECTIONS,
  getQuestionsBySection,
  type SectionId,
  type Question,
} from "@/lib/tools/n2sf-readiness/questions";

type Step = "lead" | SectionId | "submitting";
const SECTION_ORDER: SectionId[] = SECTIONS.map((s) => s.id);

const ORG_TYPES = [
  { value: "central", label: "중앙행정기관" },
  { value: "local", label: "지방자치단체" },
  { value: "public-corp", label: "공공기관·공기업" },
  { value: "agency", label: "소속·산하기관" },
  { value: "private", label: "민간기업" },
  { value: "other", label: "기타" },
] as const;

const INTEREST_AREAS = [
  { value: "n2sf", label: "N²SF 전환 진단" },
  { value: "zero-trust", label: "제로트러스트 도입" },
  { value: "vdi-transition", label: "VDI 재배치" },
  { value: "daas", label: "DaaS 마이그레이션" },
  { value: "iam-pam", label: "IAM/PAM 강화" },
  { value: "siem", label: "로그·감사 통합" },
  { value: "consulting", label: "전반 컨설팅" },
] as const;

export default function N2sfReadinessDiagnosisPage() {
  const router = useRouter();

  // Lead form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [interestAreas, setInterestAreas] = useState<string[]>(["n2sf"]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  // Answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("lead");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const currentSectionIdx = SECTION_ORDER.indexOf(step as SectionId);
  const totalSteps = SECTION_ORDER.length + 1;
  const currentStepNum =
    step === "lead" ? 1 : step === "submitting" ? totalSteps : currentSectionIdx + 2;
  const progressPercent = Math.round(((currentStepNum - 1) / totalSteps) * 100);

  const currentQuestions = useMemo(() => {
    if (step === "lead" || step === "submitting") return [];
    return getQuestionsBySection(step as SectionId);
  }, [step]);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleInterest(value: string) {
    setInterestAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function validateSection(): boolean {
    for (const q of currentQuestions) {
      if (q.required && !answers[q.id]) {
        setError(`"${q.label}" 항목을 선택해주세요.`);
        return false;
      }
    }
    setError("");
    return true;
  }

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!email.trim()) found["n2-email"] = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found["n2-email"] = "이메일 형식을 확인해주세요.";
    if (!organizationName.trim()) found["n2-organizationName"] = "기관·회사명을 입력해주세요.";
    if (!consent) found["n2-consent"] = "개인정보 처리 동의가 필요합니다.";
    setFieldErrors(found);
    const keys = Object.keys(found);
    if (keys.length > 0) {
      setError(keys.length === 1 ? found[keys[0]] : `입력을 확인해주세요. ${keys.length}개 항목이 남았습니다.`);
      const el = document.getElementById(keys[0]);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      (el as HTMLElement | null)?.focus({ preventScroll: true });
      return;
    }
    setError("");
    setStep(SECTION_ORDER[0]);
  }

  function handleNext() {
    if (!validateSection()) return;
    const nextIdx = currentSectionIdx + 1;
    if (nextIdx < SECTION_ORDER.length) {
      setStep(SECTION_ORDER[nextIdx]);
    } else {
      handleSubmit();
    }
  }

  function handlePrev() {
    setError("");
    if (currentSectionIdx === 0) setStep("lead");
    else setStep(SECTION_ORDER[currentSectionIdx - 1]);
  }

  async function handleSubmit() {
    setStep("submitting");
    setError("");

    try {
      // 1. Create/upsert lead
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          company: organizationName,
          source: "n2sf-readiness",
          consent_marketing: consent,
          extension: {
            organization_name: organizationName,
            organization_type: organizationType || null,
            department: department || null,
            phone: phone || null,
            interest_area: interestAreas,
            message: message || null,
          },
        }),
      });
      if (!leadRes.ok) throw new Error("정보 저장에 실패했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.");
      const lead = await leadRes.json();

      // 2. Run diagnosis
      const runRes = await fetch("/api/tools/n2sf-readiness/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: answers }),
      });
      if (!runRes.ok) throw new Error("진단 실행에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const result = await runRes.json();

      // 3. Generate report (web token only — no PDF in Phase 1)
      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const report = await reportRes.json();

      router.push(`/reports/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
      setStep(SECTION_ORDER[SECTION_ORDER.length - 1]);
    }
  }

  function renderQuestion(q: Question) {
    const val = answers[q.id] || "";
    return (
      <div key={q.id} className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {q.label}
          {q.required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
        </label>
        {q.help && <p className="text-xs text-slate-400">{q.help}</p>}
        <select
          value={val}
          onChange={(e) => setAnswer(q.id, e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">선택하세요</option>
          {q.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const currentSection = SECTIONS.find((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg aria-hidden="true"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 kr-keep-all">
                N²SF 전환 준비도 진단
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                5개 영역 · 15개 문항 · 약 3분 소요
              </p>
            </div>
          </div>

          {step !== "submitting" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {step === "lead"
                    ? "기관 정보"
                    : `${currentSectionIdx + 1}/${SECTION_ORDER.length} ${currentSection?.title || ""}`}
                </span>
                <span className="text-xs font-medium text-blue-700">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-[width] duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}

        {step === "lead" && (
          <form noValidate onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-base md:text-lg text-slate-900 kr-keep-all">기관 정보 입력</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="n2-organizationName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    기관명 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="n2-organizationName"
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["n2-organizationName"]}
                    aria-describedby={fieldErrors["n2-organizationName"] ? "n2-organizationName-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors["n2-organizationName"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="예: 한국OO공단"
                  />
                {fieldErrors["n2-organizationName"] && (
                  <p id="n2-organizationName-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["n2-organizationName"]}</p>
                )}
                </div>
                <div>
                  <label htmlFor="n2-organization-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                    기관 유형
                  </label>
                  <select id="n2-organization-type"
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택</option>
                    {ORG_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="n2-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이름
                  </label>
                  <input id="n2-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label htmlFor="n2-department" className="block text-sm font-medium text-gray-700 mb-1.5">
                    부서
                  </label>
                  <input id="n2-department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="정보화기획팀"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="n2-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="n2-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["n2-email"]}
                    aria-describedby={fieldErrors["n2-email"] ? "n2-email-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors["n2-email"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="your@email.com"
                  />
                {fieldErrors["n2-email"] && (
                  <p id="n2-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["n2-email"]}</p>
                )}
                </div>
                <div>
                  <label htmlFor="n2-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    연락처
                  </label>
                  <input id="n2-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="02-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  관심 분야 (다중 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_AREAS.map((opt) => {
                    const selected = interestAreas.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleInterest(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                          selected
                            ? "border-blue-700 bg-blue-50 text-blue-800"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="n2-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  상담 희망 내용 (선택)
                </label>
                <textarea id="n2-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="현재 환경의 고민이나 상담받고 싶은 주제를 자유롭게 적어주세요."
                />
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input
                  id="n2-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!fieldErrors["n2-consent"]}
                  aria-describedby={fieldErrors["n2-consent"] ? "n2-consent-error" : undefined}
                  className="mt-0.5 w-6 h-6 flex-shrink-0 accent-blue-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  진단 결과 제공 및 상담 안내를 위한 개인정보 수집·이용에 동의합니다.{" "}
                  <span className="text-red-600" aria-hidden="true">*</span>
                </span>
              </label>
              {fieldErrors["n2-consent"] && (
                <p id="n2-consent-error" className="text-xs text-red-700">{fieldErrors["n2-consent"]}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition"
            >
              진단 시작하기
            </button>
          </form>
        )}

        {step !== "lead" && step !== "submitting" && currentSection && (
          <div className="space-y-5">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <h2 className="font-semibold text-base md:text-lg text-slate-900 kr-keep-all">
                  {currentSection.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentSection.description}
                </p>
              </div>
              {currentQuestions.map(renderQuestion)}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition"
              >
                {currentSectionIdx === SECTION_ORDER.length - 1 ? "진단 실행" : "다음 →"}
              </button>
            </div>
          </div>
        )}

        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-700 border-t-transparent animate-spin" />
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-800 kr-keep-all">
              N²SF 전환 준비도를 분석 중입니다...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              5개 영역 점수 산출 + 단계별 로드맵 생성 중
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
