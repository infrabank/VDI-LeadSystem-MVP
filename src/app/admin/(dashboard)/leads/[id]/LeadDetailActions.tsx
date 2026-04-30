"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "new", label: "신규" },
  { value: "reviewing", label: "검토중" },
  { value: "meeting_scheduled", label: "미팅예정" },
  { value: "proposing", label: "제안중" },
  { value: "on_hold", label: "보류" },
  { value: "won", label: "수주" },
  { value: "lost", label: "실패" },
];

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string | null;
}

interface Props {
  leadId: string;
  currentStatus: string;
  initialNotes: Note[];
}

export default function LeadDetailActions({
  leadId,
  currentStatus,
  initialNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteMsg, setNoteMsg] = useState<string | null>(null);

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    setStatusSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: statusNote || null }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "상태 변경 실패");
      }
      setStatusMsg("상태가 변경되었습니다.");
      setStatusNote("");
      router.refresh();
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : "오류");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNoteSaving(true);
    setNoteMsg(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "메모 추가 실패");
      }
      const created = (await res.json()) as Note;
      setNotes((prev) => [created, ...prev]);
      setNewNote("");
      setNoteMsg("메모가 추가되었습니다.");
    } catch (err) {
      setNoteMsg(err instanceof Error ? err.message : "오류");
    } finally {
      setNoteSaving(false);
    }
  }

  return (
    <>
      {/* Status Update */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">상태 변경</h2>
        <form onSubmit={handleStatusUpdate} className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => {
              const selected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selected
                      ? "border-blue-700 bg-blue-50 text-blue-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            rows={2}
            placeholder="변경 사유 (선택)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-between items-center gap-3">
            {statusMsg && (
              <p
                className={`text-xs ${
                  statusMsg.includes("실패") || statusMsg.includes("오류")
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {statusMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={statusSaving}
              className="ml-auto px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              {statusSaving ? "저장 중..." : "상태 저장"}
            </button>
          </div>
        </form>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">관리자 메모</h2>
        <form onSubmit={handleAddNote} className="space-y-2 mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            placeholder="고객 미팅 결과, 후속 작업, 메모 등을 자유롭게 기록하세요."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-between items-center gap-3">
            {noteMsg && (
              <p
                className={`text-xs ${
                  noteMsg.includes("실패") || noteMsg.includes("오류")
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {noteMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={noteSaving || !newNote.trim()}
              className="ml-auto px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              {noteSaving ? "추가 중..." : "메모 추가"}
            </button>
          </div>
        </form>

        {notes.length === 0 ? (
          <p className="text-sm text-slate-400">아직 메모가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li
                key={n.id}
                className="border-l-4 border-blue-400 bg-slate-50 rounded-lg p-3"
              >
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {n.content}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  {new Date(n.created_at).toLocaleString("ko-KR")}
                  {n.created_by && (
                    <span className="ml-2">· {n.created_by}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
