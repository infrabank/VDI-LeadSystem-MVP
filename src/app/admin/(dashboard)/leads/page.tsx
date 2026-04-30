import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

const SOURCE_LABELS: Record<string, string> = {
  direct: "직접",
  diagnostic: "VDI 리스크 진단",
  "n2sf-readiness": "N²SF 준비도",
  "vdi-role": "VDI 역할 재정의",
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, email, name, company, source, status, score, created_at, lead_extensions(organization_name)"
    )
    .order("created_at", { ascending: false });

  const rows = (leads as Array<{
    id: string;
    email: string;
    name: string | null;
    company: string | null;
    source: string | null;
    status: string;
    score: number | null;
    created_at: string;
    lead_extensions: { organization_name: string | null } | { organization_name: string | null }[] | null;
  }> | null) || [];

  function getOrgName(row: (typeof rows)[number]): string | null {
    const ext = row.lead_extensions;
    if (!ext) return null;
    if (Array.isArray(ext)) return ext[0]?.organization_name ?? null;
    return ext.organization_name ?? null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">리드 관리</h1>
        <p className="text-sm text-slate-500">총 {rows.length}건</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                기관/회사
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                담당자
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                이메일
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                출처
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                점수
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                등록일
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((lead) => {
                const orgName = getOrgName(lead);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {orgName || lead.company || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {SOURCE_LABELS[lead.source || ""] || lead.source || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                          STATUS_BADGE[lead.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {STATUS_LABELS[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{lead.score ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-xs text-blue-700 font-semibold hover:underline"
                      >
                        상세 →
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  리드가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
