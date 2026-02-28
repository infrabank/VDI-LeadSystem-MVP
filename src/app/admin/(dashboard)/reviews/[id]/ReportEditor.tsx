"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReviewReport, ReviewScore, ReportContent, QAItem } from "@/lib/types/sap";

export default function ReportEditor({
  requestId,
  reports,
  scores,
}: {
  requestId: string;
  reports: ReviewReport[];
  scores: ReviewScore[];
}) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const latestDraft = reports.find((r) => r.state === "draft");
  const latestFinal = reports.find((r) => r.state === "final");

  const [editContent, setEditContent] = useState<ReportContent | null>(
    latestDraft?.content_json ?? null
  );
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/reviews/${requestId}/report`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "생성 실패");
      } else {
        setEditContent(data.data.content_json);
        setSuccess("초안이 생성되었습니다.");
        router.refresh();
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveDraft() {
    if (!latestDraft || !editContent) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/reviews/${requestId}/report`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: latestDraft.id,
          content_json: editContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "저장 실패");
      } else {
        setSuccess("초안이 저장되었습니다.");
        router.refresh();
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setSaving(false);
    }
  }

  async function handleFinalize() {
    if (!confirm("리포트를 최종 확정하시겠습니까? 확정 후에는 수정할 수 없습니다."))
      return;

    setFinalizing(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/reviews/${requestId}/finalize`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "확정 실패");
      } else {
        setSuccess(
          `리포트가 최종 확정되었습니다.${data.data.pdf_storage_key ? " PDF가 생성되었습니다." : ""}`
        );
        router.refresh();
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setFinalizing(false);
    }
  }

  function updateSection(index: number, field: "title" | "body", value: string) {
    if (!editContent) return;
    const sections = [...editContent.sections];
    sections[index] = { ...sections[index], [field]: value };
    setEditContent({ ...editContent, sections });
  }

  function updateQA(index: number, field: "question" | "answer", value: string) {
    if (!editContent) return;
    const qa = [...editContent.qa_items];
    qa[index] = { ...qa[index], [field]: value };
    setEditContent({ ...editContent, qa_items: qa });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">리포트</h2>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleGenerate}
          disabled={generating || scores.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {generating
            ? "생성 중..."
            : latestDraft
              ? "초안 재생성"
              : "초안 생성"}
        </button>

        {latestDraft && (
          <>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "저장 중..." : "초안 저장"}
            </button>
            <button
              onClick={handleFinalize}
              disabled={finalizing}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {finalizing ? "확정 중..." : "최종 확정 (PDF 생성)"}
            </button>
          </>
        )}
      </div>

      {scores.length === 0 && (
        <p className="text-gray-400 text-sm mb-4">
          점수를 먼저 입력한 후 초안을 생성할 수 있습니다.
        </p>
      )}

      {/* Final report info */}
      {latestFinal && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4 text-sm">
          <strong className="text-green-700">최종 리포트 v{latestFinal.version}</strong>
          <span className="text-green-600 ml-2">
            {new Date(latestFinal.created_at).toLocaleString("ko-KR")}
          </span>
          {latestFinal.pdf_storage_key && (
            <span className="text-green-600 ml-2">- PDF 생성됨</span>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg mb-4">
          {success}
        </p>
      )}

      {/* Draft Editor */}
      {editContent && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Executive Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Executive Summary
            </label>
            <textarea
              rows={5}
              value={editContent.executive_summary}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  executive_summary: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Risk level */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">위험도:</label>
            <select
              value={editContent.risk_level}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  risk_level: e.target.value as ReportContent["risk_level"],
                })
              }
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="critical">심각</option>
            </select>
          </div>

          {/* Top issues */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주요 이슈 (줄바꿈 구분)
            </label>
            <textarea
              rows={3}
              value={editContent.top_issues.join("\n")}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  top_issues: e.target.value.split("\n").filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Top recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주요 권고사항 (줄바꿈 구분)
            </label>
            <textarea
              rows={3}
              value={editContent.top_recommendations.join("\n")}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  top_recommendations: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Proposal Snippets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제안서 삽입 문구 (줄바꿈 구분)
            </label>
            <textarea
              rows={6}
              value={(editContent.proposal_snippets ?? []).join("\n\n---\n\n")}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  proposal_snippets: e.target.value.split("\n\n---\n\n").filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="제안서에 삽입할 문구를 입력하세요. 문구 사이에 ---를 넣어 구분합니다."
            />
          </div>

          {/* Risk Flags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              리스크 플래그 (줄바꿈 구분)
            </label>
            <textarea
              rows={3}
              value={(editContent.risk_flags ?? []).join("\n")}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  risk_flags: e.target.value.split("\n").filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="자동 감지된 리스크 플래그"
            />
          </div>

          {/* Conclusion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              결론 및 수주 영향도 분석
            </label>
            <textarea
              rows={5}
              value={editContent.conclusion ?? ""}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  conclusion: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">섹션</h3>
            {editContent.sections.map((section, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 mb-2"
              >
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(i, "title", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  rows={4}
                  value={section.body}
                  onChange={(e) => updateSection(i, "body", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Q&A grouped by category */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Q&A ({editContent.qa_items.length}개)
            </h3>
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {(() => {
                const grouped = new Map<string, { item: QAItem; idx: number }[]>();
                editContent.qa_items.forEach((qa, idx) => {
                  const cat = qa.category || "일반";
                  if (!grouped.has(cat)) grouped.set(cat, []);
                  grouped.get(cat)!.push({ item: qa, idx });
                });
                return Array.from(grouped.entries()).map(([category, items]) => {
                  const isCollapsed = collapsedCategories.has(category);
                  return (
                    <div key={category} className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setCollapsedCategories((prev) => {
                            const next = new Set(prev);
                            if (next.has(category)) next.delete(category);
                            else next.add(category);
                            return next;
                          });
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span>{category} ({items.length})</span>
                        <span className="text-gray-400">{isCollapsed ? "+" : "−"}</span>
                      </button>
                      {!isCollapsed && (
                        <div className="p-2 space-y-2">
                          {items.map(({ item: qa, idx }) => (
                            <div key={idx} className="border border-gray-100 rounded p-2 text-sm">
                              <input
                                type="text"
                                value={qa.question}
                                onChange={(e) => updateQA(idx, "question", e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded font-medium mb-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <textarea
                                rows={2}
                                value={qa.answer}
                                onChange={(e) => updateQA(idx, "answer", e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
