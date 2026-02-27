"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "lead" | "assessment" | "submitting";

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("lead");

  // Lead form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);

  // Assessment form
  const [platform, setPlatform] = useState("vmware");
  const [vmCount, setVmCount] = useState("");
  const [networkSeparation, setNetworkSeparation] = useState(false);
  const [storageMigration, setStorageMigration] = useState(false);
  const [backupExists, setBackupExists] = useState(true);
  const [downtimeTolerance, setDowntimeTolerance] = useState("short");
  const [opsStaffLevel, setOpsStaffLevel] = useState("mid");

  const [error, setError] = useState("");

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("개인정보 처리 동의가 필요합니다.");
      return;
    }
    setError("");
    setStep("assessment");
  }

  async function handleAssessmentSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          company: company || null,
          source: "diagnostic",
          consent_marketing: consent,
        }),
      });

      if (!leadRes.ok) throw new Error("리드 생성 실패");
      const lead = await leadRes.json();

      // 2. Run assessment
      const assessRes = await fetch("/api/tools/risk-assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          input: {
            platform,
            vm_count: parseInt(vmCount) || 0,
            network_separation: networkSeparation,
            storage_migration: storageMigration,
            backup_exists: backupExists,
            downtime_tolerance: downtimeTolerance,
            ops_staff_level: opsStaffLevel,
          },
        }),
      });

      if (!assessRes.ok) throw new Error("진단 실행 실패");
      const result = await assessRes.json();

      // 3. Generate report
      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );

      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      // 4. Redirect to report
      router.push(`/thank-you?report=${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep("assessment");
    }
  }

  const currentStepNum = step === "lead" ? 1 : step === "assessment" ? 2 : 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 pt-12 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VDI 리스크 진단</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                VDI 마이그레이션/운영 환경의 리스크를 진단하고 맞춤 리포트를 받아보세요.
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          {step !== "submitting" && (
            <div className="flex items-center mt-6">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStepNum >= 1
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStepNum > 1 ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    "1"
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStepNum >= 1 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  기본 정보
                </span>
              </div>

              {/* Connector */}
              <div className="flex-1 mx-3 h-0.5 rounded-full bg-gray-200 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-500"
                  style={{ width: currentStepNum >= 2 ? "100%" : "0%" }}
                />
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStepNum >= 2
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStepNum >= 2 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  환경 정보
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Step 1: Lead Info */}
        {step === "lead" && (
          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-gray-900">기본 정보 입력</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">회사</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="(주)회사명"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  진단 결과 제공을 위한 개인정보 수집·이용에 동의합니다.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
            >
              다음: 환경 정보 입력
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        )}

        {/* Step 2: Assessment */}
        {step === "assessment" && (
          <form onSubmit={handleAssessmentSubmit} className="space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-gray-900">VDI 환경 정보</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  플랫폼
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="vmware">VMware</option>
                  <option value="citrix">Citrix</option>
                  <option value="xenserver">XenServer</option>
                  <option value="mixed">혼합 (Mixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  VM 수
                </label>
                <input
                  type="number"
                  value={vmCount}
                  onChange={(e) => setVmCount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="예: 200"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  다운타임 허용
                </label>
                <select
                  value={downtimeTolerance}
                  onChange={(e) => setDowntimeTolerance(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="none">허용 불가 (무중단)</option>
                  <option value="short">짧은 시간 (수 시간)</option>
                  <option value="night">야간 작업 가능</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  운영 인력 수준
                </label>
                <select
                  value={opsStaffLevel}
                  onChange={(e) => setOpsStaffLevel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="low">낮음</option>
                  <option value="mid">보통</option>
                  <option value="high">높음</option>
                </select>
              </div>

              <div className="pt-1 space-y-1 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2.5">환경 특성</p>
                {[
                  { checked: storageMigration, onChange: setStorageMigration, label: "스토리지 이관 포함" },
                  { checked: networkSeparation, onChange: setNetworkSeparation, label: "네트워크 분리 환경" },
                  { checked: backupExists, onChange: setBackupExists, label: "백업 체계 있음" },
                ].map(({ checked, onChange, label }) => (
                  <label
                    key={label}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onChange(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("lead")}
                className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
              >
                진단 실행
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </form>
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
            <p className="text-lg font-semibold text-gray-800 animate-pulse">진단 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2">환경 정보를 분석하고 리스크 리포트를 생성하고 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
