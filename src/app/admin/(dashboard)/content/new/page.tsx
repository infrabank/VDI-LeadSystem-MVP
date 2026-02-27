"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ContentForm from "../components/ContentForm";

export default function NewContentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/content");
      router.refresh();
    } else {
      alert("저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 콘텐츠 작성</h1>
      <ContentForm onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
