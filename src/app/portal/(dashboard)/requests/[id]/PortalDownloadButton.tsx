"use client";

import { useState } from "react";

export default function PortalDownloadButton({
  requestId,
  storageKey,
  type = "report",
  label = "PDF 다운로드",
  small = false,
}: {
  requestId: string;
  storageKey: string;
  type?: "report" | "attachment";
  label?: string;
  small?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/portal/requests/${requestId}/download?type=${type}&key=${encodeURIComponent(storageKey)}`
      );
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } finally {
      setLoading(false);
    }
  }

  if (small) {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="text-blue-600 hover:underline text-sm disabled:opacity-50"
      >
        {loading ? "..." : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "준비 중..." : label}
    </button>
  );
}
