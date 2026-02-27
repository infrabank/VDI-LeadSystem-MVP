"use client";

import { useState } from "react";

interface ContentFormProps {
  initialData?: {
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
  };
  onSubmit: (data: Record<string, unknown>) => void;
  saving: boolean;
}

export default function ContentForm({
  initialData,
  onSubmit,
  saving,
}: ContentFormProps) {
  const [type, setType] = useState(initialData?.type || "article");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [bodyMd, setBodyMd] = useState(initialData?.body_md || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description || ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image_url || ""
  );
  const [uploading, setUploading] = useState(false);
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>(
    initialData?.faq_json || []
  );

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!initialData) {
      setSlug(generateSlug(value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      setCoverImageUrl(url);
    } else {
      alert("이미지 업로드에 실패했습니다.");
    }
    setUploading(false);
  }

  function addFaqItem() {
    setFaqItems([...faqItems, { q: "", a: "" }]);
  }

  function removeFaqItem(index: number) {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  }

  function updateFaqItem(index: number, field: "q" | "a", value: string) {
    const updated = [...faqItems];
    updated[index] = { ...updated[index], [field]: value };
    setFaqItems(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      type,
      title,
      slug,
      excerpt,
      body_md: bodyMd,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      cover_image_url: coverImageUrl || null,
      faq_json: faqItems.length > 0 ? faqItems.filter(item => item.q.trim() && item.a.trim()) : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="article">Article</option>
              <option value="case">Case Study</option>
              <option value="checklist">Checklist</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="예: migration, security"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">요약 (Excerpt)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 (Markdown)</label>
          <textarea
            value={bodyMd}
            onChange={(e) => setBodyMd(e.target.value)}
            rows={16}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표 구분)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="vdi, migration, citrix"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">커버 이미지</label>
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="cover"
              className="mb-2 max-h-40 rounded border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-gray-400 mt-1">업로드 중...</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-medium text-gray-900">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO 제목</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO 설명</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-900">FAQ</h2>
          <button
            type="button"
            onClick={addFaqItem}
            className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            + 항목 추가
          </button>
        </div>
        {faqItems.length === 0 && (
          <p className="text-sm text-gray-400">FAQ 항목이 없습니다. 위 버튼을 눌러 추가하세요.</p>
        )}
        {faqItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">FAQ #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeFaqItem(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
              <input
                type="text"
                value={item.q}
                onChange={(e) => updateFaqItem(index, "q", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="자주 묻는 질문을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
              <textarea
                value={item.a}
                onChange={(e) => updateFaqItem(index, "a", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="답변을 입력하세요"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
