import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PrintPdfButton from "../components/PrintPdfButton";
import N2sfReadinessReport from "../components/N2sfReadinessReport";
import VdiRoleReport from "../components/VdiRoleReport";
import type { N2sfReadinessOutput } from "@/lib/scoring/n2sf-readiness";
import type { VdiRoleOutput } from "@/lib/scoring/vdi-role";

interface Props {
  params: Promise<{ token: string }>;
}

interface MaturityItem {
  score: number;
  level: number;
}

interface RiskDetail {
  title: string;
  impact_scope: string;
  potential_impact: string;
  trigger_condition: string;
  likelihood: "low" | "medium" | "high";
  category?: "migration" | "dr" | "operations" | "automation" | "security";
}

interface RoadmapPhase {
  title: string;
  duration: string;
  actions: string[];
}

interface V2Output {
  version: "v2" | "v3";
  score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  maturity_model: {
    migration: MaturityItem;
    dr: MaturityItem;
    operations: MaturityItem;
    automation: MaturityItem;
  };
  benchmark_text: string;
  benchmark_comparison: string;
  risks: RiskDetail[];
  current_state_projection: {
    short_term_risk: string;
    mid_term_risk: string;
    large_scale_event_risk: string;
  };
  roadmap: {
    phase_1: RoadmapPhase;
    phase_2: RoadmapPhase;
    phase_3: RoadmapPhase;
  };
  executive_summary: string;
  risk_messages: string[];
  next_steps: string[];
}

// Legacy v1
interface V1Output {
  risks: string[];
  next_steps: string[];
  risk_level: string;
}

function isV2OrV3(output: unknown): output is V2Output {
  const v = (output as V2Output)?.version;
  return v === "v2" || v === "v3";
}

// ── SVG Radar Chart (4 axes) ──
function RadarChart({ maturity }: { maturity: V2Output["maturity_model"] }) {
  const cx = 100, cy = 100, maxR = 70;
  const axes = [
    { key: "Migration", level: maturity.migration.level },
    { key: "DR/Backup", level: maturity.dr.level },
    { key: "Operations", level: maturity.operations.level },
    { key: "Automation", level: maturity.automation.level },
  ];

  // 4 axes: top, right, bottom, left
  const angles = [
    -Math.PI / 2,
    0,
    Math.PI / 2,
    Math.PI,
  ];

  const gridLevels = [1, 2, 3, 4, 5];
  const point = (angle: number, level: number) => ({
    x: cx + (maxR * level / 5) * Math.cos(angle),
    y: cy + (maxR * level / 5) * Math.sin(angle),
  });

  const dataPoints = axes.map((a, i) => point(angles[i], a.level));
  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[240px] mx-auto">
      {/* Grid */}
      {gridLevels.map((lvl) => (
        <polygon
          key={lvl}
          points={angles.map(a => {
            const p = point(a, lvl);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={lvl === 5 ? 1.5 : 0.5}
        />
      ))}
      {/* Axes */}
      {angles.map((a, i) => {
        const end = point(a, 5);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth={2} />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#2563eb" />
      ))}
      {/* Labels */}
      {axes.map((a, i) => {
        const labelPoint = point(angles[i], 6.2);
        const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
        return (
          <text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y + (i === 0 ? -2 : i === 2 ? 8 : 3)}
            textAnchor={anchor}
            fontSize={9}
            fill="#6b7280"
            fontWeight={500}
          >
            {a.key} ({a.level}/5)
          </text>
        );
      })}
    </svg>
  );
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .select("*, tool_runs(*), leads(id, email, name, company)")
    .eq("access_token", token)
    .single();

  if (!report) notFound();

  const toolRun = report.tool_runs;
  const lead = report.leads;
  const output = toolRun?.output_json;
  const toolType = (toolRun?.tool_type as string) || "risk_assessment";

  // Fetch lead_extensions for org name (used by new diagnostics)
  let organizationName: string | null = null;
  if (lead?.id && (toolType === "n2sf_readiness" || toolType === "vdi_role")) {
    const { data: ext } = await supabase
      .from("lead_extensions")
      .select("organization_name")
      .eq("lead_id", lead.id)
      .maybeSingle();
    organizationName = ext?.organization_name ?? null;
  }

  if (toolType === "n2sf_readiness") {
    return (
      <N2sfReadinessReport
        report={report}
        lead={lead}
        output={output as N2sfReadinessOutput}
        organizationName={organizationName}
      />
    );
  }

  if (toolType === "vdi_role") {
    return (
      <VdiRoleReport
        report={report}
        lead={lead}
        output={output as VdiRoleOutput}
        organizationName={organizationName}
      />
    );
  }

  if (isV2OrV3(output)) {
    return <V2Report report={report} lead={lead} output={output} />;
  }

  // Legacy v1 fallback
  const v1 = output as V1Output | null;
  const score = toolRun?.score ?? 0;
  return <V1Report report={report} lead={lead} output={v1} score={score} />;
}

// ══════════════════════════════════
// V2 Report
// ══════════════════════════════════

function V2Report({
  report,
  lead,
  output,
}: {
  report: { created_at: string; id: string };
  lead: { company?: string | null } | null;
  output: V2Output;
}) {
  const riskLevelLabel: Record<string, string> = {
    low: "낮음", medium: "보통", high: "높음", critical: "매우 높음",
  };
  const riskLevelColor: Record<string, string> = {
    low: "text-green-700 bg-green-100 border-green-200",
    medium: "text-yellow-700 bg-yellow-100 border-yellow-200",
    high: "text-orange-700 bg-orange-100 border-orange-200",
    critical: "text-red-700 bg-red-100 border-red-200",
  };
  const likelihoodColor: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  const likelihoodLabel: Record<string, string> = {
    low: "낮음", medium: "보통", high: "높음",
  };

  const scoreColor =
    output.score >= 70 ? "#ef4444"
    : output.score >= 50 ? "#f97316"
    : output.score >= 30 ? "#eab308"
    : "#22c55e";

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (output.score / 100) * circumference;

  const phases = [
    { data: output.roadmap.phase_1, color: "border-red-500", bg: "bg-red-500", num: "1" },
    { data: output.roadmap.phase_2, color: "border-orange-500", bg: "bg-orange-500", num: "2" },
    { data: output.roadmap.phase_3, color: "border-blue-500", bg: "bg-blue-500", num: "3" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${riskLevelColor[output.risk_level]}`}>
              리스크: {riskLevelLabel[output.risk_level]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 1. Executive Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Executive Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{output.executive_summary}</p>

          <div className="mt-5 flex items-center gap-6">
            {/* Score Gauge */}
            <div className="relative flex-shrink-0 w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 leading-none">{output.score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Benchmark */}
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 font-medium">{output.benchmark_text}</p>
              <p className="text-sm text-green-800 font-semibold mt-1">{output.benchmark_comparison}</p>
            </div>
          </div>
        </div>

        {/* 2. Maturity Radar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">운영 성숙도 모델</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <RadarChart maturity={output.maturity_model} />
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {([
                { label: "Migration Readiness", m: output.maturity_model.migration, color: "bg-red-50 border-red-200" },
                { label: "DR/Backup", m: output.maturity_model.dr, color: "bg-orange-50 border-orange-200" },
                { label: "Operations", m: output.maturity_model.operations, color: "bg-yellow-50 border-yellow-200" },
                { label: "Automation & Scale", m: output.maturity_model.automation, color: "bg-green-50 border-green-200" },
              ] as const).map(({ label, m, color }) => (
                <div key={label} className={`p-3 rounded-lg border ${color}`}>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-bold text-gray-900">{m.level}<span className="text-sm font-normal text-gray-400">/5</span></p>
                  <p className="text-xs text-gray-400">{m.score}/25점</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Risk Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
            주요 리스크 상세
          </h2>
          <div className="space-y-3">
            {output.risks.map((risk, i) => (
              <div key={i} className="border border-gray-200 border-l-4 border-l-red-400 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                  <h3 className="text-sm font-bold text-gray-900">{risk.title}</h3>
                  <div className="flex gap-1.5">
                    {risk.category && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {({ migration: "이관", dr: "DR", operations: "운영", automation: "자동화", security: "보안" } as Record<string, string>)[risk.category]}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${likelihoodColor[risk.likelihood]}`}>
                      발생 가능성: {likelihoodLabel[risk.likelihood]}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><span className="font-medium text-gray-500">영향 범위:</span> {risk.impact_scope}</div>
                  <div><span className="font-medium text-gray-500">유발 조건:</span> {risk.trigger_condition}</div>
                </div>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{risk.potential_impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Current State Projection */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            현 상태 유지 시 시나리오
          </h2>
          <div className="space-y-3">
            {([
              { label: "단기 (3개월)", text: output.current_state_projection.short_term_risk },
              { label: "중기 (6~12개월)", text: output.current_state_projection.mid_term_risk },
              { label: "대형 장애 발생 시", text: output.current_state_projection.large_scale_event_risk },
            ]).map(({ label, text }) => (
              <div key={label} className="bg-white/60 rounded-lg p-3 border border-amber-200">
                <p className="text-xs font-semibold text-amber-800 mb-1">{label}</p>
                <p className="text-sm text-amber-900 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Improvement Roadmap */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">단계별 개선 로드맵</h2>
          <div className="space-y-4">
            {phases.map(({ data, bg, num }) => (
              <div key={num} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 ${bg} text-white rounded-full flex items-center justify-center text-sm font-bold`}>{num}</div>
                  {num !== "3" && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gray-900">{data.title}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{data.duration}</span>
                  </div>
                  <div className="space-y-1.5">
                    {data.actions.map((action, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Save */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">PDF 리포트 저장</p>
              <p className="text-sm text-gray-500 mt-0.5">진단 결과를 PDF 파일로 저장하여 팀과 공유하세요.</p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center shadow-md print:hidden">
          <h3 className="text-lg font-bold text-white mb-2">전문가의 상세 분석이 필요하신가요?</h3>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">VDI 전문 컨설턴트가 맞춤 분석과 마이그레이션 전략을 제안해드립니다.</p>
          <Link href="/content" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm">
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

// ══════════════════════════════════
// V1 Report (legacy fallback)
// ══════════════════════════════════

function V1Report({
  report,
  lead,
  output,
  score,
}: {
  report: { created_at: string; id: string };
  lead: { company?: string | null } | null;
  output: V1Output | null;
  score: number;
}) {
  const riskLevelLabel: Record<string, string> = {
    low: "낮음", medium: "보통", high: "높음", critical: "매우 높음",
  };
  const riskLevelColor: Record<string, string> = {
    low: "text-green-700 bg-green-100 border-green-200",
    medium: "text-yellow-700 bg-yellow-100 border-yellow-200",
    high: "text-orange-700 bg-orange-100 border-orange-200",
    critical: "text-red-700 bg-red-100 border-red-200",
  };

  const scoreColor = score >= 70 ? "#ef4444" : score >= 50 ? "#f97316" : score >= 30 ? "#eab308" : "#22c55e";
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <h1 className="text-2xl font-bold text-gray-900">VDI 리스크 진단 리포트</h1>
          <p className="text-sm text-gray-500 mt-1">
            생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
            {lead?.company && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{lead.company}</span>}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500 mb-5">종합 리스크 점수</p>
          <div className="flex items-center gap-8">
            <div className="relative flex-shrink-0 w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 leading-none">{score}</span>
                <span className="text-xs text-gray-400 mt-1">/ 100</span>
              </div>
            </div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${riskLevelColor[output?.risk_level || "low"]}`}>
              리스크 수준: {riskLevelLabel[output?.risk_level || "low"]}
            </span>
          </div>
        </div>

        {output?.risks && output.risks.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">주요 리스크</h2>
            <div className="space-y-3">
              {output.risks.map((risk, i) => (
                <div key={i} className="flex gap-3 p-3.5 border border-gray-200 border-l-4 border-l-red-400 rounded-lg">
                  <span className="flex-shrink-0 w-7 h-7 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold border border-red-100">{i + 1}</span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {output?.next_steps && output.next_steps.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">권장 조치사항</h2>
            <div className="space-y-3">
              {output.next_steps.map((step, i) => (
                <div key={i} className="flex gap-3 p-3.5 border border-gray-200 border-l-4 border-l-blue-400 rounded-lg">
                  <span className="flex-shrink-0 w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold border border-blue-100">{i + 1}</span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">PDF 리포트 저장</p>
              <p className="text-sm text-gray-500 mt-0.5">진단 결과를 PDF 파일로 저장하여 팀과 공유하세요.</p>
            </div>
            <PrintPdfButton />
          </div>
        </div>
      </div>
    </div>
  );
}
