"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DOMAIN_LABELS,
  type ReviewScore,
  type ScoreDomain,
} from "@/lib/types/sap";

const DOMAINS: ScoreDomain[] = [
  "compute",
  "storage",
  "network",
  "ha_dr",
  "backup",
  "license",
];

interface ScoreInput {
  score: string;
  rationale: string;
  risks: string;
  recommendations: string;
}

export default function ScoringForm({
  requestId,
  existingScores,
}: {
  requestId: string;
  existingScores: ReviewScore[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize from existing scores
  const initial: Record<ScoreDomain, ScoreInput> = {} as Record<ScoreDomain, ScoreInput>;
  for (const d of DOMAINS) {
    const existing = existingScores.find((s) => s.domain === d);
    initial[d] = {
      score: existing ? String(existing.score) : "",
      rationale: existing?.rationale ?? "",
      risks: existing ? (existing.risks as string[]).join("\n") : "",
      recommendations: existing
        ? (existing.recommendations as string[]).join("\n")
        : "",
    };
  }

  const [scores, setScores] = useState(initial);

  function updateDomain(domain: ScoreDomain, field: keyof ScoreInput, value: string) {
    setScores((prev) => ({
      ...prev,
      [domain]: { ...prev[domain], [field]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Build scores array - only submit domains with a score value
    const payload = DOMAINS.filter((d) => scores[d].score !== "")
      .map((d) => ({
        domain: d,
        score: parseInt(scores[d].score, 10),
        rationale: scores[d].rationale || null,
        risks: scores[d].risks
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        recommendations: scores[d].recommendations
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }));

    if (payload.length === 0) {
      setError("최소 하나의 영역에 점수를 입력해주세요.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${requestId}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "저장 실패");
      } else {
        setSuccess("점수가 저장되었습니다.");
        router.refresh();
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">영역별 점수 평가</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {DOMAINS.map((domain) => (
            <div
              key={domain}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">
                  {DOMAIN_LABELS[domain]}
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">점수 (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={scores[domain].score}
                    onChange={(e) =>
                      updateDomain(domain, "score", e.target.value)
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="—"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    평가 근거
                  </label>
                  <textarea
                    rows={2}
                    value={scores[domain].rationale}
                    onChange={(e) =>
                      updateDomain(domain, "rationale", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="점수 산정 근거"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    위험 요소 (줄바꿈 구분)
                  </label>
                  <textarea
                    rows={2}
                    value={scores[domain].risks}
                    onChange={(e) =>
                      updateDomain(domain, "risks", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="위험 요소 1&#10;위험 요소 2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    권고 사항 (줄바꿈 구분)
                  </label>
                  <textarea
                    rows={2}
                    value={scores[domain].recommendations}
                    onChange={(e) =>
                      updateDomain(domain, "recommendations", e.target.value)
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="권고 사항 1&#10;권고 사항 2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg mt-4">
            {success}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "저장 중..." : "점수 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
