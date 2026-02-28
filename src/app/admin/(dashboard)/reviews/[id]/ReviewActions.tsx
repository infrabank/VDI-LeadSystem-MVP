"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VALID_TRANSITIONS,
  STATUS_LABELS,
  type RequestStatus,
} from "@/lib/types/sap";

export default function ReviewActions({
  requestId,
  currentStatus,
  notesInternal,
}: {
  requestId: string;
  currentStatus: string;
  notesInternal: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(notesInternal);
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState<string | null>(null);

  const allowed = VALID_TRANSITIONS[currentStatus as RequestStatus] ?? [];

  async function handleTransition(newStatus: string) {
    setTransitioning(newStatus);
    try {
      const res = await fetch(`/api/admin/reviews/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setTransitioning(null);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/admin/reviews/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes_internal: notes }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">상태 관리</h2>

      {/* Status transitions */}
      {allowed.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-500 py-1">상태 변경:</span>
          {allowed.map((s) => (
            <button
              key={s}
              onClick={() => handleTransition(s)}
              disabled={transitioning !== null}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {transitioning === s
                ? "처리 중..."
                : `→ ${STATUS_LABELS[s as RequestStatus]}`}
            </button>
          ))}
        </div>
      )}

      {/* Internal notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내부 메모
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="내부 참고 메모 (SI 파트너에게 노출되지 않음)"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className="mt-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "메모 저장"}
        </button>
      </div>
    </div>
  );
}
