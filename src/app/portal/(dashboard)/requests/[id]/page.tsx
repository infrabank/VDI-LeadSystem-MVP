import { requirePortalAuth, getAuthorizedRequest } from "@/lib/auth-sap";
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
  type ReviewAttachment,
  type ReviewScore,
  type RequestStatus,
  type VendorTrack,
  type NetworkType,
  type ScoreDomain,
} from "@/lib/types/sap";
import PortalAttachmentUpload from "./PortalAttachmentUpload";
import PortalDownloadButton from "./PortalDownloadButton";

export default async function PortalRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePortalAuth();
  const { id } = await params;
  const request = (await getAuthorizedRequest(id, user)) as ReviewRequest | null;

  if (!request) notFound();

  const admin = createAdminClient();

  const [attachRes, scoreRes, reportRes] = await Promise.all([
    admin
      .from("review_attachments")
      .select("*")
      .eq("request_id", id)
      .eq("visibility", "org")
      .order("created_at", { ascending: false }),
    admin
      .from("review_scores")
      .select("*")
      .eq("request_id", id)
      .order("domain"),
    admin
      .from("review_reports")
      .select("id, version, state, pdf_storage_key, created_at")
      .eq("request_id", id)
      .eq("state", "final")
      .order("version", { ascending: false })
      .limit(1),
  ]);

  const attachments = (attachRes.data ?? []) as ReviewAttachment[];
  const scores = (scoreRes.data ?? []) as ReviewScore[];
  const finalReport = reportRes.data?.[0] ?? null;

  const statusColor: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-800 border-yellow-300",
    triage: "bg-orange-100 text-orange-800 border-orange-300",
    in_review: "bg-blue-100 text-blue-800 border-blue-300",
    draft_ready: "bg-indigo-100 text-indigo-800 border-indigo-300",
    final_ready: "bg-green-100 text-green-800 border-green-300",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
    closed: "bg-gray-100 text-gray-600 border-gray-300",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/portal/requests"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; 목록으로
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{request.project_name}</h1>
            {request.customer_name && (
              <p className="text-gray-500 mt-1">{request.customer_name}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor[request.status] ?? ""}`}
          >
            {STATUS_LABELS[request.status as RequestStatus] ?? request.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-500">벤더</span>
            <p className="font-medium">
              {VENDOR_LABELS[request.vendor_track as VendorTrack] ?? request.vendor_track}
            </p>
          </div>
          <div>
            <span className="text-gray-500">네트워크</span>
            <p className="font-medium">
              {NETWORK_LABELS[request.network_type as NetworkType] ?? request.network_type}
            </p>
          </div>
          <div>
            <span className="text-gray-500">사용자 수</span>
            <p className="font-medium">{request.user_count}명</p>
          </div>
          <div>
            <span className="text-gray-500">사이트 수</span>
            <p className="font-medium">{request.site_count}개</p>
          </div>
          <div>
            <span className="text-gray-500">우선순위</span>
            <p className="font-medium">
              {PRIORITY_LABELS[request.priority as keyof typeof PRIORITY_LABELS] ?? request.priority}
            </p>
          </div>
          <div>
            <span className="text-gray-500">마감일</span>
            <p className="font-medium">
              {new Date(request.due_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <span className="text-gray-500">HA/DR/백업</span>
            <p className="font-medium">
              {[
                request.ha_required && "HA",
                request.dr_required && "DR",
                request.backup_required && "백업",
              ]
                .filter(Boolean)
                .join(", ") || "없음"}
            </p>
          </div>
          <div>
            <span className="text-gray-500">요청일</span>
            <p className="font-medium">
              {new Date(request.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>

        {request.requirements_summary && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
            <span className="font-medium text-gray-600">요구사항: </span>
            {request.requirements_summary}
          </div>
        )}

        {request.notes_external && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
            <span className="font-medium text-blue-600">메모: </span>
            {request.notes_external}
          </div>
        )}
      </div>

      {/* Scores (if available) */}
      {scores.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">검토 점수</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {scores.map((sc) => (
              <div
                key={sc.id}
                className="border border-gray-200 rounded-lg p-3 text-center"
              >
                <p className="text-xs text-gray-500 mb-1">
                  {DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    sc.score >= 80
                      ? "text-green-600"
                      : sc.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {sc.score}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Report Download */}
      {finalReport?.pdf_storage_key && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            검토 리포트 준비 완료
          </h2>
          <p className="text-sm text-green-700 mb-4">
            기술 검토가 완료되었습니다. 아래에서 리포트를 다운로드하세요.
          </p>
          <PortalDownloadButton
            requestId={id}
            storageKey={finalReport.pdf_storage_key}
          />
        </div>
      )}

      {/* Attachments */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">첨부 파일</h2>

        {attachments.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {attachments.map((att) => (
              <li
                key={att.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
              >
                <span>
                  {att.file_name}
                  <span className="text-gray-400 ml-2">
                    ({Math.round(att.file_size / 1024)}KB)
                  </span>
                </span>
                <PortalDownloadButton
                  requestId={id}
                  storageKey={att.storage_key}
                  type="attachment"
                  label="다운로드"
                  small
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm mb-4">첨부 파일이 없습니다.</p>
        )}

        {/* Upload form - only show for active requests */}
        {!["delivered", "closed"].includes(request.status) && (
          <PortalAttachmentUpload requestId={id} />
        )}
      </div>
    </div>
  );
}
