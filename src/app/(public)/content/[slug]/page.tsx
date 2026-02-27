import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const typeBadge: Record<string, string> = {
  article: "bg-blue-100 text-blue-700",
  case: "bg-emerald-100 text-emerald-700",
  checklist: "bg-violet-100 text-violet-700",
  comparison: "bg-orange-100 text-orange-700",
};

const typeLabel: Record<string, string> = {
  article: "Article",
  case: "Case Study",
  checklist: "Checklist",
  comparison: "Comparison",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("title, seo_title, seo_description, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Not Found" };

  return {
    title: data.seo_title || data.title,
    description: data.seo_description || data.excerpt || "",
  };
}

export default async function ContentDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch main content
  const { data: content } = await supabase
    .from("content_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!content) notFound();

  // Render markdown
  const htmlContent = content.body_md
    ? await renderMarkdown(content.body_md)
    : "";

  // Fetch related content by tags
  let related: typeof content[] = [];
  if (content.tags && content.tags.length > 0) {
    const { data } = await supabase
      .from("content_items")
      .select("id, title, slug, type, excerpt, published_at")
      .eq("status", "published")
      .neq("id", content.id)
      .overlaps("tags", content.tags)
      .order("published_at", { ascending: false })
      .limit(3);
    related = data || [];
  }

  // JSON-LD structured data
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.excerpt || "",
    datePublished: content.published_at,
    dateModified: content.updated_at,
  };

  // Add FAQPage if faq_json exists
  const faqJsonLd =
    content.faq_json && Array.isArray(content.faq_json) && content.faq_json.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq_json.map(
            (faq: { q: string; a: string }) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })
          ),
        }
      : null;

  return (
    <article className="max-w-3xl mx-auto px-4">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Header area with gradient background */}
      <div className="bg-gradient-to-b from-gray-50 to-white -mx-4 px-4 pt-10 pb-8 mb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className={`px-2.5 py-0.5 rounded-full font-medium text-xs ${typeBadge[content.type] || "bg-gray-100 text-gray-600"}`}>
            {typeLabel[content.type] || content.type}
          </span>
          {content.category && (
            <span className="text-gray-400 text-xs">{content.category}</span>
          )}
          {content.updated_at && (
            <span className="text-gray-400 text-xs">
              최종 업데이트: {new Date(content.updated_at).toLocaleDateString("ko-KR")}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{content.title}</h1>
        {content.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed">{content.excerpt}</p>
        )}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {content.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/content?tag=${tag}`}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      {content.cover_image_url && (
        <img
          src={content.cover_image_url}
          alt={content.title}
          className="w-full rounded-xl shadow-lg mb-10 object-cover"
        />
      )}

      {/* Body */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* FAQ Section */}
      {content.faq_json && Array.isArray(content.faq_json) && content.faq_json.length > 0 && (
        <section className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-3">
            {content.faq_json.map((faq: { q: string; a: string }, i: number) => (
              <details key={i} className="group border-l-4 border-l-blue-500 border border-gray-200 rounded-r-lg bg-white hover:bg-gray-50 transition-colors overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-900 cursor-pointer select-none">
                  <span>{faq.q}</span>
                  <svg
                    className="faq-chevron w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-14 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)", border: "1px solid #bfdbfe" }}>
        <div className="p-8 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            VDI 환경의 리스크가 궁금하신가요?
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
            무료 진단 도구로 마이그레이션/운영 리스크를 확인해보세요.
          </p>
          <Link
            href="/tools/risk-assessment"
            className="inline-block px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm transition-all hover:-translate-y-0.5"
          >
            무료 리스크 진단
          </Link>
        </div>
      </div>

      {/* Related Content */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-gray-100 pt-10 pb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">관련 콘텐츠</h2>
          <div className="grid gap-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[item.type] || "bg-gray-100 text-gray-600"}`}>
                      {typeLabel[item.type] || item.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
