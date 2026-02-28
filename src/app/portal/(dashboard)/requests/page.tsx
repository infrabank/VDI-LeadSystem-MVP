import { requirePortalAuth } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  VENDOR_LABELS,
  type ReviewRequest,
  type RequestStatus,
  type RequestPriority,
  type VendorTrack,
} from "@/lib/types/sap";

function StatusBadge({ status }: { status: RequestStatus }) {
  const colors: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-800",
    triage: "bg-orange-100 text-orange-800",
    in_review: "bg-blue-100 text-blue-800",
    draft_ready: "bg-indigo-100 text-indigo-800",
    final_ready: "bg-green-100 text-green-800",
    delivered: "bg-emerald-100 text-emerald-800",
    closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default async function PortalRequestsPage() {
  const user = await requirePortalAuth();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from("review_requests")
    .select("*")
    .eq("org_id", user.orgId)
    .order("created_at", { ascending: false });

  const items = (requests ?? []) as ReviewRequest[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">기술 검토 요청</h1>
        <Link
          href="/portal/requests/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 새 검토 요청
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">아직 검토 요청이 없습니다.</p>
          <Link
            href="/portal/requests/new"
            className="text-blue-600 hover:underline text-sm"
          >
            첫 번째 검토 요청 작성하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  프로젝트
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  벤더
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  상태
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  우선순위
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  마감일
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  요청일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/requests/${r.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {r.project_name}
                    </Link>
                    {r.customer_name && (
                      <span className="text-gray-400 text-xs ml-2">
                        {r.customer_name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {VENDOR_LABELS[r.vendor_track as VendorTrack] ??
                      r.vendor_track}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as RequestStatus} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {PRIORITY_LABELS[r.priority as RequestPriority] ??
                      r.priority}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(r.due_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
