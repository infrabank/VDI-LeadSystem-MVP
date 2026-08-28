import Link from "next/link";
import type { VdiRoleOutput } from "@/lib/scoring/vdi-role";
import type { ResultType } from "@/lib/tools/vdi-role/questions";
import PrintPdfButton from "./PrintPdfButton";

const TYPE_COLORS: Record<ResultType, { bg: string; text: string; border: string; icon: string }> = {
  maintain: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", icon: "bg-emerald-500" },
  complement: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", icon: "bg-blue-500" },
  reduce: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", icon: "bg-amber-500" },
  redesign: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200", icon: "bg-red-500" },
};

const TYPE_DESCRIPTIONS: Record<ResultType, string> = {
  maintain:
    "현재 VDI가 핵심 보안 통제 수단으로 잘 작동합니다. 단기적으로는 유지·고도화가 비용 대비 효과적입니다. 단, N²SF 시행 후 인증/권한 통제 강화 요구가 추가됩니다.",
  complement:
    "VDI를 '격리 수단'이 아니라 '인증/권한과 결합된 워크스페이스'로 다시 정의해야 맞습니다. ZTNA/SDP·MFA·PAM 보완을 병행하면 N²SF S등급 영역에서 경쟁력을 확보할 수 있습니다.",
  reduce:
    "현재 VDI에서 처리하는 업무 중 상당 부분이 SaaS·브라우저·DaaS로 전환 가능합니다. VDI는 고위험 업무로 좁히고 인터넷·협업 업무는 떼어 내는 편이 효율적입니다.",
  redesign:
    "현재 VDI 구조가 비효율적이거나 사용자 불만/장애가 누적된 상태입니다. 단순 갱신은 비용 낭비가 될 가능성이 높습니다. 업무를 다시 분류한 뒤 환경을 단계적으로 재설계해야 합니다.",
};

interface Props {
  report: { created_at: string; id: string };
  lead: { company?: string | null; name?: string | null } | null;
  output: VdiRoleOutput;
  organizationName?: string | null;
}

export default function VdiRoleReport({ report, lead, output, organizationName }: Props) {
  const c = TYPE_COLORS[output.result_type];
  const orgDisplay = organizationName || lead?.company || "-";

  const totalScore = Object.values(output.type_scores).reduce((s, v) => s + v, 0) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">VDI 역할 재정의 진단 리포트</h1>
              <p className="text-sm text-gray-500 mt-1">
                생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
                {orgDisplay !== "-" && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {orgDisplay}
                  </span>
                )}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${c.bg} ${c.text} ${c.border}`}>
              결과: {output.result_name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 1. Result Hero */}
        <div className={`${c.bg} ${c.border} border rounded-xl p-6`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-white shadow-md`}>
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">권장 전략</p>
              <h2 className={`text-2xl font-bold ${c.text} mt-1`}>{output.result_name}</h2>
              <p className={`text-sm ${c.text} mt-3 leading-relaxed`}>
                {TYPE_DESCRIPTIONS[output.result_type]}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Type Score Breakdown (정성적 비교) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">유형별 적합도</h2>
          <div className="space-y-3">
            {(Object.keys(output.type_scores) as ResultType[]).map((t) => {
              const v = output.type_scores[t];
              const pct = Math.round((v / totalScore) * 100);
              const tc = TYPE_COLORS[t];
              const isWinner = t === output.result_type;
              return (
                <div key={t}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-medium ${isWinner ? "text-slate-900" : "text-gray-500"}`}>
                      {t === "maintain" ? "유지 강화형" : t === "complement" ? "제로트러스트 보완형" : t === "reduce" ? "점진적 축소형" : "재설계형"}
                      {isWinner && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-2xs font-semibold">선정</span>}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${tc.icon} rounded-full transition-[width]`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Rationale */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">도출 근거</h2>
          <ul className="space-y-2">
            {output.rationale.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Recommended Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">권장 조치</h2>
          <div className="space-y-3">
            {output.recommended_actions.map((action, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 border border-gray-200 border-l-4 border-l-blue-400 rounded-lg"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold border border-blue-100">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. VDI Disposition */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">업무 영역별 권장 처리</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Disposition title="유지(Keep)" items={output.vdi_disposition.keep} color="emerald" />
            <Disposition title="축소(Reduce)" items={output.vdi_disposition.reduce} color="amber" />
            <Disposition title="재설계(Redesign)" items={output.vdi_disposition.redesign} color="rose" />
          </div>
        </div>

        {/* 6. Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">다음 단계</h2>
          <ul className="space-y-2">
            {output.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                <span className="text-blue-600 font-bold mt-0.5">→</span>
                {step}
              </li>
            ))}
          </ul>
          <Link
            href="/tools/n2sf-readiness"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            N²SF 전환 준비도 진단도 받기 →
          </Link>
        </div>

        {/* PDF */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 print:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">PDF로 저장</p>
              <p className="text-sm text-gray-500 mt-0.5">
                팀 내부 검토 자료로 사용하세요.
              </p>
            </div>
            <PrintPdfButton />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-center shadow-md print:hidden">
          <h3 className="text-lg font-bold text-white mb-2">상세 컨설팅 신청</h3>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            기관 환경에 맞춘 단계적 전환 로드맵을 함께 설계해드립니다.
          </p>
          <Link
            href="/n2sf"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
          >
            상담 문의
          </Link>
        </div>
      </div>
    </div>
  );
}

function Disposition({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "emerald" | "amber" | "rose";
}) {
  const palette = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    rose: "bg-red-50 border-red-200 text-red-900",
  }[color];

  if (items.length === 0) return null;
  return (
    <div className={`p-4 rounded-lg border ${palette}`}>
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-xs leading-relaxed">
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
