"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  QUESTIONS_V4,
  STEPS_V4,
  getQuestionsByStep,
  validateV4Input,
  type V4Question,
} from "@/lib/tools/risk-assessment/questions.v4";
import { RiskAssessmentIntro } from "./IntroSection";

/* v3는 ?ver=3 으로만 들어오는 구버전이다. 정적 import 하면 문항 데이터가
   기본 경로 번들에 함께 실리므로 필요할 때만 내려받는다. */
const V3Form = dynamic(() => import("./V3Form"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    </div>
  ),
});

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
      reason = "일반 정보, 등급 유지";
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    const found: Record<string, string> = {};
    if (!email.trim()) found["ra-email"] = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found["ra-email"] = "이메일 형식을 확인해주세요.";
    if (!consent) found["ra-consent"] = "개인정보 처리 동의가 필요합니다.";
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
      if (!leadRes.ok) throw new Error("정보 저장에 실패했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.");
      const lead = await leadRes.json();

      const assessRes = await fetch("/api/tools/risk-assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: v4Input, version: "v4" }),
      });
      if (!assessRes.ok) throw new Error("진단 실행에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const result = await assessRes.json();

      const reportRes = await fetch(`/api/reports/${result.tool_run_id}/generate`, { method: "POST" });
      if (!reportRes.ok) throw new Error("리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const report = await reportRes.json();

      router.push(`/thank-you?report=${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
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
              {q.question} <span className="text-red-600" aria-hidden="true">*</span>
            </p>
            {q.inline_help && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-3">
                {q.inline_help}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {q.options?.map((opt) => (
              <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"}`}>
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
              {q.question} <span className="text-gray-600 text-xs">(선택)</span>
            </p>
            {q.inline_help && <p className="text-xs text-gray-500 mb-2">{q.inline_help}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options?.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <label key={opt.value} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${isChecked ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200"}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleCheckbox(q.id, opt.value)} className="accent-blue-600 w-4 h-4 flex-shrink-0" />
                  <span className={`text-sm ${isChecked ? "text-blue-700 font-medium" : "text-gray-700"}`}>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {gradePreview && (
            <div className={`p-3 rounded-lg border text-sm flex items-start gap-2 ${gradePreview.grade === "C" ? "bg-red-50 border-red-200 text-red-800" : gradePreview.grade === "S" ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
              <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span><strong>선택 결과: {gradePreview.label}</strong> ({gradePreview.reason})</span>
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
              {q.question} <span className="text-red-600" aria-hidden="true">*</span>
            </p>
            {q.inline_help && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 mb-3">
                {q.inline_help}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {q.options?.map((opt) => (
              <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"}`}>
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
          {q.required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
          {!q.required && <span className="text-gray-600 text-xs ml-1">(선택)</span>}
        </label>
        {q.inline_help && <p className="text-xs text-gray-600">{q.inline_help}</p>}

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
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${val === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200"}`}>
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
                  {selected && <svg aria-hidden="true" className="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg aria-hidden="true" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 kr-keep-all">N²SF 정렬 진단</h1>
              <p className="text-sm text-gray-500 mt-0.5">8개 영역 · 28개 문항 · 약 5~7분 소요</p>
            </div>
          </div>

          {/* Progress Bar */}
          {step !== "submitting" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {step === "lead"
                    ? "기본 정보"
                    : `Step ${currentStepNum} / ${TOTAL_STEPS} · ${currentStepMeta?.title || ""}`}
                </span>
                <span className="text-xs font-medium text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              {/* Step dots — 9 total: lead + 8 sections */}
              <div className="flex justify-between mt-3 gap-1">
                {["정보", ...STEPS_V4.map((s) => s.title.split("/")[0].slice(0, 3))].map((label, i) => {
                  const dotStep = i; // 0=lead, 1-8=steps
                  const dotActive = step === "lead" ? dotStep === 0 : dotStep === currentStepNum;
                  const dotDone = step === "lead" ? false : dotStep < currentStepNum;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 min-w-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-semibold transition-colors flex-shrink-0 ${dotDone ? "bg-blue-600 text-white" : dotActive ? "bg-blue-600 text-white ring-2 ring-blue-200" : "bg-gray-200 text-gray-600"}`}>
                        {dotDone ? <svg aria-hidden="true" className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
                      </div>
                      <span className={`text-2xs truncate max-w-[3.3em] text-center ${dotDone || dotActive ? "text-blue-600 font-medium" : "text-gray-600"}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3" role="alert" aria-live="assertive">
            <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Step 0: Lead Info */}
        {step === "lead" && (
          <>
            <RiskAssessmentIntro />
          <form noValidate onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 kr-keep-all">
              <strong>본 진단은 VDI 환경의 보안 준비도를 자가 점검하는 도구입니다.</strong> 공식 보안성 검토를 대체하지 않으며, 결과는 솔루션 권고를 위한 참고 자료로 활용됩니다.
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-gray-900">기본 정보 입력</h2>
              <div>
                <label htmlFor="ra-email" className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-600" aria-hidden="true">*</span></label>
                <input id="ra-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                  aria-invalid={!!fieldErrors["ra-email"]} aria-describedby={fieldErrors["ra-email"] ? "ra-email-error" : undefined}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${fieldErrors["ra-email"] ? "border-red-400 bg-red-50/50" : ""}`} />
                {fieldErrors["ra-email"] && <p id="ra-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["ra-email"]}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="ra-company" className="block text-sm font-medium text-gray-700 mb-1.5">기관·회사명</label>
                  <input id="ra-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="(주)회사명"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input id="ra-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!fieldErrors["ra-consent"]} aria-describedby={fieldErrors["ra-consent"] ? "ra-consent-error" : undefined} className="mt-0.5 w-6 h-6 flex-shrink-0 accent-blue-600 cursor-pointer" />
                <span className="text-sm text-gray-600">진단 결과 제공을 위한 개인정보 수집·이용에 동의합니다. <span className="text-red-600" aria-hidden="true">*</span></span>
              </label>
              {fieldErrors["ra-consent"] && <p id="ra-consent-error" className="text-xs text-red-700">{fieldErrors["ra-consent"]}</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2">
              진단 시작하기
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </form>
          </>
        )}

        {/* Step sections */}
        {typeof step === "number" && currentStepMeta && (
          <div className="space-y-5">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <h2 className="font-semibold text-lg text-gray-900">{currentStepMeta.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{currentStepMeta.description}</p>
              </div>
              {currentQuestions.map(renderV4Question)}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handlePrev} className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2">
                {step === TOTAL_STEPS ? (
                  <><span>진단 실행</span><svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></>
                ) : (
                  <><span>다음</span><svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
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
              <svg aria-hidden="true" className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-800 animate-pulse">N²SF 정렬 분석 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2 kr-keep-all">8개 영역 28개 문항을 분석해 맞춤 권고와 솔루션 제안을 만듭니다.</p>
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
