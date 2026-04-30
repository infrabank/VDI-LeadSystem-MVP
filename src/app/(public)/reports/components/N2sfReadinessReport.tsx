import Link from "next/link";
import type { N2sfReadinessOutput } from "@/lib/scoring/n2sf-readiness";
import PrintPdfButton from "./PrintPdfButton";

const SECTION_LABELS: Record<keyof N2sfReadinessOutput["section_scores"], string> = {
  network_separation: "망분리·VDI 현황",
  data_classification: "데이터·업무 분류",
  authentication: "인증·접근 통제",
  cloud_saas: "클라우드·SaaS 활용",
  operations: "운영·예산 준비도",
};

const LEVEL_BADGE_COLORS: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-amber-100 text-amber-700 border-amber-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

interface Props {
  report: { created_at: string; id: string };
  lead: {
    company?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  output: N2sfReadinessOutput;
  organizationName?: string | null;
}

export default function N2sfReadinessReport({ report, lead, output, organizationName }: Props) {
  const score = output.score;
  const scoreColor =
    score >= 80 ? "#10b981" : score >= 65 ? "#3b82f6" : score >= 50 ? "#f59e0b" : score >= 30 ? "#f97316" : "#ef4444";

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const orgDisplay = organizationName || lead?.company || "-";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">N²SF 전환 준비도 진단 리포트</h1>
              <p className="text-sm text-slate-500 mt-1">
                생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
                {orgDisplay !== "-" && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
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
        {/* 1. Summary + Score Gauge */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            종합 진단 요약
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{output.summary}</p>

          <div className="mt-5 flex items-center gap-6 flex-wrap">
            <div className="relative flex-shrink-0 w-28 h-28">
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

            <div className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-500 font-medium">현재 단계 해설</p>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                {output.level_description}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Section Scores */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">영역별 점수</h2>
          <div className="space-y-3">
            {(Object.keys(output.section_scores) as Array<keyof typeof output.section_scores>).map(
              (key) => {
                const v = output.section_scores[key];
                const barColor = v >= 65 ? "bg-blue-500" : v >= 50 ? "bg-amber-500" : "bg-red-500";
                return (
                  <div key={key}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {SECTION_LABELS[key]}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{v}점</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all`}
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* 3. Top Risks */}
        {output.top_risks.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">핵심 리스크</h2>
            <div className="space-y-3">
              {output.top_risks.map((risk, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 border border-slate-200 border-l-4 border-l-red-400 rounded-lg"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold border border-red-100">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Priority Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">우선 개선 과제 (Top 5)</h2>
          <div className="space-y-3">
            {output.priority_actions.map((action, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 border border-slate-200 border-l-4 border-l-blue-400 rounded-lg"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold border border-blue-100">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. VDI Strategy */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">VDI 전략 방향</h2>
          <p className="text-sm text-blue-900 leading-relaxed">{output.vdi_strategy_hint}</p>
          <Link
            href="/diagnosis/vdi-transition"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            VDI 역할 재정의 진단 받기 →
          </Link>
        </div>

        {/* 6. Roadmap */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">3단계 실행 로드맵</h2>
          <div className="space-y-4">
            {output.roadmap.map((p, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 ${idx === 0 ? "bg-red-500" : idx === 1 ? "bg-amber-500" : "bg-blue-500"} text-white rounded-full flex items-center justify-center text-sm font-bold`}
                  >
                    {idx + 1}
                  </div>
                  {idx < output.roadmap.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{p.phase}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                      {p.duration}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {p.goals.map((goal, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Next Steps */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">다음 단계</h2>
          <ul className="space-y-2">
            {output.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-blue-600 font-bold mt-0.5">→</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* PDF */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">결과를 PDF로 저장</p>
              <p className="text-sm text-slate-500 mt-0.5">
                진단 결과를 PDF 파일로 저장하여 내부 회의 자료로 활용하세요.
              </p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-center shadow-md print:hidden">
          <h3 className="text-lg font-bold text-white mb-2">
            상세 컨설팅이 필요하신가요?
          </h3>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            기존 망분리 환경을 안정적으로 유지하면서 N²SF 전환을 단계적으로 설계해드립니다.
          </p>
          <Link
            href="/n2sf"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
          >
            상담 문의
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
