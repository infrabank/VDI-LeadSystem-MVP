import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PdfRetryButton from "../../components/PdfRetryButton";

interface Props {
  params: Promise<{ token: string }>;
}

interface ROIV2Output {
  version: "v2";
  annual_downtime: number;
  annual_loss: number;
  improved_downtime: number;
  improved_annual_loss: number;
  annual_saving: number;
  loss_3y: number;
  saving_3y: number;
  major_incident_loss: number;
  investment_low: number;
  investment_high: number;
  payback_low_years: number | null;
  payback_high_years: number | null;
  grade: "critical" | "high" | "medium" | "low";
  benchmark_text: string;
  benchmark_comparison: string;
  warnings: string[];
  next_steps: string[];
  risk_summary: string[];
  improvement_effects: string[];
  assumptions: {
    impact_rate_percent: number;
    recovery_time_improvement_percent: number;
    major_incident_hours: number;
    investment_model: string;
    base_cost_low: number;
    base_cost_high: number;
    per_user_low: number;
    per_user_high: number;
  };
  formatted: {
    annual_loss: string;
    annual_saving: string;
    improved_annual_loss: string;
    loss_3y: string;
    saving_3y: string;
    major_incident_loss: string;
    investment_low: string;
    investment_high: string;
    investment_range: string;
    payback_range: string;
  };
}

export default async function ROIReportPage({ params }: Props) {
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
  const output = toolRun?.output_json as ROIV2Output | null;

  if (!output) notFound();

  const gradeLabel: Record<string, string> = {
    critical: "매우 높음",
    high: "높음",
    medium: "보통",
    low: "낮음",
  };
  const gradeColor: Record<string, string> = {
    critical: "text-red-700 bg-red-50 border-red-200",
    high: "text-orange-600 bg-orange-50 border-orange-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    low: "text-green-600 bg-green-50 border-green-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              분석 완료
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                gradeColor[output.grade] ?? ""
              }`}
            >
              손실 위험도: {gradeLabel[output.grade] ?? output.grade}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            VDI 다운타임 비용/ROI 분석 리포트
          </h1>
          <p className="text-sm text-gray-500">
            생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
            {lead?.company && ` | ${lead.company}`}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">연간 추정 손실액</p>
            <p className="text-2xl font-bold text-red-600">
              {output.formatted.annual_loss}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">연간 절감 가능액</p>
            <p className="text-2xl font-bold text-green-600">
              {output.formatted.annual_saving}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">투자 회수기간</p>
            <p className="text-2xl font-bold text-blue-600">
              {output.formatted.payback_range}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              투자비 {output.formatted.investment_range}
            </p>
          </div>
        </div>

        {/* Sub KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">3년 누적 손실</p>
            <p className="text-lg font-bold text-red-500">
              {output.formatted.loss_3y}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">3년 누적 절감</p>
            <p className="text-lg font-bold text-green-500">
              {output.formatted.saving_3y}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">대형 장애 1회 손실</p>
            <p className="text-lg font-bold text-orange-500">
              {output.formatted.major_incident_loss}
            </p>
          </div>
        </div>

        {/* Benchmark Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
            {output.benchmark_text}
          </p>
          <p className="text-sm text-green-800 leading-relaxed">
            {output.benchmark_comparison}
          </p>
        </div>

        {/* Warning Box */}
        {output.warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <h2 className="text-base font-bold text-amber-800 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              미조치 시 리스크
            </h2>
            <ul className="space-y-2">
              {output.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                  <svg
                    className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">현재 구조 위험 요약</h2>
          <div className="space-y-3">
            {output.risk_summary.map((line, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 border-l-4 border-l-red-400 border border-gray-200 rounded-lg shadow-sm"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Effects */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">개선 시 기대 효과</h2>
          <div className="space-y-3">
            {output.improvement_effects.map((line, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 border-l-4 border-l-green-400 border border-gray-200 rounded-lg shadow-sm"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-green-50 text-green-600 border border-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">다음 단계 제안</h2>
          <div className="space-y-3">
            {output.next_steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 border-l-4 border-l-blue-400 border border-gray-200 rounded-lg shadow-sm"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Download / Retry */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">경영진 보고용 PDF</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {report.pdf_url
                ? "1페이지 Executive Summary + 부록"
                : "PDF 생성에 실패했습니다. 재시도 버튼을 눌러 다시 생성하세요."}
            </p>
          </div>
          {report.pdf_url ? (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md font-medium transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF 다운로드
            </a>
          ) : (
            <PdfRetryButton reportId={report.id} />
          )}
        </div>

        {/* CTA */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #059669, #2563eb)" }}>
          <div className="px-8 py-10 text-center text-white">
            <h3 className="text-xl font-bold mb-2">
              전문가의 상세 분석이 필요하신가요?
            </h3>
            <p className="text-green-100 mb-6 max-w-md mx-auto">
              VDI 전문 컨설턴트가 실제 환경 분석과 맞춤 개선 전략을 제안해드립니다.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/tools/risk-assessment"
                className="px-6 py-2.5 bg-white text-green-700 rounded-lg hover:bg-green-50 font-medium transition-colors"
              >
                리스크 진단도 해보기
              </Link>
              <Link
                href="/content"
                className="px-6 py-2.5 border border-white/30 text-white rounded-lg hover:bg-white/10 font-medium transition-colors"
              >
                관련 콘텐츠 보기
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          본 계산은 의사결정용 추정치이며, 실제 값은 환경/업무 특성에 따라 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
}
