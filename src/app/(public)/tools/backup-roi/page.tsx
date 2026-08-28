"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "input" | "submitting";

const INTEREST_AREAS = [
  { value: "backup-roi", label: "백업 ROI 분석" },
  { value: "acronis-poc", label: "Acronis PoC" },
  { value: "dr-failover", label: "DR·페일오버" },
  { value: "managed-service", label: "MSP 운영" },
  { value: "consulting", label: "전반 컨설팅" },
] as const;

export default function BackupRoiPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input");

  // Lead info
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [interestAreas, setInterestAreas] = useState<string[]>(["backup-roi"]);
  const [consent, setConsent] = useState(false);

  // ROI inputs (with defaults)
  const [users, setUsers] = useState("100");
  const [hourlyLossKw, setHourlyLossKw] = useState("100");
  const [dataTb, setDataTb] = useState("10");
  const [annualBackupCostKw, setAnnualBackupCostKw] = useState("1500");
  const [annualDowntimeHours, setAnnualDowntimeHours] = useState("24");

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function toggleInterest(value: string) {
    setInterestAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!email.trim()) found["bri-email"] = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found["bri-email"] = "이메일 형식을 확인해주세요.";
    if (!company.trim()) found["bri-company"] = "기관·회사명을 입력해주세요.";
    if (!consent) found["bri-consent"] = "개인정보 처리 동의가 필요합니다.";
    setFieldErrors(found);
    const keys = Object.keys(found);
    if (keys.length > 0) {
      setError(keys.length === 1 ? found[keys[0]] : `입력을 확인해주세요. ${keys.length}개 항목이 남았습니다.`);
      const el = document.getElementById(keys[0]);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      (el as HTMLElement | null)?.focus({ preventScroll: true });
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
          company,
          source: "backup-roi",
          consent_marketing: consent,
          extension: {
            department: department || null,
            phone: phone || null,
            interest_area: interestAreas,
          },
        }),
      });
      if (!leadRes.ok) throw new Error("정보 저장에 실패했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.");
      const lead = await leadRes.json();

      // 2. Run backup ROI calculation
      const runRes = await fetch("/api/tools/backup-roi/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          input: {
            users: parseInt(users) || 100,
            hourly_loss_kw: parseFloat(hourlyLossKw) || 100,
            data_tb: parseFloat(dataTb) || 10,
            annual_backup_cost_kw: parseFloat(annualBackupCostKw) || 1500,
            annual_downtime_hours: parseFloat(annualDowntimeHours) || 24,
          },
        }),
      });
      if (!runRes.ok) {
        const err = await runRes.json();
        throw new Error(err.error || "계산에 실패했습니다. 입력값을 확인하고 다시 시도해 주세요.");
      }
      const result = await runRes.json();

      // 3. Generate report
      const reportRes = await fetch(
        `/api/reports/${result.tool_run_id}/generate`,
        { method: "POST" }
      );
      if (!reportRes.ok) throw new Error("리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const report = await reportRes.json();

      // 4. Redirect to report
      router.push(`/reports/${report.access_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
      setStep("input");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-emerald-50 to-white border-b border-emerald-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-700 rounded-2xl mb-4 shadow-md">
            <svg aria-hidden="true"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 kr-keep-all">
            백업 ROI 계산기
          </h1>
          <p className="text-sm font-medium text-emerald-700 mb-2">
            5년 누적 회피 비용·ROI%·Payback을 즉시 산출
          </p>
          <p className="text-sm sm:text-base text-gray-600 kr-keep-all max-w-xl mx-auto">
            임직원 수·다운타임·데이터 규모만 입력하면 Acronis 도입 ROI를
            시나리오별(Best/Expected/Worst)로 받아보실 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}

        {step === "input" && (
          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            {/* Lead Info */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-slate-900 kr-keep-all">
                기관 정보
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="bri-company" className="block text-sm font-medium text-gray-700 mb-1.5">
                    기관·회사명 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="bri-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["bri-company"]}
                    aria-describedby={fieldErrors["bri-company"] ? "bri-company-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${fieldErrors["bri-company"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="예: 한국OO공단"
                  />
                  {fieldErrors["bri-company"] && (
                    <p id="bri-company-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["bri-company"]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="홍길동"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="bri-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="bri-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!!fieldErrors["bri-email"]}
                    aria-describedby={fieldErrors["bri-email"] ? "bri-email-error" : undefined}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${fieldErrors["bri-email"] ? "border-red-400 bg-red-50/50" : ""}`}
                    placeholder="your@email.com"
                  />
                  {fieldErrors["bri-email"] && (
                    <p id="bri-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors["bri-email"]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    부서
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="정보화기획팀"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  연락처
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="02-0000-0000"
                />
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
                            ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROI Inputs */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-slate-900 kr-keep-all">
                비용 산정 정보
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    임직원 수 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={users}
                      onChange={(e) => setUsers(e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-10"
                      placeholder="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      명
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 kr-keep-all">
                    정직원·계약직 포함
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    시간당 업무 중단 비용 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={hourlyLossKw}
                      onChange={(e) => setHourlyLossKw(e.target.value)}
                      required
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-16"
                      placeholder="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      만원/h
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 kr-keep-all">
                    공공: 약 50~150만원, 금융: 200~500만원 추정
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    데이터 규모 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dataTb}
                      onChange={(e) => setDataTb(e.target.value)}
                      required
                      min="0.1"
                      step="0.1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-10"
                      placeholder="10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      TB
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 kr-keep-all">
                    백업 대상 운영 데이터(개발/테스트 제외)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    연간 백업 비용 <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={annualBackupCostKw}
                      onChange={(e) => setAnnualBackupCostKw(e.target.value)}
                      required
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-16"
                      placeholder="1500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      만원/년
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 kr-keep-all">
                    라이선스+스토리지+운영 인건비 합산
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  연간 다운타임 시간 <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualDowntimeHours}
                    onChange={(e) => setAnnualDowntimeHours(e.target.value)}
                    required
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-12"
                    placeholder="24"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    시간
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 kr-keep-all">
                  최근 3년 평균. 정기 PM 시간 제외
                </p>
              </div>
            </div>

            {/* Consent + Submit */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <input
                  id="bri-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!fieldErrors["bri-consent"]}
                  aria-describedby={fieldErrors["bri-consent"] ? "bri-consent-error" : undefined}
                  className="mt-0.5 w-6 h-6 flex-shrink-0 accent-emerald-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700 kr-keep-all">
                  ROI 분석 결과 제공 및 상담 안내를 위한 개인정보 수집·이용에
                  동의합니다.{" "}
                  <span className="text-red-600" aria-hidden="true">*</span>
                </span>
              </label>
              {fieldErrors["bri-consent"] && (
                <p id="bri-consent-error" className="text-xs text-red-700">{fieldErrors["bri-consent"]}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl hover:shadow-md hover:scale-[1.01] active:scale-[0.99] font-semibold text-base transition flex items-center justify-center gap-2"
              >
                계산 실행
                <svg aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </form>
        )}

        {step === "submitting" && (
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg aria-hidden="true"
                  className="w-7 h-7 text-emerald-700 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-800 kr-keep-all">
              백업 ROI를 분석 중입니다...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              시나리오별 5년 TCO 비교 + 리포트 생성 중
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
          <p className="font-medium text-gray-600 mb-1">산정 기준 안내</p>
          <p className="kr-keep-all">
            본 계산은 의사결정용 추정치이며, 실제 값은 환경·업무 특성에 따라
            달라질 수 있습니다. 단가 모델은 업계 평균 기준이며 도입 견적과
            상이할 수 있습니다.
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 sm:p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <h3 className="font-semibold text-emerald-800 mb-2">
            이 계산기는 무엇인가요?
          </h3>
          <p className="text-sm text-emerald-700 leading-relaxed kr-keep-all">
            현재 백업 환경의 5년 총소유비용(TCO)과 Acronis 도입 후 예상 비용을
            Best/Expected/Worst 3개 시나리오로 비교합니다. ROI%, 누적 회피
            비용, Payback 개월 수를 즉시 산출하여 경영진 보고용 PDF 리포트로
            제공합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
