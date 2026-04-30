import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LeadDetailActions from "./LeadDetailActions";

const STATUS_LABELS: Record<string, string> = {
  new: "신규",
  reviewing: "검토중",
  meeting_scheduled: "미팅예정",
  proposing: "제안중",
  on_hold: "보류",
  won: "수주",
  lost: "실패",
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  reviewing: "bg-blue-100 text-blue-700",
  meeting_scheduled: "bg-amber-100 text-amber-700",
  proposing: "bg-indigo-100 text-indigo-700",
  on_hold: "bg-gray-200 text-gray-600",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

const TOOL_TYPE_LABELS: Record<string, string> = {
  risk_assessment: "VDI 리스크 진단",
  n2sf_readiness: "N²SF 전환 준비도",
  vdi_role: "VDI 역할 재정의",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) notFound();

  const { data: extension } = await supabase
    .from("lead_extensions")
    .select("*")
    .eq("lead_id", id)
    .maybeSingle();

  const { data: toolRuns } = await supabase
    .from("tool_runs")
    .select("id, tool_type, score, output_json, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const { data: history } = await supabase
    .from("lead_status_history")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const { data: notes } = await supabase
    .from("sales_partner_notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const { data: reports } = await supabase
    .from("reports")
    .select("id, access_token, tool_run_id, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/leads"
            className="text-xs text-blue-700 hover:underline"
          >
            ← 리드 목록으로
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            {extension?.organization_name || lead.company || lead.email}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            등록일 {new Date(lead.created_at).toLocaleString("ko-KR")}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_BADGE[lead.status] || "bg-slate-100 text-slate-700"}`}
        >
          {STATUS_LABELS[lead.status] || lead.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">기본 정보</h2>
            <dl className="text-sm space-y-2">
              <Field label="이메일" value={lead.email} />
              <Field label="이름" value={lead.name} />
              <Field label="회사/기관" value={lead.company} />
              <Field label="유입 출처" value={lead.source} />
              <Field
                label="동의"
                value={lead.consent_marketing ? "예" : "아니오"}
              />
              <Field label="점수" value={String(lead.score ?? 0)} />
            </dl>
          </div>

          {extension && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">
                기관 확장 정보
              </h2>
              <dl className="text-sm space-y-2">
                <Field label="기관명" value={extension.organization_name} />
                <Field label="기관 유형" value={extension.organization_type} />
                <Field label="부서" value={extension.department} />
                <Field label="연락처" value={extension.phone} />
                <Field
                  label="관심 분야"
                  value={
                    Array.isArray(extension.interest_area) &&
                    extension.interest_area.length > 0
                      ? extension.interest_area.join(", ")
                      : "-"
                  }
                />
                {extension.message && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">
                      상담 희망 내용
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {extension.message}
                    </p>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Right: Status, Notes, History, Diagnosis */}
        <div className="lg:col-span-2 space-y-4">
          <LeadDetailActions
            leadId={lead.id}
            currentStatus={lead.status}
            initialNotes={
              notes?.map((n) => ({
                id: n.id,
                content: n.content,
                created_at: n.created_at,
                created_by: n.created_by,
              })) || []
            }
          />

          {/* Diagnosis history */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">진단 이력</h2>
            {!toolRuns || toolRuns.length === 0 ? (
              <p className="text-sm text-slate-400">진단 이력이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {toolRuns.map((tr) => {
                  const matchingReport = reports?.find(
                    (r) => r.tool_run_id === tr.id
                  );
                  const output = tr.output_json as Record<string, unknown>;
                  const summary =
                    tr.tool_type === "n2sf_readiness"
                      ? `Level ${output?.level} — ${output?.level_name}`
                      : tr.tool_type === "vdi_role"
                        ? `유형: ${output?.result_name}`
                        : `점수: ${tr.score ?? 0}`;
                  return (
                    <div
                      key={tr.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {TOOL_TYPE_LABELS[tr.tool_type] || tr.tool_type}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {summary} ·{" "}
                          {new Date(tr.created_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                      {matchingReport && (
                        <Link
                          href={`/reports/${matchingReport.access_token}`}
                          target="_blank"
                          className="text-xs text-blue-700 hover:underline font-semibold"
                        >
                          리포트 보기 →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">
              상태 변경 이력
            </h2>
            {!history || history.length === 0 ? (
              <p className="text-sm text-slate-400">변경 이력이 없습니다.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-start gap-2 text-slate-700"
                  >
                    <span className="text-slate-400 text-xs whitespace-nowrap">
                      {new Date(h.created_at).toLocaleString("ko-KR")}
                    </span>
                    <span>
                      <strong>
                        {STATUS_LABELS[h.from_status] ?? h.from_status ?? "-"}
                      </strong>{" "}
                      →{" "}
                      <strong>
                        {STATUS_LABELS[h.to_status] ?? h.to_status}
                      </strong>
                      {h.note && (
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {h.note}
                        </span>
                      )}
                      {h.created_by && (
                        <span className="text-xs text-slate-400 ml-1">
                          ({h.created_by})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-xs text-slate-500 font-medium">{label}</dt>
      <dd className="text-sm text-slate-800 text-right">{value || "-"}</dd>
    </div>
  );
}
