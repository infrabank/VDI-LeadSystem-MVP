"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VDI_ROLE_QUESTIONS,
  type VdiRoleQuestion,
} from "@/lib/tools/vdi-role/questions";

type Step = "lead" | "questions" | "submitting";

const ORG_TYPES = [
  { value: "central", label: "중앙행정기관" },
  { value: "local", label: "지방자치단체" },
  { value: "public-corp", label: "공공기관·공기업" },
  { value: "agency", label: "소속·산하기관" },
  { value: "private", label: "민간기업" },
  { value: "other", label: "기타" },
] as const;

export default function VdiTransitionDiagnosisPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("lead");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function validateAll(): boolean {
    for (const q of VDI_ROLE_QUESTIONS) {
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
    if (!email.trim()) found["vt-email"] = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found["vt-email"] = "이메일 형식을 확인해주세요.";
    if (!organizationName.trim()) found["vt-organizationName"] = "기관·회사명을 입력해주세요.";
    if (!consent) found["vt-consent"] = "개인정보 처리 동의가 필요합니다.";
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
    setStep("questions");
  }

  async function handleSubmit() {
    if (!validateAll()) return;
    setStep("submitting");
    setError("");

    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          company: organizationName,
          source: "vdi-role",
          consent_marketing: consent,
          extension: {
            organization_name: organizationName,
            organization_type: organizationType || null,
            department: department || null,
            phone: phone || null,
            interest_area: ["vdi-transition"],
          },
        }),
      });
      if (!leadRes.ok) throw new Error("정보 저장에 실패했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.");
      const lead = await leadRes.json();

      const runRes = await fetch("/api/tools/vdi-role/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: answers }),
      });
      if (!runRes.ok) throw new Error("진단 실행에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const result = await runRes.json();

      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const report = await reportRes.json();

      router.push(`/reports/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
      setStep("questions");
    }
  }

  function renderQuestion(q: VdiRoleQuestion, idx: number) {
    const val = answers[q.id] || "";
    return (
      <div key={q.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <span className="inline-block w-6 h-6 mr-2 text-xs font-bold bg-blue-700 text-white rounded-full text-center leading-6">
            {idx + 1}
          </span>
          {q.label}
          {q.required && <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>}
        </label>
        {q.help && <p className="text-xs text-slate-400 ml-8">{q.help}</p>}
        <div className="ml-8 space-y-1.5">
          {q.options.map((opt) => {
            const selected = val === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnswer(q.id, opt.value)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  selected
                    ? "border-blue-700 bg-blue-50 text-blue-800"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {selected && <span className="mr-2 text-blue-700">●</span>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM10 9v6l5-3-5-3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 kr-keep-all">
                VDI 역할 재정의 진단
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                9개 문항 · 약 2분 · 4가지 전환 시나리오 중 추천
              </p>
            </div>
          </div>
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
              <h2 className="font-semibold text-base md:text-lg text-slate-900 kr-keep-all">기본 정보</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vt-organizationName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    기관·회사명 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="vt-organizationName"
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["vt-organizationName"]}
                    aria-describedby={fieldErrors["vt-organizationName"] ? "vt-organizationName-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors["vt-organizationName"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="예: 한국OO공단"
                  />
                {fieldErrors["vt-organizationName"] && (
                  <p id="vt-organizationName-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["vt-organizationName"]}</p>
                )}
                </div>
                <div>
                  <label htmlFor="vt-organization-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                    기관 유형
                  </label>
                  <select id="vt-organization-type"
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
                  <label htmlFor="vt-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이름
                  </label>
                  <input id="vt-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label htmlFor="vt-department" className="block text-sm font-medium text-gray-700 mb-1.5">
                    부서
                  </label>
                  <input id="vt-department"
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
                  <label htmlFor="vt-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="vt-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["vt-email"]}
                    aria-describedby={fieldErrors["vt-email"] ? "vt-email-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors["vt-email"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="your@email.com"
                  />
                {fieldErrors["vt-email"] && (
                  <p id="vt-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["vt-email"]}</p>
                )}
                </div>
                <div>
                  <label htmlFor="vt-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    연락처
                  </label>
                  <input id="vt-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="02-0000-0000"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  id="vt-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!fieldErrors["vt-consent"]}
                  aria-describedby={fieldErrors["vt-consent"] ? "vt-consent-error" : undefined}
                  className="mt-0.5 w-6 h-6 flex-shrink-0 accent-blue-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  개인정보 수집·이용에 동의합니다. <span className="text-red-600" aria-hidden="true">*</span>
                </span>
              </label>
              {fieldErrors["vt-consent"] && (
                <p id="vt-consent-error" className="text-xs text-red-700">{fieldErrors["vt-consent"]}</p>
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

        {step === "questions" && (
          <div className="space-y-5">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <p className="text-sm text-gray-500 kr-keep-all">
                현재 VDI 환경을 묻는 9개 문항에 답해주세요. 답변에 따라 4가지 전환
                시나리오 중 가장 적합한 결과를 도출합니다.
              </p>
              {VDI_ROLE_QUESTIONS.map((q, i) => renderQuestion(q, i))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("lead")}
                className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition"
              >
                진단 실행
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
              VDI 역할 재정의 분석 중...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              4가지 전환 시나리오 중 최적 유형을 산출합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
