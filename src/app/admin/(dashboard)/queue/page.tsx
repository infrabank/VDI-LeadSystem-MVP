import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  VENDOR_LABELS,
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
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? ""}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: RequestPriority }) {
  const colors: Record<string, string> = {
    low: "bg-gray-400",
    normal: "bg-blue-400",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${colors[priority] ?? ""}`} />
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

function isOverdue(dueAt: string, status: string): boolean {
  if (["delivered", "closed"].includes(status)) return false;
  return new Date(dueAt) < new Date();
}

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string }>;
}) {
  await requireAdmin();
  const resolvedParams = await searchParams;

  const admin = createAdminClient();
  let query = admin
    .from("review_requests")
    .select("*, organizations(name)")
    .order("due_at", { ascending: true });

  if (resolvedParams.status) {
    query = query.eq("status", resolvedParams.status);
  } else {
    query = query.neq("status", "closed");
  }

  if (resolvedParams.priority) {
    query = query.eq("priority", resolvedParams.priority);
  }

  const { data: requests } = await query;
  const items = requests ?? [];

  const statusOptions: RequestStatus[] = [
    "submitted",
    "triage",
    "in_review",
    "draft_ready",
    "final_ready",
    "delivered",
    "closed",
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">검토 큐</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/queue"
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            !resolvedParams.status
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          전체 (활성)
        </Link>
        {statusOptions.map((s) => (
          <Link
            key={s}
            href={`/admin/queue?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              resolvedParams.status === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          검토 요청이 없습니다.
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
                  SI 파트너
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((r: Record<string, unknown>) => {
                const overdue = isOverdue(r.due_at as string, r.status as string);
                return (
                  <tr
                    key={r.id as string}
                    className={`hover:bg-gray-50 ${overdue ? "bg-red-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/reviews/${r.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {r.project_name as string}
                      </Link>
                      {r.customer_name ? (
                        <span className="text-gray-400 text-xs ml-2">
                          {String(r.customer_name)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {(r.organizations as { name: string })?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {VENDOR_LABELS[(r.vendor_track as VendorTrack)] ??
                        (r.vendor_track as string)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status as RequestStatus} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <PriorityDot priority={r.priority as RequestPriority} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className={overdue ? "text-red-600 font-medium" : "text-gray-500"}>
                        {new Date(r.due_at as string).toLocaleDateString("ko-KR")}
                        {overdue && " (초과)"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
