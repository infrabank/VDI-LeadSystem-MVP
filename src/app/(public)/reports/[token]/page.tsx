import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PrintPdfButton from "../components/PrintPdfButton";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .select("*, tool_runs(*), leads(email, name, company)")
    .eq("access_token", token)
    .single();

  if (!report) notFound();

  const toolRun = report.tool_runs;
  const lead = report.leads;
  const output = toolRun?.output_json as {
    risks: string[];
    next_steps: string[];
    risk_level: string;
  } | null;
  const score = toolRun?.score ?? 0;

  const riskLevelLabel: Record<string, string> = {
    low: "낮음",
    medium: "보통",
    high: "높음",
    critical: "매우 높음",
  };

  const riskLevelColor: Record<string, string> = {
    low: "text-green-700 bg-green-100 border-green-200",
    medium: "text-yellow-700 bg-yellow-100 border-yellow-200",
    high: "text-orange-700 bg-orange-100 border-orange-200",
    critical: "text-red-700 bg-red-100 border-red-200",
  };

  const scoreColor =
    score >= 70
      ? "#ef4444"
      : score >= 50
        ? "#f97316"
        : score >= 30
          ? "#eab308"
          : "#22c55e";

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VDI 리스크 진단 리포트</h1>
              <p className="text-sm text-gray-500 mt-1">
                생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
                {lead?.company && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {lead.company}
                  </span>
                )}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                진단 완료
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Score Overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-5">종합 리스크 점수</p>
            <div className="flex items-center gap-8">
              {/* Circular Gauge */}
              <div className="relative flex-shrink-0 w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="10"
                  />
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
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900 leading-none">{score}</span>
                  <span className="text-xs text-gray-400 mt-1">/ 100</span>
                </div>
              </div>

              {/* Risk Level + Bar */}
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border mb-4 ${
                    riskLevelColor[output?.risk_level || "low"] || ""
                  }`}
                >
                  리스크 수준: {riskLevelLabel[output?.risk_level || "low"] || output?.risk_level}
                </span>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${score}%`,
                        backgroundColor: scoreColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>낮음</span>
                    <span>보통</span>
                    <span>높음</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risks */}
        {output?.risks && output.risks.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-red-100 rounded-md flex items-center justify-center">
                <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
              주요 리스크
            </h2>
            <div className="space-y-3">
              {output.risks.map((risk, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 bg-white border-t border-r border-b border-gray-200 border-l-4 border-l-red-400 rounded-lg shadow-sm"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold border border-red-100">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {output?.next_steps && output.next_steps.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              권장 조치사항
            </h2>
            <div className="space-y-3">
              {output.next_steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 bg-white border-t border-r border-b border-gray-200 border-l-4 border-l-blue-400 rounded-lg shadow-sm"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold border border-blue-100">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Save */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">PDF 리포트 저장</p>
              <p className="text-sm text-gray-500 mt-0.5">
                진단 결과를 PDF 파일로 저장하여 팀과 공유하세요.
              </p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center shadow-md">
          <h3 className="text-lg font-bold text-white mb-2">
            전문가의 상세 분석이 필요하신가요?
          </h3>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            VDI 전문 컨설턴트가 맞춤 분석과 마이그레이션 전략을 제안해드립니다.
          </p>
          <Link
            href="/content"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
          >
            관련 콘텐츠 보기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
