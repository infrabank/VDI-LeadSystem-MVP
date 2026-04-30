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
  { value: "public-corp", label: "공공기관/공기업" },
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
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!organizationName) {
      setError("기관명을 입력해주세요.");
      return;
    }
    if (!consent) {
      setError("개인정보 처리 동의가 필요합니다.");
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
      if (!leadRes.ok) throw new Error("리드 생성 실패");
      const lead = await leadRes.json();

      // 2. Run diagnosis
      const runRes = await fetch("/api/tools/n2sf-readiness/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: answers }),
      });
      if (!runRes.ok) throw new Error("진단 실행 실패");
      const result = await runRes.json();

      // 3. Generate report (web token only — no PDF in Phase 1)
      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      router.push(`/reports/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep(SECTION_ORDER[SECTION_ORDER.length - 1]);
    }
  }

  function renderQuestion(q: Question) {
    const val = answers[q.id] || "";
    return (
      <div key={q.id} className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {q.label}
          {q.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {q.help && <p className="text-xs text-slate-400">{q.help}</p>}
        <select
          value={val}
          onChange={(e) => setAnswer(q.id, e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                N²SF 전환 준비도 진단
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                5개 영역 · 15개 항목 · 약 3분 소요
              </p>
            </div>
          </div>

          {step !== "submitting" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-500">
                  {step === "lead"
                    ? "기관 정보"
                    : `${currentSectionIdx + 1}/${SECTION_ORDER.length} ${currentSection?.title || ""}`}
                </span>
                <span className="text-xs font-medium text-blue-700">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {step === "lead" && (
          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-slate-900">기관 정보 입력</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    기관명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 한국OO공단"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    기관 유형
                  </label>
                  <select
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    부서
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="정보화기획팀"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="02-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? "border-blue-700 bg-blue-50 text-blue-800"
                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  상담 희망 내용 (선택)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="현재 환경의 고민이나 상담받고 싶은 주제를 자유롭게 적어주세요."
                />
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-700 cursor-pointer"
                />
                <span className="text-sm text-slate-700">
                  진단 결과 제공 및 상담 안내를 위한 개인정보 수집·이용에 동의합니다.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              진단 시작하기 →
            </button>
          </form>
        )}

        {step !== "lead" && step !== "submitting" && currentSection && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="font-semibold text-lg text-slate-900">
                  {currentSection.title}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {currentSection.description}
                </p>
              </div>
              {currentQuestions.map(renderQuestion)}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 py-3 border border-slate-300 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
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
            <p className="text-lg font-semibold text-slate-800">
              N²SF 전환 준비도를 분석하고 있습니다...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              5개 영역 점수 산출 + 단계별 로드맵 생성 중
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
