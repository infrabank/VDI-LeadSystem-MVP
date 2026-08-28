import type { BackupReadinessOutput } from "@/lib/scoring/backup-readiness";
import PrintPdfButton from "./PrintPdfButton";

const LEVEL_BADGE_COLORS: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-amber-100 text-amber-700 border-amber-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

interface Props {
  output: BackupReadinessOutput;
  lead?: { name: string | null; company: string | null; email: string | null } | null;
  date?: string;
}

export default function BackupReadinessReport({ output, lead, date }: Props) {
  const score = output.score;
  const scoreColor =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#3b82f6"
        : score >= 40
          ? "#f59e0b"
          : score >= 20
            ? "#f97316"
            : "#ef4444";

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const orgDisplay = lead?.company || "-";
  const displayDate = date
    ? new Date(date).toLocaleDateString("ko-KR")
    : new Date().toLocaleDateString("ko-KR");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── 헤더 ── */}
      <div className="bg-gradient-to-b from-emerald-50 to-white border-b border-emerald-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 break-keep">
                백업·사이버복원력 진단 리포트
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                생성일: {displayDate}
                {orgDisplay !== "-" && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {orgDisplay}
                  </span>
                )}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${LEVEL_BADGE_COLORS[output.level]}`}
            >
              Level {output.level} — {output.level_name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ── 1. Executive Summary ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            종합 진단 요약
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed break-keep">
            {output.summary}
          </p>

          <div className="mt-5 flex items-center gap-6 flex-wrap">
            {/* 점수 게이지 */}
            <div className="relative flex-shrink-0 w-24 sm:w-28 h-24 sm:h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Level 설명 */}
            <div className="flex-1 min-w-[200px] bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs text-emerald-700 font-medium">현재 단계 해설</p>
              <p className="text-sm text-gray-800 mt-1 leading-relaxed break-keep">
                {output.level_description}
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. 영역별 점수 (7개 섹션, 가로 막대) ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">영역별 점수</h2>
          <div className="space-y-3">
            {output.sections.map((sec) => {
              const barColor =
                sec.score >= 80
                  ? "bg-emerald-500"
                  : sec.score >= 60
                    ? "bg-teal-500"
                    : sec.score >= 40
                      ? "bg-amber-500"
                      : "bg-red-500";
              return (
                <div key={sec.id}>
                  <div className="flex justify-between items-baseline mb-1 gap-2">
                    <span className="text-sm font-medium text-gray-700 break-keep">
                      {sec.title}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">
                        가중치 {Math.round(sec.weight * 100)}%
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{sec.score}점</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all`}
                      style={{ width: `${sec.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. 최우선 개선 영역 (top_recommendations 최대 3개) ── */}
        {output.top_recommendations.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">최우선 개선 영역</h2>
            <div className="space-y-3">
              {output.top_recommendations.slice(0, 3).map((rec, i) => (
                <div
                  key={rec.area}
                  className="border border-gray-200 border-l-4 border-l-emerald-400 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-200">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {rec.areaTitle}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 break-keep mb-1.5">
                    {rec.headline}
                  </p>
                  <div className="flex items-start gap-1.5 bg-teal-50 border border-teal-200 rounded-md p-2.5">
                    <span className="text-xs font-bold text-teal-700 flex-shrink-0 mt-0.5">
                      Acronis
                    </span>
                    <p className="text-xs text-teal-800 leading-relaxed break-keep">
                      {rec.acronisMatch}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. 다음 단계 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">다음 단계</h2>
          <ol className="space-y-2">
            {output.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-200 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed break-keep pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── PDF 저장 ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">결과를 PDF로 저장</p>
              <p className="text-sm text-gray-500 mt-0.5">
                진단 결과를 PDF 파일로 저장하여 내부 회의 자료로 활용하세요.
              </p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 md:p-6 text-center shadow-md print:hidden">
          <h3 className="text-lg font-bold text-white mb-2 break-keep">
            Myloket Acronis 도입 무료 상담
          </h3>
          <p className="text-emerald-100 text-sm mb-5 leading-relaxed break-keep">
            백업·사이버복원력 전문가가 귀 기관의 환경을 분석하고 Acronis 기반 최적 도입 방안을 제안해드립니다.
          </p>
          <a
            href="/contact?source=report-backup-readiness&interest=data-protection&subject=백업·사이버복원력 진단 결과 후속 상담"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-sm text-sm"
          >
            무료 상담 신청
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
