"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VENDOR_LABELS,
  NETWORK_LABELS,
  type VendorTrack,
  type NetworkType,
} from "@/lib/types/sap";

const SECURITY_OPTIONS = [
  { key: "endpoint_protection", label: "엔드포인트 보호" },
  { key: "network_segmentation", label: "네트워크 분리" },
  { key: "mfa", label: "다중 인증(MFA)" },
  { key: "data_encryption", label: "데이터 암호화" },
  { key: "dlp", label: "데이터 유출 방지(DLP)" },
  { key: "compliance", label: "컴플라이언스 요구" },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    project_name: "",
    customer_name: "",
    vendor_track: "vmware" as VendorTrack,
    network_type: "on_premise" as NetworkType,
    user_count: "",
    site_count: "1",
    ha_required: false,
    dr_required: false,
    backup_required: false,
    backup_retention_months: "",
    security_flags: {} as Record<string, boolean>,
    existing_infra: "",
    requirements_summary: "",
    budget_range: "",
    timeline: "",
    priority: "normal",
    notes_external: "",
  });

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSecurity(key: string) {
    setForm((prev) => ({
      ...prev,
      security_flags: {
        ...prev.security_flags,
        [key]: !prev.security_flags[key],
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "요청 생성에 실패했습니다.");
        setLoading(false);
        return;
      }

      router.push(`/portal/requests/${data.data.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">새 기술 검토 요청</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">프로젝트 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트명 *
              </label>
              <input
                type="text"
                required
                value={form.project_name}
                onChange={(e) => updateField("project_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: OO기업 VDI 구축"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                고객사명
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                벤더 트랙 *
              </label>
              <select
                value={form.vendor_track}
                onChange={(e) =>
                  updateField("vendor_track", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(VENDOR_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                네트워크 유형 *
              </label>
              <select
                value={form.network_type}
                onChange={(e) =>
                  updateField("network_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(NETWORK_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용자 수 *
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.user_count}
                onChange={(e) => updateField("user_count", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사이트 수
              </label>
              <input
                type="number"
                min={1}
                value={form.site_count}
                onChange={(e) => updateField("site_count", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">요구사항</h2>

          <div className="flex flex-wrap gap-6 mb-4">
            {[
              { key: "ha_required", label: "고가용성(HA)" },
              { key: "dr_required", label: "재해복구(DR)" },
              { key: "backup_required", label: "백업" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => updateField(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {label} 필요
              </label>
            ))}
          </div>

          {form.backup_required && (
            <div className="mt-2 ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                백업 보존 기간 (개월)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.backup_retention_months}
                onChange={(e) => updateField("backup_retention_months", e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 12"
              />
              <p className="text-xs text-gray-500 mt-1">6개월 이상 시 장기 보존 전략이 포함됩니다</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              보안 요구사항
            </label>
            <div className="flex flex-wrap gap-3">
              {SECURITY_OPTIONS.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={!!form.security_flags[key]}
                    onChange={() => toggleSecurity(key)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기존 인프라 현황
            </label>
            <textarea
              rows={3}
              value={form.existing_infra}
              onChange={(e) => updateField("existing_infra", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="현재 운영 중인 서버, 스토리지, 네트워크 환경을 간략히 기술해주세요."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요구사항 요약
            </label>
            <textarea
              rows={4}
              value={form.requirements_summary}
              onChange={(e) =>
                updateField("requirements_summary", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="핵심 요구사항, 특이사항, 고객의 주요 관심사 등을 기술해주세요."
            />
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">추가 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                예산 범위
              </label>
              <input
                type="text"
                value={form.budget_range}
                onChange={(e) => updateField("budget_range", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 5억~10억"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                구축 일정
              </label>
              <input
                type="text"
                value={form.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 2026년 Q3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                우선순위
              </label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">낮음</option>
                <option value="normal">보통</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비고 (외부 메모)
            </label>
            <textarea
              rows={2}
              value={form.notes_external}
              onChange={(e) => updateField("notes_external", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="검토자에게 전달할 참고사항"
            />
          </div>
        </section>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "제출 중..." : "검토 요청 제출"}
          </button>
        </div>
      </form>
    </div>
  );
}
