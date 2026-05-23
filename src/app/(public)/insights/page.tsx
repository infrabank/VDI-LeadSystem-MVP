import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";

interface ContentListItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  category: string | null;
  published_at: string | null;
  rank?: number;
}

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

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const filterType = params.type || "";
  const filterTag = params.tag || "";
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
      filter_tag: filterTag || null,
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
    if (filterTag) q = q.contains("tags", [filterTag]);

    const { data, count: totalCount } = await q;
    contents = data;
    totalItems = totalCount ?? 0;
  }

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
        <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-8 md:mb-10" action="/insights">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Citrix · Horizon · UAG · FSLogix · Acronis · 복구검증으로 검색"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <select
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

        {/* Content Grid */}
        {contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {contents.map((item) => (
              <Link
                key={item.id}
                href={`/insights/${item.slug}`}
                className="card-hover group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 border-l-2 border-l-blue-600"
              >
                {item.cover_image_url && (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeBadge[item.type] || "bg-gray-100 text-gray-600"}`}>
                      {typeLabel[item.type] || item.type}
                    </span>
                    {item.category && (
                      <span className="text-xs text-gray-400">{item.category}</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors kr-keep-all">{item.title}</h2>
                  {item.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed kr-keep-all">{item.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    {item.published_at ? (
                      <p className="text-xs text-gray-400">
                        {new Date(item.published_at).toLocaleDateString("ko-KR")}
                      </p>
                    ) : <span />}
                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 font-medium">
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
                href={`/insights?q=${query}&type=${filterType}&page=${page - 1}`}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </Link>
            ) : (
              <div className="w-[64px] sm:w-[88px]" />
            )}
            <span className="text-xs sm:text-sm text-gray-500 text-center">
              {page} / {Math.max(1, Math.ceil(totalItems / pageSize))} 페이지
              <span className="text-gray-400 ml-1 hidden sm:inline">(총 {totalItems}건)</span>
            </span>
            {contents && contents.length === pageSize ? (
              <Link
                href={`/insights?q=${query}&type=${filterType}&page=${page + 1}`}
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-600 transition-colors"
              >
                다음
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
