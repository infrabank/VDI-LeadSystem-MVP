"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ContentForm from "../../components/ContentForm";

export default function EditContentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("content_items")
        .select("*")
        .eq("id", id)
        .single();
      setContent(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch(`/api/admin/content/${id}`, {
      method: "PUT",
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

  async function handlePublish() {
    const res = await fetch(`/api/admin/content/${id}/publish`, {
      method: "POST",
    });
    if (res.ok) {
      router.push("/admin/content");
      router.refresh();
    }
  }

  async function handleUnpublish() {
    if (!confirm("발행을 취소하시겠습니까? 공개 페이지에서 더 이상 보이지 않습니다.")) return;
    const res = await fetch(`/api/admin/content/${id}/publish`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/content");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/content/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/content");
      router.refresh();
    }
  }

  if (loading) {
    return <p className="text-gray-400">로딩 중...</p>;
  }

  if (!content) {
    return <p className="text-red-500">콘텐츠를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">콘텐츠 편집</h1>
        <div className="flex gap-2">
          {content.status === "draft" && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              발행
            </button>
          )}
          {content.status === "published" && (
            <button
              onClick={handleUnpublish}
              className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 text-sm border border-yellow-200"
            >
              발행 취소
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
          >
            삭제
          </button>
        </div>
      </div>
      <ContentForm
        initialData={content as {
          type: string;
          title: string;
          slug: string;
          excerpt: string;
          body_md: string;
          tags: string[];
          category: string;
          seo_title: string;
          seo_description: string;
          cover_image_url: string;
          faq_json: { q: string; a: string }[] | null;
        }}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
}
