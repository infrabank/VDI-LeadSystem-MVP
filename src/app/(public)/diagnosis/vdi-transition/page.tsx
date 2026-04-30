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
  { value: "public-corp", label: "공공기관/공기업" },
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
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!organizationName) {
      setError("기관/회사명을 입력해주세요.");
      return;
    }
    if (!consent) {
      setError("개인정보 처리 동의가 필요합니다.");
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
      if (!leadRes.ok) throw new Error("리드 생성 실패");
      const lead = await leadRes.json();

      const runRes = await fetch("/api/tools/vdi-role/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, input: answers }),
      });
      if (!runRes.ok) throw new Error("진단 실행 실패");
      const result = await runRes.json();

      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      router.push(`/reports/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep("questions");
    }
  }

  function renderQuestion(q: VdiRoleQuestion, idx: number) {
    const val = answers[q.id] || "";
    return (
      <div key={q.id} className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          <span className="inline-block w-6 h-6 mr-2 text-xs font-bold bg-blue-700 text-white rounded-full text-center leading-6">
            {idx + 1}
          </span>
          {q.label}
          {q.required && <span className="text-red-500 ml-0.5">*</span>}
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
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM10 9v6l5-3-5-3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                VDI 역할 재정의 진단
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                9개 질문 · 약 2분 · 4가지 전환 시나리오 중 추천
              </p>
            </div>
          </div>
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
              <h2 className="font-semibold text-lg text-slate-900">기본 정보</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    기관/회사명 <span className="text-red-500">*</span>
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

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-700 cursor-pointer"
                />
                <span className="text-sm text-slate-700">
                  개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span>
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

        {step === "questions" && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <p className="text-sm text-slate-500">
                현재 VDI 환경에 대한 9개 질문에 답해주세요. 답변에 따라 4가지 전환
                시나리오 중 가장 적합한 결과를 도출합니다.
              </p>
              {VDI_ROLE_QUESTIONS.map((q, i) => renderQuestion(q, i))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("lead")}
                className="flex-1 py-3 border border-slate-300 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
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
            <p className="text-lg font-semibold text-slate-800">
              VDI 역할 재정의 분석 중...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              4가지 전환 시나리오 중 최적 유형을 산출하고 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
