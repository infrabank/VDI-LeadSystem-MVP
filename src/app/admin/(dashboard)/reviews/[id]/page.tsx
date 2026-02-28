import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  VENDOR_LABELS,
  NETWORK_LABELS,
  DOMAIN_LABELS,
  type ReviewRequest,
  type ReviewScore,
  type ReviewReport,
  type AuditLog,
  type RequestStatus,
  type VendorTrack,
  type NetworkType,
  type ScoreDomain,
} from "@/lib/types/sap";
import ReviewActions from "./ReviewActions";
import ScoringForm from "./ScoringForm";
import ReportEditor from "./ReportEditor";

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from("review_requests")
    .select("*, organizations(name)")
    .eq("id", id)
    .single();

  if (!request) notFound();

  const [scoreRes, reportRes, attachRes, auditRes] = await Promise.all([
    admin
      .from("review_scores")
      .select("*")
      .eq("request_id", id)
      .order("domain"),
    admin
      .from("review_reports")
      .select("*")
      .eq("request_id", id)
      .order("version", { ascending: false }),
    admin
      .from("review_attachments")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    admin
      .from("audit_logs")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const scores = (scoreRes.data ?? []) as ReviewScore[];
  const reports = (reportRes.data ?? []) as ReviewReport[];
  const attachments = attachRes.data ?? [];
  const auditLogs = (auditRes.data ?? []) as AuditLog[];

  const r = request as ReviewRequest & { organizations: { name: string } };

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/admin/queue"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; 큐로 돌아가기
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{r.project_name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {r.organizations?.name} &middot;{" "}
              {r.customer_name ?? "고객사 미지정"}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                {
                  submitted: "bg-yellow-100 text-yellow-800",
                  triage: "bg-orange-100 text-orange-800",
                  in_review: "bg-blue-100 text-blue-800",
                  draft_ready: "bg-indigo-100 text-indigo-800",
                  final_ready: "bg-green-100 text-green-800",
                  delivered: "bg-emerald-100 text-emerald-800",
                  closed: "bg-gray-100 text-gray-600",
                }[r.status] ?? ""
              }`}
            >
              {STATUS_LABELS[r.status as RequestStatus]}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              마감: {new Date(r.due_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-gray-500">벤더</span>
            <p className="font-medium">
              {VENDOR_LABELS[r.vendor_track as VendorTrack]}
            </p>
          </div>
          <div>
            <span className="text-gray-500">네트워크</span>
            <p className="font-medium">
              {NETWORK_LABELS[r.network_type as NetworkType]}
            </p>
          </div>
          <div>
            <span className="text-gray-500">사용자/사이트</span>
            <p className="font-medium">
              {r.user_count}명 / {r.site_count}개
            </p>
          </div>
          <div>
            <span className="text-gray-500">우선순위</span>
            <p className="font-medium">
              {PRIORITY_LABELS[r.priority as keyof typeof PRIORITY_LABELS]}
            </p>
          </div>
          <div>
            <span className="text-gray-500">HA / DR / 백업</span>
            <p className="font-medium">
              {[
                r.ha_required && "HA",
                r.dr_required && "DR",
                r.backup_required && "백업",
              ]
                .filter(Boolean)
                .join(" / ") || "없음"}
            </p>
          </div>
          {r.budget_range && (
            <div>
              <span className="text-gray-500">예산</span>
              <p className="font-medium">{r.budget_range}</p>
            </div>
          )}
          {r.timeline && (
            <div>
              <span className="text-gray-500">일정</span>
              <p className="font-medium">{r.timeline}</p>
            </div>
          )}
        </div>

        {r.requirements_summary && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
            <strong className="text-gray-600">요구사항:</strong>{" "}
            {r.requirements_summary}
          </div>
        )}
        {r.existing_infra && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
            <strong className="text-gray-600">기존 인프라:</strong>{" "}
            {r.existing_infra}
          </div>
        )}
        {r.notes_external && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
            <strong className="text-blue-600">외부 메모:</strong>{" "}
            {r.notes_external}
          </div>
        )}
      </div>

      {/* Status Transition & Internal Notes */}
      <ReviewActions
        requestId={id}
        currentStatus={r.status}
        notesInternal={r.notes_internal ?? ""}
      />

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">첨부 파일</h2>
          <ul className="space-y-1 text-sm">
            {attachments.map((a: Record<string, unknown>) => (
              <li
                key={a.id as string}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>
                  {a.file_name as string}{" "}
                  <span className="text-gray-400">
                    ({Math.round((a.file_size as number) / 1024)}KB ·{" "}
                    {a.visibility === "internal" ? "내부" : "공개"})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scoring */}
      <ScoringForm requestId={id} existingScores={scores} />

      {/* Reports */}
      <ReportEditor requestId={id} reports={reports} scores={scores} />

      {/* Audit Log */}
      {auditLogs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">감사 로그</h2>
          <div className="space-y-1 text-xs max-h-60 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
              >
                <span className="text-gray-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString("ko-KR")}
                </span>
                <span className="font-mono text-gray-600">{log.action}</span>
                <span className="text-gray-400 truncate">
                  {JSON.stringify(log.payload)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
