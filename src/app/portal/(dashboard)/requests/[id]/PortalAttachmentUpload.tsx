"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PortalAttachmentUpload({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "general");

      const res = await fetch(
        `/api/portal/requests/${requestId}/attachments`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "업로드 실패");
      } else {
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 file:cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "업로드"}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      <p className="text-gray-400 text-xs mt-1">최대 10MB</p>
    </div>
  );
}
