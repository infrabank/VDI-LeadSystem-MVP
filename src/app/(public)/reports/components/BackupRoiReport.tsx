import type { BackupRoiOutput } from "@/lib/scoring/backup-roi";
import PrintPdfButton from "./PrintPdfButton";

interface Props {
  output: BackupRoiOutput;
  lead?: { name: string | null; company: string | null; email: string | null };
  date?: string;
}

// 만원 단위 천 단위 콤마 표시
function fmt(kw: number): string {
  return Math.round(kw).toLocaleString("ko-KR");
}

// 차트 색상 — 현 환경 breakdown 4개
const CURRENT_COLORS = [
  "bg-slate-400",
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
];

// 차트 색상 — Acronis breakdown 6개
const ACRONIS_COLORS = [
  "bg-emerald-500",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-slate-300",
  "bg-slate-200",
];

export default function BackupRoiReport({ output, lead, date }: Props) {
  const { current_5yr, acronis_5yr, scenarios, summary, recommendations, inputs } = output;
  const exp = scenarios.expected;

  const orgDisplay = lead?.company || null;
  const dateDisplay = date
    ? new Date(date).toLocaleDateString("ko-KR")
    : new Date().toLocaleDateString("ko-KR");

  // 차트: 현 환경 breakdown
  const currentEntries = Object.entries(current_5yr.breakdown);
  const currentTotal = current_5yr.total || 1;

  // 차트: Acronis breakdown
  const acronisEntries = Object.entries(acronis_5yr.breakdown);
  const acronisTotal = acronis_5yr.total || 1;

  // 시나리오 카드 설정
  const scenarioCards = [
    { key: "best" as const, label: "Best", sub: "최적 시나리오", data: scenarios.best, highlight: false },
    { key: "expected" as const, label: "Expected", sub: "기대 시나리오", data: scenarios.expected, highlight: true },
    { key: "worst" as const, label: "Worst", sub: "보수적 시나리오", data: scenarios.worst, highlight: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── 헤더 ── */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 [word-break:keep-all]">
                백업 ROI 분석 리포트
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                생성일: {dateDisplay}
                {orgDisplay && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                    {orgDisplay}
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed [word-break:keep-all]">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ── 1. 핵심 수치 3-카드 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Expected ROI */}
          <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 md:p-6 text-center">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
              Expected ROI
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 leading-none">
              {exp.roi_pct >= 0 ? "+" : ""}
              {exp.roi_pct.toLocaleString("ko-KR")}%
            </p>
            <p className="text-xs text-slate-400 mt-2">5년 누적 기준</p>
          </div>

          {/* Payback */}
          <div className="bg-white rounded-xl border border-teal-200 shadow-sm p-4 md:p-6 text-center">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">
              투자 회수 기간
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-teal-700 leading-none">
              {exp.payback_months.toLocaleString("ko-KR")}
              <span className="text-base font-normal ml-1">개월</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">Expected 시나리오</p>
          </div>

          {/* 5년 누적 회피액 */}
          <div className="bg-white rounded-xl border border-cyan-200 shadow-sm p-4 md:p-6 text-center">
            <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-2 [word-break:keep-all]">
              5년 누적 회피액
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-700 leading-none">
              {fmt(exp.avoided_5yr)}
              <span className="text-base font-normal ml-1">만원</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">Expected 시나리오</p>
          </div>
        </div>

        {/* ── 2. 비용 비교 차트 ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">5년 누적 비용 비교</h2>

          <div className="space-y-6">
            {/* 현 환경 */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">현 환경 5년 누적</span>
                <span className="text-sm font-bold text-slate-900">
                  {fmt(current_5yr.total)} 만원
                </span>
              </div>
              <div className="w-full h-8 rounded-lg overflow-hidden flex">
                {currentEntries.map(([key, val], i) => {
                  const pct = (val / currentTotal) * 100;
                  if (pct < 0.5) return null;
                  return (
                    <div
                      key={key}
                      className={`${CURRENT_COLORS[i % CURRENT_COLORS.length]} h-full`}
                      style={{ width: `${pct}%` }}
                      title={`${key}: ${fmt(val)}만원`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {currentEntries.map(([key, val], i) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`inline-block w-2.5 h-2.5 rounded-sm ${CURRENT_COLORS[i % CURRENT_COLORS.length]}`} />
                    {key}: {fmt(val)}만
                  </div>
                ))}
              </div>
            </div>

            {/* Acronis */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700">Acronis 도입 5년 누적</span>
                <span className="text-sm font-bold text-emerald-800">
                  {fmt(acronis_5yr.total)} 만원
                </span>
              </div>
              <div className="w-full h-8 rounded-lg overflow-hidden flex">
                {acronisEntries.map(([key, val], i) => {
                  const pct = (Math.max(0, val) / (acronisTotal || 1)) * 100;
                  if (pct < 0.5) return null;
                  return (
                    <div
                      key={key}
                      className={`${ACRONIS_COLORS[i % ACRONIS_COLORS.length]} h-full`}
                      style={{ width: `${pct}%` }}
                      title={`${key}: ${fmt(val)}만원`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {acronisEntries.map(([key, val], i) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`inline-block w-2.5 h-2.5 rounded-sm ${ACRONIS_COLORS[i % ACRONIS_COLORS.length]}`} />
                    {key}: {fmt(val)}만
                  </div>
                ))}
              </div>
            </div>

            {/* 단위 안내 */}
            <p className="text-xs text-slate-400">단위: 만원 (KRW × 10,000). 사용자 {inputs.users.toLocaleString("ko-KR")}명, 데이터 {inputs.data_tb}TB 기준.</p>
          </div>
        </div>

        {/* ── 3. 시나리오 3종 카드 ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">시나리오별 분석</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scenarioCards.map(({ label, sub, data, highlight }) => (
              <div
                key={label}
                className={`rounded-xl border p-4 ${
                  highlight
                    ? "ring-2 ring-emerald-600 border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-emerald-700" : "text-slate-500"}`}>
                    {label}
                  </span>
                  {highlight && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-600 text-white rounded-full">
                      기준
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3 [word-break:keep-all]">{sub}</p>

                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">5년 회피액</p>
                    <p className={`text-xl font-bold leading-tight ${highlight ? "text-emerald-700" : "text-slate-700"} [word-break:keep-all]`}>
                      {fmt(data.avoided_5yr)}
                      <span className="text-sm font-normal ml-0.5">만원</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">ROI</p>
                    <p className={`text-lg font-bold leading-tight ${highlight ? "text-emerald-700" : "text-slate-700"}`}>
                      {data.roi_pct >= 0 ? "+" : ""}{data.roi_pct.toLocaleString("ko-KR")}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">회수 기간</p>
                    <p className={`text-lg font-bold leading-tight ${highlight ? "text-emerald-700" : "text-slate-700"}`}>
                      {data.payback_months.toLocaleString("ko-KR")}
                      <span className="text-sm font-normal ml-0.5">개월</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. 권고 ── */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">도입 권고사항</h2>
            <ol className="space-y-3">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3.5 border border-slate-200 border-l-4 border-l-emerald-400 rounded-lg"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-sm font-semibold border border-emerald-100">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed pt-0.5 [word-break:keep-all]">
                    {rec}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── PDF 저장 ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">결과를 PDF로 저장</p>
              <p className="text-sm text-slate-500 mt-0.5">
                분석 결과를 PDF 파일로 저장하여 내부 검토 자료로 활용하세요.
              </p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-xl p-4 md:p-6 text-center shadow-md print:hidden">
          <h3 className="text-lg font-bold text-white mb-2 [word-break:keep-all]">
            Myloket Acronis 도입 견적 상담
          </h3>
          <p className="text-emerald-100 text-sm mb-5 leading-relaxed [word-break:keep-all]">
            ROI 분석 결과를 바탕으로 귀사에 맞는 Acronis 도입 규모와 견적을 제안해드립니다.
          </p>
          <a
            href="/contact?source=report-backup-roi&interest=data-protection&subject=백업 도입 견적 상담"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-sm text-sm"
          >
            견적 상담 문의
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
