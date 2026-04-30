"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SECTIONS,
  QUESTIONS,
  getQuestionsBySection,
  type SectionId,
  type Question,
} from "@/lib/tools/risk-assessment/questions.v3";
import {
  QUESTIONS_V4,
  STEPS_V4,
  getQuestionsByStep,
  validateV4Input,
  type V4Question,
} from "@/lib/tools/risk-assessment/questions.v4";

// ── Inline resolveGrade (pure, no server deps) ──
function resolveGradePreview(
  dataGrade: string | undefined,
  mixedGrade: string[]
): { grade: string; label: string; reason: string } | null {
  if (!dataGrade) return null;
  let resolved = dataGrade;
  let reason = "";

  if (dataGrade === "O") {
    const hasPersonal = mixedGrade.includes("personal_info");
    const hasTrade = mixedGrade.includes("trade_secret");
    if (hasPersonal || hasTrade) {
      resolved = "S";
      reason = `${hasPersonal ? "개인정보" : ""}${hasPersonal && hasTrade ? "·" : ""}${hasTrade ? "영업비밀" : ""} 포함으로 S 등급 자동 승계`;
    } else {
      reason = "일반 정보 — 등급 유지";
    }
  } else if (dataGrade === "S") {
    reason = "민감 등급 유지";
  } else if (dataGrade === "C") {
    reason = "기밀 등급 유지";
  }

  const gradeLabels: Record<string, string> = { C: "C 등급 (기밀)", S: "S 등급 (민감)", O: "O 등급 (공개)" };
  return { grade: resolved, label: gradeLabels[resolved] ?? resolved, reason };
}

// ── V3 Form (legacy, ?ver=3) ──

type V3Step = "lead" | SectionId | "submitting";
const V3_SECTION_ORDER: SectionId[] = SECTIONS.map((s) => s.id);

function V3Form() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    for (const q of QUESTIONS) {
      if (q.defaultValue !== undefined) defaults[q.id] = q.defaultValue;
      else if (q.type === "boolean") defaults[q.id] = false;
      else if (q.type === "multiselect") defaults[q.id] = [];
    }
    return defaults;
  });
  const [step, setStep] = useState<V3Step>("lead");
  const [error, setError] = useState("");

  const currentSectionIdx = V3_SECTION_ORDER.indexOf(step as SectionId);
  const totalSteps = V3_SECTION_ORDER.length + 1;
  const currentStepNum = step === "lead" ? 1 : step === "submitting" ? totalSteps : currentSectionIdx + 2;
  const progressPercent = Math.round(((currentStepNum - 1) / totalSteps) * 100);

  const currentQuestions = useMemo(() => {
    if (step === "lead" || step === "submitting") return [];
    return getQuestionsBySection(step as SectionId);
  }, [step]);

  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMultiselect(id: string, optionValue: string) {
    setAnswers((prev) => {
      const current = (prev[id] as string[]) || [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      return { ...prev, [id]: next };
    });
  }

  function validateSection(): boolean {
    for (const q of currentQuestions) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (q.type === "number" && (val === undefined || val === "" || val === null)) {
        setError(`"${q.label}" 항목을 입력해주세요.`);
        return false;
      }
      if (q.type === "select" && (!val || val === "")) {
        setError(`"${q.label}" 항목을 선택해주세요.`);
        return false;
      }
      if (q.type === "multiselect" && (!val || (val as string[]).length === 0)) {
        setError(`"${q.label}" 항목을 1개 이상 선택해주세요.`);
        return false;
      }
    }
    setError("");
    return true;
  }

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setError("개인정보 처리 동의가 필요합니다."); return; }
    setError("");
    setStep(V3_SECTION_ORDER[0]);
  }

  function handleNext() {
    if (!validateSection()) return;
    const nextIdx = currentSectionIdx + 1;
    if (nextIdx < V3_SECTION_ORDER.length) setStep(V3_SECTION_ORDER[nextIdx]);
    else handleSubmit();
  }

  function handlePrev() {
    setError("");
    if (currentSectionIdx === 0) setStep("lead");
    else setStep(V3_SECTION_ORDER[currentSectionIdx - 1]);
  }

  async function handleSubmit() {
    setStep("submitting");
    setError("");
    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || null, company: company || null, source: "diagnostic", consent_marketing: consent }),
      });
      if (!leadRes.ok) throw new Error("리드 생성 실패");
      const lead = await leadRes.json();

      const input = {
        platform: answers.platform as string,
        vm_count: Number(answers.vm_count) || 0,
        host_count: Number(answers.host_count) || 0,
        concurrent_users: answers.concurrent_users ? Number(answers.concurrent_users) : undefined,
        storage_type: answers.storage_type as string,
        storage_protocol: (answers.storage_protocol as string) || "unknown",
        storage_migration: Boolean(answers.storage_migration),
        multipath_configured: (answers.multipath_configured as string) || "unknown",
        network_separation: Boolean(answers.network_separation),
        ha_enabled: answers.ha_enabled as string,
        dr_site: answers.dr_site as string,
        rpo_target: answers.rpo_target as string,
        rto_target: answers.rto_target as string,
        backup_exists: answers.backup_exists as string,
        backup_frequency: (answers.backup_frequency as string) || "unknown",
        ops_staff_level: answers.ops_staff_level as string,
        incident_response_maturity: answers.incident_response_maturity as string,
        change_management: answers.change_management as string,
        documentation_level: answers.documentation_level as string,
        automation_level: answers.automation_level as string,
        provisioning_time: (answers.provisioning_time as string) || "unknown",
        migration_rehearsal: answers.migration_rehearsal as string,
        access_method: answers.access_method as string[],
        mfa_enabled: answers.mfa_enabled as string,
        privileged_access_control: (answers.privileged_access_control as string) || "basic",
      };

      const assessRes = await fetch("/api/tools/risk-assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input, version: "v3" }),
      });
      if (!assessRes.ok) throw new Error("진단 실행 실패");
      const result = await assessRes.json();

      const reportRes = await fetch(`/api/reports/${result.tool_run_id}/generate`, { method: "POST" });
      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      router.push(`/thank-you?report=${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep(V3_SECTION_ORDER[V3_SECTION_ORDER.length - 1]);
    }
  }

  function renderQuestion(q: Question) {
    const val = answers[q.id];
    return (
      <div key={q.id} className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {q.label}
          {q.required && <span className="text-red-500 ml-0.5">*</span>}
          {!q.required && <span className="text-gray-400 text-xs ml-1">(선택)</span>}
        </label>
        {q.help && <p className="text-xs text-gray-400">{q.help}</p>}
        {q.type === "select" && (
          <select value={(val as string) || ""} onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <option value="">선택하세요</option>
            {q.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )}
        {q.type === "number" && (
          <input type="number" value={val !== undefined && val !== null ? String(val) : ""}
            onChange={(e) => setAnswer(q.id, e.target.value === "" ? "" : Number(e.target.value))}
            min={0} placeholder={q.id === "vm_count" ? "예: 200" : q.id === "host_count" ? "예: 10" : "숫자 입력"}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        )}
        {q.type === "boolean" && (
          <div className="flex gap-3">
            {[{ value: true, label: "예" }, { value: false, label: "아니오" }].map((opt) => (
              <button key={String(opt.value)} type="button" onClick={() => setAnswer(q.id, opt.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${val === opt.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {q.type === "multiselect" && (
          <div className="flex flex-wrap gap-2">
            {q.options?.map((opt) => {
              const selected = ((val as string[]) || []).includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => toggleMultiselect(q.id, opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {selected && <svg className="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const currentSection = SECTIONS.find((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VDI 리스크 진단 <span className="text-sm font-normal text-gray-400">(Legacy)</span></h1>
              <p className="text-sm text-gray-500 mt-0.5">6개 영역 · 25개 항목 · 약 3~5분 소요</p>
            </div>
          </div>
          {step !== "submitting" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {step === "lead" ? "기본 정보" : `${currentSectionIdx + 1}/${V3_SECTION_ORDER.length} ${currentSection?.title || ""}`}
                </span>
                <span className="text-xs font-medium text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex justify-between mt-3">
                {["정보", ...SECTIONS.map((s) => s.title.split("/")[0].slice(0, 3))].map((label, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${i + 1 < currentStepNum ? "bg-blue-600 text-white" : i + 1 === currentStepNum ? "bg-blue-600 text-white ring-2 ring-blue-200" : "bg-gray-200 text-gray-400"}`}>
                      {i + 1 < currentStepNum ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
                    </div>
                    <span className={`text-[10px] ${i + 1 <= currentStepNum ? "text-blue-600 font-medium" : "text-gray-400"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3" role="alert" aria-live="assertive">
            <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {step === "lead" && (
          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-gray-900">기본 정보 입력</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">회사</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="(주)회사명"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm text-gray-600">진단 결과 제공을 위한 개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span></span>
              </label>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
              진단 시작하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </form>
        )}

        {step !== "lead" && step !== "submitting" && currentSection && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <h2 className="font-semibold text-lg text-gray-900">{currentSection.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{currentSection.description}</p>
              </div>
              {currentQuestions.map(renderQuestion)}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handlePrev} className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
                {currentSectionIdx === V3_SECTION_ORDER.length - 1 ? (
                  <><span>진단 실행</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></>
                ) : (
                  <><span>다음</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800 animate-pulse">심층 진단 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2">6개 영역, 25개 항목을 분석하고 컨설팅급 리포트를 생성하고 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── V4 Form (default, 8 steps) ──

type V4Step = "lead" | number | "submitting";

function V4Form() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);

  const [answers, setAnswers] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    for (const q of QUESTIONS_V4) {
      if (q.defaultValue !== undefined) defaults[q.id] = q.defaultValue;
      else if (q.type === "boolean") defaults[q.id] = false;
      else if (q.type === "multiselect" || q.type === "checkbox") defaults[q.id] = [];
    }
    return defaults;
  });

  const [step, setStep] = useState<V4Step>("lead");
  const [error, setError] = useState("");

  const TOTAL_STEPS = STEPS_V4.length; // 8
  const currentStepNum = step === "lead" ? 0 : step === "submitting" ? TOTAL_STEPS + 1 : (step as number);
  const progressPercent = step === "lead" ? 0 : step === "submitting" ? 100 : Math.round(((currentStepNum - 1) / TOTAL_STEPS) * 100);

  const currentStepMeta = typeof step === "number" ? STEPS_V4.find((s) => s.step === step) : null;
  const currentQuestions: V4Question[] = useMemo(() => {
    if (typeof step !== "number") return [];
    return getQuestionsByStep(step);
  }, [step]);

  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckbox(id: string, optionValue: string) {
    setAnswers((prev) => {
      const current = (prev[id] as string[]) || [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      return { ...prev, [id]: next };
    });
  }

  // Live grade preview (Step 2)
  const gradePreview = useMemo(() => {
    if (step !== 2) return null;
    return resolveGradePreview(
      answers.data_grade as string | undefined,
      (answers.mixed_grade as string[]) || []
    );
  }, [step, answers.data_grade, answers.mixed_grade]);

  function validateCurrentStep(): boolean {
    for (const q of currentQuestions) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (q.type === "number" && (val === undefined || val === "" || val === null)) {
        setError(`"${q.question}" 항목을 입력해주세요.`);
        return false;
      }
      if ((q.type === "select" || q.type === "radio") && (!val || val === "")) {
        setError(`"${q.question}" 항목을 선택해주세요.`);
        return false;
      }
      if ((q.type === "multiselect" || q.type === "checkbox") && (!val || (val as string[]).length === 0)) {
        setError(`"${q.question}" 항목을 1개 이상 선택해주세요.`);
        return false;
      }
    }
    setError("");
    return true;
  }

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setError("개인정보 처리 동의가 필요합니다."); return; }
    setError("");
    setStep(1);
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    const nextStep = (step as number) + 1;
    if (nextStep <= TOTAL_STEPS) setStep(nextStep);
    else handleSubmit();
  }

  function handlePrev() {
    setError("");
    if (step === 1) setStep("lead");
    else if (typeof step === "number") setStep(step - 1);
  }

  async function handleSubmit() {
    setStep("submitting");
    setError("");

    // Final validation before submit
    const v4Input = buildV4Input();
    const validation = validateV4Input(v4Input);
    if (!validation.ok) {
      setError(validation.errors[0]);
      setStep(TOTAL_STEPS);
      return;
    }

    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || null, company: company || null, source: "diagnostic_v4", consent_marketing: consent }),
      });
      if (!leadRes.ok) throw new Error("리드 생성 실패");
      const lead = await leadRes.json();

      const assessRes = await fetch("/api/tools/risk-assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: v4Input, version: "v4" }),
      });
      if (!assessRes.ok) throw new Error("진단 실행 실패");
      const result = await assessRes.json();

      const reportRes = await fetch(`/api/reports/${result.tool_run_id}/generate`, { method: "POST" });
      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      router.push(`/thank-you?report=${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep(TOTAL_STEPS);
    }
  }

  function buildV4Input() {
    return {
      platform: answers.platform as string,
      vm_count: Number(answers.vm_count) || 0,
      host_count: Number(answers.host_count) || 0,
      concurrent_users: answers.concurrent_users ? Number(answers.concurrent_users) : undefined,
      data_grade: answers.data_grade as "C" | "S" | "O",
      mixed_grade: ((answers.mixed_grade as string[]) || []) as Array<"personal_info" | "trade_secret" | "system_log" | "open_data">,
      service_model: answers.service_model as "model3_saas_collab" | "model8_doc_mgmt" | "model10_wireless" | "other",
      storage_type: answers.storage_type as string,
      storage_protocol: (answers.storage_protocol as string) || "unknown",
      storage_migration: Boolean(answers.storage_migration),
      multipath_configured: (answers.multipath_configured as string) || "unknown",
      network_separation: Boolean(answers.network_separation),
      ha_enabled: answers.ha_enabled as string,
      dr_site: answers.dr_site as string,
      rpo_target: answers.rpo_target as string,
      rto_target: answers.rto_target as string,
      backup_exists: answers.backup_exists as string,
      backup_frequency: (answers.backup_frequency as string) || "unknown",
      ops_staff_level: answers.ops_staff_level as string,
      incident_response_maturity: answers.incident_response_maturity as string,
      change_management: answers.change_management as string,
      documentation_level: answers.documentation_level as string,
      automation_level: answers.automation_level as string,
      provisioning_time: (answers.provisioning_time as string) || "unknown",
      migration_rehearsal: answers.migration_rehearsal as string,
      access_method: (answers.access_method as string[]) || [],
      mfa_enabled: answers.mfa_enabled as string,
      privileged_access_control: (answers.privileged_access_control as string) || "basic",
    };
  }

  function renderV4Question(q: V4Question) {
    const val = answers[q.id];

    // Step 2 special rendering
    if (q.id === "data_grade") {
      return (
        <div key={q.id} className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {q.question} <span className="text-red-500">*</span>
            </p>
            {q.inline_help && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-3">
                {q.inline_help}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {q.options?.map((opt) => (
              <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"}`}>
                <input type="radio" name={q.id} value={opt.value} checked={val === opt.value} onChange={() => setAnswer(q.id, opt.value)} className="mt-0.5 accent-blue-600 w-4 h-4 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-semibold ${val === opt.value ? "text-blue-700" : "text-gray-800"}`}>{opt.label}</p>
                  {opt.desc && <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>}
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (q.id === "mixed_grade") {
      const selected = (val as string[]) || [];
      return (
        <div key={q.id} className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {q.question} <span className="text-gray-400 text-xs">(선택)</span>
            </p>
            {q.inline_help && <p className="text-xs text-gray-500 mb-2">{q.inline_help}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {q.options?.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <label key={opt.value} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${isChecked ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200"}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleCheckbox(q.id, opt.value)} className="accent-blue-600 w-4 h-4 flex-shrink-0" />
                  <span className={`text-sm ${isChecked ? "text-blue-700 font-medium" : "text-gray-700"}`}>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {gradePreview && (
            <div className={`p-3 rounded-lg border text-sm flex items-start gap-2 ${gradePreview.grade === "C" ? "bg-red-50 border-red-200 text-red-800" : gradePreview.grade === "S" ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-green-50 border-green-200 text-green-800"}`}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span><strong>선택 결과: {gradePreview.label}</strong> — {gradePreview.reason}</span>
            </div>
          )}
        </div>
      );
    }

    // Step 3: service_model radio cards
    if (q.id === "service_model") {
      return (
        <div key={q.id} className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {q.question} <span className="text-red-500">*</span>
            </p>
            {q.inline_help && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 mb-3">
                {q.inline_help}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {q.options?.map((opt) => (
              <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"}`}>
                <input type="radio" name={q.id} value={opt.value} checked={val === opt.value} onChange={() => setAnswer(q.id, opt.value)} className="mt-0.5 accent-blue-600 w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${val === opt.value ? "text-blue-700" : "text-gray-800"}`}>{opt.label}</p>
                  </div>
                  {opt.desc && <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>}
                  {opt.value === "other" && val === opt.value && (
                    <p className="text-xs text-amber-700 mt-1 bg-amber-50 p-2 rounded">v1 기준 일반 점수만 산출되며, 모델별 권고 통제는 표시되지 않습니다.</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }

    // Default rendering for other question types
    return (
      <div key={q.id} className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {q.question}
          {q.required && <span className="text-red-500 ml-0.5">*</span>}
          {!q.required && <span className="text-gray-400 text-xs ml-1">(선택)</span>}
        </label>
        {q.inline_help && <p className="text-xs text-gray-400">{q.inline_help}</p>}

        {q.type === "select" && (
          <select value={(val as string) || ""} onChange={(e) => setAnswer(q.id, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
            <option value="">선택하세요</option>
            {q.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )}

        {q.type === "radio" && (
          <div className="grid gap-2">
            {q.options?.map((opt) => (
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200"}`}>
                <input type="radio" name={q.id} value={opt.value} checked={val === opt.value} onChange={() => setAnswer(q.id, opt.value)} className="accent-blue-600 w-4 h-4 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium ${val === opt.value ? "text-blue-700" : "text-gray-700"}`}>{opt.label}</p>
                  {opt.desc && <p className="text-xs text-gray-500">{opt.desc}</p>}
                </div>
              </label>
            ))}
          </div>
        )}

        {q.type === "number" && (
          <input type="number" value={val !== undefined && val !== null ? String(val) : ""}
            onChange={(e) => setAnswer(q.id, e.target.value === "" ? "" : Number(e.target.value))}
            min={0} placeholder={q.id === "vm_count" ? "예: 200" : q.id === "host_count" ? "예: 10" : "숫자 입력"}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        )}

        {q.type === "boolean" && (
          <div className="flex gap-3">
            {[{ value: true, label: "예" }, { value: false, label: "아니오" }].map((opt) => (
              <button key={String(opt.value)} type="button" onClick={() => setAnswer(q.id, opt.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${val === opt.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {(q.type === "multiselect" || q.type === "checkbox") && (
          <div className="flex flex-wrap gap-2">
            {q.options?.map((opt) => {
              const selected = ((val as string[]) || []).includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => toggleCheckbox(q.id, opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {selected && <svg className="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">N²SF 정렬 진단</h1>
              <p className="text-sm text-gray-500 mt-0.5">8개 영역 · 28개 항목 · N²SF 기반 · 약 5~7분 소요</p>
            </div>
          </div>

          {/* Progress Bar */}
          {step !== "submitting" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {step === "lead"
                    ? "기본 정보"
                    : `Step ${currentStepNum} / ${TOTAL_STEPS} — ${currentStepMeta?.title || ""}`}
                </span>
                <span className="text-xs font-medium text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              {/* Step dots — 9 total: lead + 8 sections */}
              <div className="flex justify-between mt-3 gap-1">
                {["정보", ...STEPS_V4.map((s) => s.title.split("/")[0].slice(0, 3))].map((label, i) => {
                  const dotStep = i; // 0=lead, 1-8=steps
                  const dotActive = step === "lead" ? dotStep === 0 : dotStep === currentStepNum;
                  const dotDone = step === "lead" ? false : dotStep < currentStepNum;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 min-w-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold transition-colors flex-shrink-0 ${dotDone ? "bg-blue-600 text-white" : dotActive ? "bg-blue-600 text-white ring-2 ring-blue-200" : "bg-gray-200 text-gray-400"}`}>
                        {dotDone ? <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
                      </div>
                      <span className={`text-[9px] truncate max-w-[28px] text-center ${dotDone || dotActive ? "text-blue-600 font-medium" : "text-gray-400"}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3" role="alert" aria-live="assertive">
            <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Step 0: Lead Info */}
        {step === "lead" && (
          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              <strong>본 진단은 N²SF 적절성 평가의 사전 준비도 측정 도구입니다.</strong> 국가정보원 보안성 검토는 별도의 외부 절차이며, 본 진단 결과로 대체될 수 없습니다.
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-gray-900">기본 정보 입력</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">회사</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="(주)회사명"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm text-gray-600">진단 결과 제공을 위한 개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span></span>
              </label>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
              진단 시작하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </form>
        )}

        {/* Step sections */}
        {typeof step === "number" && currentStepMeta && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <h2 className="font-semibold text-lg text-gray-900">{currentStepMeta.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{currentStepMeta.description}</p>
              </div>
              {currentQuestions.map(renderV4Question)}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handlePrev} className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2">
                {step === TOTAL_STEPS ? (
                  <><span>진단 실행</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></>
                ) : (
                  <><span>다음</span><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Submitting */}
        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800 animate-pulse">N²SF 정렬 분석 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2">8개 영역 28개 항목을 274개 N²SF 보안통제와 매핑하고 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Router: reads ?ver query param ──
function RiskAssessmentRouter() {
  const searchParams = useSearchParams();
  const isV3 = searchParams.get("ver") === "3";
  return isV3 ? <V3Form /> : <V4Form />;
}

export default function RiskAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <RiskAssessmentRouter />
    </Suspense>
  );
}
