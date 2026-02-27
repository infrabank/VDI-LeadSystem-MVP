"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "input" | "submitting";

export default function ROICalculatorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input");

  // Lead info
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);

  // ROI inputs
  const [totalUsers, setTotalUsers] = useState("");
  const [avgHourlyCost, setAvgHourlyCost] = useState("");
  const [avgDowntimeHours, setAvgDowntimeHours] = useState("");
  const [incidentsPerYear, setIncidentsPerYear] = useState("");
  const [currentBackup, setCurrentBackup] = useState(true);
  const [recoveryImprovement, setRecoveryImprovement] = useState("30");

  // ROI v2 inputs
  const [impactRatePercent, setImpactRatePercent] = useState("70");
  const [majorIncidentHours, setMajorIncidentHours] = useState("8");

  const [error, setError] = useState("");

  function handleBackupChange(checked: boolean) {
    setCurrentBackup(checked);
    setRecoveryImprovement(checked ? "30" : "60");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("개인정보 처리 동의가 필요합니다.");
      return;
    }
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

      // 2. Run ROI calculation
      const roiRes = await fetch("/api/tools/roi/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          input: {
            total_users: parseInt(totalUsers) || 0,
            avg_hourly_cost: parseInt(avgHourlyCost) || 0,
            avg_downtime_hours: parseFloat(avgDowntimeHours) || 0,
            incidents_per_year: parseInt(incidentsPerYear) || 0,
            current_backup: currentBackup,
            recovery_time_improvement_percent:
              parseInt(recoveryImprovement) || 50,
            impact_rate_percent: parseInt(impactRatePercent) || 70,
            major_incident_hours: parseFloat(majorIncidentHours) || 8,
          },
        }),
      });
      if (!roiRes.ok) {
        const err = await roiRes.json();
        throw new Error(err.error || "계산 실행 실패");
      }
      const result = await roiRes.json();

      // 3. Generate report
      const reportRes = await fetch(
        `/api/reports/roi/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성 실패");
      const report = await reportRes.json();

      // 4. Redirect to report
      router.push(`/reports/roi/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep("input");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-50 to-white border-b border-green-100">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            VDI 다운타임 비용/ROI 계산기
          </h1>
          <p className="text-gray-600">
            VDI 장애로 인한 연간 손실액과 투자 ROI를 산정하여 경영진 보고용 PDF를 제공합니다.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lead Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">기본 정보</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ROI Inputs */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">비용 산정 정보</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VDI 사용자 수 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={totalUsers}
                    onChange={(e) => setTotalUsers(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="예: 200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1인 시간당 인건비 (원) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={avgHourlyCost}
                    onChange={(e) => setAvgHourlyCost(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="예: 50000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1회 평균 중단시간 (시간) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={avgDowntimeHours}
                    onChange={(e) => setAvgDowntimeHours(e.target.value)}
                    required
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="예: 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연간 장애 횟수 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={incidentsPerYear}
                    onChange={(e) => setIncidentsPerYear(e.target.value)}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="예: 6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  복구시간 단축 예상률 (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    value={recoveryImprovement}
                    onChange={(e) => setRecoveryImprovement(e.target.value)}
                    min="10"
                    max="90"
                    step="5"
                    className="flex-1 accent-green-600"
                  />
                  <span className="text-sm font-semibold text-green-700 w-12 text-right">
                    {recoveryImprovement}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">백업 보유 시 권장 30%, 미보유 시 권장 60%</p>
              </div>

              <div className="p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentBackup}
                    onChange={(e) => handleBackupChange(e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">백업/DR 체계 보유</span>
                    <p className="text-xs text-gray-400">현재 백업 및 재해복구 시스템이 있는지 여부</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Analysis Assumptions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">분석 가정값</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생산성 영향률 (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    value={impactRatePercent}
                    onChange={(e) => setImpactRatePercent(e.target.value)}
                    min="10"
                    max="100"
                    step="5"
                    className="flex-1 accent-green-600"
                  />
                  <span className="text-sm font-semibold text-green-700 w-12 text-right">
                    {impactRatePercent}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">장애 시 업무에 미치는 실질적 영향 비율. 보수적 기본값 70%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대형 장애 가정시간
                </label>
                <input
                  type="number"
                  value={majorIncidentHours}
                  onChange={(e) => setMajorIncidentHours(e.target.value)}
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="예: 8"
                />
                <p className="text-xs text-gray-400 mt-1">대형 장애 발생 시 예상 중단 시간</p>
              </div>
            </div>

            {/* Consent + Submit */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-green-600"
                />
                <span className="text-sm text-gray-600">
                  분석 결과 제공을 위한 개인정보 수집·이용에 동의합니다.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md hover:scale-[1.01] active:scale-[0.99] font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                ROI 분석 실행
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 font-medium">ROI를 분석하고 있습니다...</p>
            <p className="text-gray-400 text-sm mt-1">리포트와 PDF를 생성 중입니다</p>
          </div>
        )}

        {/* Disclaimer Box */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
          <p className="font-medium text-gray-600 mb-1">산정 기준 안내</p>
          <p>본 계산은 의사결정용 추정치이며, 실제 값은 환경/업무 특성에 따라 달라질 수 있습니다. 투자비는 백업/DR 보유 여부에 따른 내부 참고 모델 기준입니다.</p>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-5 bg-green-50 rounded-xl border border-green-100">
          <h3 className="font-semibold text-green-800 mb-2">이 계산기는 무엇인가요?</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            VDI 환경의 장애로 인한 생산성 손실 비용을 산정하고,
            인프라 개선 투자 시 예상되는 절감액과 투자 회수기간(Payback Period)을 계산합니다.
            경영진 보고용 1페이지 PDF 리포트도 함께 제공됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
