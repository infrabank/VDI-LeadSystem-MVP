import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown } from "@/lib/markdown";
import { company } from "@/lib/site-config";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = `https://${company.domain}`;

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

/**
 * 콘텐츠 주제별 CTA 분기 (§18 검색 의도-전환 연결).
 * 제목·태그·카테고리 키워드로 Horizon / Citrix / 백업 / 유지보수를 구분하고,
 * 해당하지 않으면 범용 기술지원 CTA를 사용한다.
 */
function pickInsightCta(title: string, tags: string[], category: string | null) {
  const hay = `${title} ${tags.join(" ")} ${category || ""}`.toLowerCase();
  if (/horizon|uag|omnissa/.test(hay)) {
    return {
      heading: "운영 중인 Horizon 환경에 비슷한 증상이 있나요?",
      sub: "Connection Server·UAG·인증서·vSphere 연계까지 전체 흐름 기준으로 원인을 구분해 드립니다. 제품 버전·증상만 보내주세요.",
      primaryHref: "/contact?type=vdi&source=insight-horizon&subject=Horizon 환경 검토 요청",
      primaryLabel: "현재 Horizon 환경 검토 요청",
      secondaryHref: "/services/vdi-support",
      secondaryLabel: "VDI 기술지원 보기",
    };
  }
  if (/citrix|vda|netscaler|스토어프론트|storefront/.test(hay)) {
    return {
      heading: "Citrix 환경에서 비슷한 장애를 겪고 있나요?",
      sub: "VDA 등록, Gateway·인증서, 라이선스, 세션 장애의 원인 구간을 구분해 드립니다. 장애보고서 작성도 가능합니다.",
      primaryHref: "/contact?type=vdi&source=insight-citrix&subject=Citrix 장애 문의",
      primaryLabel: "Citrix 장애 원인 상담",
      secondaryHref: "/services/vdi-support",
      secondaryLabel: "VDI 기술지원 보기",
    };
  }
  if (/백업|복구|랜섬|acronis|vinchin|backup/.test(hay)) {
    return {
      heading: "지금 백업, 실제로 복구되는지 확인해 보셨나요?",
      sub: "백업 정책·실패 이력·복구 가능성을 점검하고 결과를 보고서로 정리해 드립니다.",
      primaryHref: "/contact?type=maintenance&source=insight-backup&subject=백업 복구 가능성 점검",
      primaryLabel: "백업 복구 가능성 점검",
      secondaryHref: "/services/acronis-backup",
      secondaryLabel: "백업·복구검증 서비스 보기",
    };
  }
  if (/유지보수|전산|서버|네트워크|nas/.test(hay)) {
    return {
      heading: "전산 담당 공백, 어디까지 맡길 수 있는지 확인해 보세요",
      sub: "PC·서버·네트워크·백업 현황만 알려주시면 월간 점검 범위와 방향을 회신합니다.",
      primaryHref: "/contact?type=maintenance&source=insight-maintenance&subject=월간 유지보수 상담",
      primaryLabel: "월간 유지보수 상담",
      secondaryHref: "/services/it-maintenance",
      secondaryLabel: "유지보수 서비스 보기",
    };
  }
  return {
    heading: "운영 중인 VDI · 백업 환경에 비슷한 이슈가 있나요?",
    sub: "제품명·버전·증상만 보내주시면 1차 원인 구분을 도와드립니다. Citrix · Omnissa Horizon · Acronis · Vinchin 환경을 지원합니다.",
    primaryHref: "/contact?source=insight-cta",
    primaryLabel: "기술지원 문의하기",
    secondaryHref: "/services/vdi-support",
    secondaryLabel: "VDI 기술지원 보기",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("title, seo_title, seo_description, excerpt, cover_image_url, published_at, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Not Found" };

  const title = data.seo_title || data.title;
  const description = data.seo_description || data.excerpt || "";
  const url = `${siteUrl}/insights/${slug}`;
  const image = data.cover_image_url || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: company.name,
      locale: "ko_KR",
      ...(image ? { images: [{ url: image }] } : {}),
      ...(data.published_at ? { publishedTime: data.published_at } : {}),
      ...(data.updated_at ? { modifiedTime: data.updated_at } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
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
  const articleUrl = `${siteUrl}/insights/${slug}`;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.excerpt || "",
    datePublished: content.published_at,
    dateModified: content.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    url: articleUrl,
    ...(content.cover_image_url ? { image: [content.cover_image_url] } : {}),
    publisher: {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#org`,
      name: company.legalName,
    },
    author: {
      "@type": "Person",
      name: "제현우",
      jobTitle: "대표 · 수석 기술지원 엔지니어",
      url: `${siteUrl}/about`,
      worksFor: { "@id": `${siteUrl}/#org` },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights` },
      { "@type": "ListItem", position: 3, name: content.title, item: articleUrl },
    ],
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
    <article className="reading-prose mx-auto px-4 sm:px-6">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Header area with gradient background */}
      <div className="bg-gradient-to-b from-gray-50 to-white -mx-4 sm:-mx-6 px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2 text-sm mb-3 sm:mb-4">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight kr-keep-all">{content.title}</h1>
        {content.excerpt && (
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed kr-keep-all">{content.excerpt}</p>
        )}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {content.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/insights?tag=${tag}`}
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
        // eslint-disable-next-line @next/next/no-img-element
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
        <section className="mt-10 sm:mt-14 border-t border-gray-100 pt-8 sm:pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">자주 묻는 질문</h2>
          <div className="space-y-3">
            {content.faq_json.map((faq: { q: string; a: string }, i: number) => (
              <details key={i} className="group border-l-4 border-l-blue-500 border border-gray-200 rounded-r-lg bg-white hover:bg-gray-50 transition-colors overflow-hidden">
                <summary className="flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 font-semibold text-sm sm:text-base text-gray-900 cursor-pointer select-none kr-keep-all">
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
                <p className="px-4 sm:px-5 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-3 kr-keep-all">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA — 콘텐츠 주제(tags·제목)에 맞춰 분기 */}
      {(() => {
        const cta = pickInsightCta(content.title, content.tags || [], content.category);
        return (
          <div className="mt-10 sm:mt-14 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)", border: "1px solid #bfdbfe" }}>
            <div className="p-6 sm:p-8 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 kr-keep-all">
                {cta.heading}
              </h3>
              <p className="text-gray-600 mb-5 sm:mb-6 max-w-md mx-auto text-sm leading-relaxed kr-keep-all">
                {cta.sub}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Link
                  href={cta.primaryHref}
                  className="inline-block px-6 sm:px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm transition-all hover:-translate-y-0.5"
                >
                  {cta.primaryLabel}
                </Link>
                <Link
                  href={cta.secondaryHref}
                  className="inline-block px-6 sm:px-7 py-3 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm transition-all"
                >
                  {cta.secondaryLabel}
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-gray-500 kr-keep-all">
                문의 후 진행: 환경·증상 확인 → 지원 가능 범위 회신(1영업일) → 원격/방문 진단 → 조치·결과 보고
              </p>
            </div>
          </div>
        );
      })()}

      {/* Related Content */}
      {related.length > 0 && (
        <section className="mt-10 sm:mt-14 border-t border-gray-100 pt-8 sm:pt-10 pb-8 sm:pb-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">관련 콘텐츠</h2>
          <div className="grid gap-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/insights/${item.slug}`}
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
