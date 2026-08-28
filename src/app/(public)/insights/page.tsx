import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";
import { getIndexableTags } from "@/lib/insights-tags";
import { ContentCard, type ContentListItem } from "./ContentCard";

const pageTitle = "Insights";
const pageDescription =
  "Citrix · Omnissa Horizon · Acronis Cyber Protect 운영장애·유지보수·복구검증 기술 가이드와 N²SF 환경 운영 노트를 정리합니다.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/insights" },
  openGraph: {
    title: `${pageTitle} | ${company.name}`,
    description: pageDescription,
    type: "website",
    url: `https://${company.domain}/insights`,
    siteName: company.name,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${company.name}`,
    description: pageDescription,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: `https://${company.domain}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Insights",
      item: `https://${company.domain}/insights`,
    },
  ],
};

/** 빈 값을 빼고 쿼리스트링을 만든다. `?q=&type=&page=2` 같은 중복 URL 방지. */
function pageHref(query: string, filterType: string, page: number): string {
  const sp = new URLSearchParams();
  if (query) sp.set("q", query);
  if (filterType) sp.set("type", filterType);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/insights?${qs}` : "/insights";
}

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;

  // 태그 필터는 /insights/tag/[slug]로 옮겼다. next.config의 redirects()로 처리하면
  // 원본 쿼리가 목적지에 그대로 붙어 /insights/tag/n2sf?tag=n2sf가 되므로 여기서 보낸다.
  if (params.tag) permanentRedirect(`/insights/tag/${encodeURIComponent(params.tag)}`);

  const query = params.q || "";
  const filterType = params.type || "";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 12;

  const supabase = await createClient();

  let contents: ContentListItem[] | null = null;
  let totalItems = 0;

  if (query) {
    // FTS search
    const { data } = await supabase.rpc("search_contents", {
      search_query: query,
      filter_type: filterType || null,
      filter_tag: null,
      page_num: page,
      page_size: pageSize,
    });
    contents = data;
  } else {
    // Regular listing
    let q = supabase
      .from("content_items")
      .select("id, type, title, slug, excerpt, cover_image_url, tags, category, published_at", {
        count: "exact",
      })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (filterType) q = q.eq("type", filterType);

    const { data, count: totalCount } = await q;
    contents = data;
    totalItems = totalCount ?? 0;
  }

  const indexableTags = await getIndexableTags();

  const types = [
    { value: "", label: "전체" },
    { value: "article", label: "Article" },
    { value: "case", label: "Case Study" },
    { value: "checklist", label: "Checklist" },
    { value: "comparison", label: "Comparison" },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Insights
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 kr-keep-all">
            VDI · 백업 운영 노트
          </h1>
          <p className="text-gray-500 text-base sm:text-lg kr-keep-all">
            현장에서 본 것을 가이드·체크리스트·사례로 정리합니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Search + Filter */}
        <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-8 md:mb-10" action="/insights" role="search">
          <div className="flex-1 relative">
            <label htmlFor="insights-q" className="sr-only">
              기술 콘텐츠 검색어
            </label>
            <svg aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="insights-q"
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Citrix · Horizon · UAG · FSLogix · Acronis · 복구검증으로 검색"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <label htmlFor="insights-type" className="sr-only">
              콘텐츠 유형 필터
            </label>
            <select
              id="insights-type"
              name="type"
              defaultValue={filterType}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
            >
              검색
            </button>
          </div>
        </form>

        {indexableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
            {indexableTags.map((tag) => (
              <Link
                key={tag}
                href={`/insights/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center text-xs px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <svg aria-hidden="true" className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 font-medium">
              {query ? "검색 결과가 없습니다." : "아직 발행된 콘텐츠가 없습니다."}
            </p>
            {query && (
              <Link href="/insights" className="text-sm text-blue-600 hover:underline">
                전체 콘텐츠 보기
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {(totalItems > pageSize || page > 1) && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-10 md:mt-12">
            {page > 1 ? (
              <Link
                href={pageHref(query, filterType, page - 1)}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-600 transition-colors"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </Link>
            ) : (
              <div className="w-[64px] sm:w-[88px]" />
            )}
            <span className="text-xs sm:text-sm text-gray-500 text-center">
              {page} / {Math.max(1, Math.ceil(totalItems / pageSize))} 페이지
              <span className="text-gray-600 ml-1 hidden sm:inline">(총 {totalItems}건)</span>
            </span>
            {contents && contents.length === pageSize ? (
              <Link
                href={pageHref(query, filterType, page + 1)}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-600 transition-colors"
              >
                다음
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="w-[64px] sm:w-[88px]" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
