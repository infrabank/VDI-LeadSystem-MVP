import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";
import { ContentCard, type ContentListItem } from "../../ContentCard";
import { getTagCounts, TAG_MIN_ARTICLES } from "@/lib/insights-tags";

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadTag(slug: string) {
  const tag = decodeURIComponent(slug);
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("id, type, title, slug, excerpt, cover_image_url, tags, category, published_at")
    .eq("status", "published")
    .contains("tags", [tag])
    .order("published_at", { ascending: false });

  return { tag, items: (data || []) as ContentListItem[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { tag, items } = await loadTag(slug);
  if (items.length === 0) return {};

  const title = `#${tag} 자료 ${items.length}건`;
  const description =
    `${tag} 태그가 붙은 Myloket Insights ${items.length}건입니다. ` +
    items
      .slice(0, 3)
      .map((i) => i.title)
      .join(" · ");

  return {
    title,
    description,
    alternates: { canonical: `/insights/tag/${encodeURIComponent(tag)}` },
    // 글이 적은 태그는 목록이 서로 비슷해져 중복으로 잡히므로 색인에서 뺀다.
    // follow는 유지해 개별 글로 가는 링크는 살린다.
    robots: items.length >= TAG_MIN_ARTICLES ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      type: "website",
      url: `https://${company.domain}/insights/tag/${encodeURIComponent(tag)}`,
      siteName: company.name,
      locale: "ko_KR",
    },
  };
}

export default async function InsightsTagPage({ params }: Props) {
  const { slug } = await params;
  const { tag, items } = await loadTag(slug);
  if (items.length === 0) notFound();

  const counts = await getTagCounts();
  const siblingTags = [...counts.entries()]
    .filter(([t, n]) => t !== tag && n >= TAG_MIN_ARTICLES)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `https://${company.domain}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `https://${company.domain}/insights` },
      {
        "@type": "ListItem",
        position: 3,
        name: `#${tag}`,
        item: `https://${company.domain}/insights/tag/${encodeURIComponent(tag)}`,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link
            href="/insights"
            className="text-blue-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase inline-block hover:underline"
          >
            ← Insights
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 kr-keep-all">
            #{tag}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg kr-keep-all">
            {tag} 태그가 붙은 자료 {items.length}건입니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {siblingTags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">다른 주제</h2>
            <div className="flex flex-wrap gap-2">
              {siblingTags.map(([t, n]) => (
                <Link
                  key={t}
                  href={`/insights/tag/${encodeURIComponent(t)}`}
                  className="inline-flex items-center text-xs px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors font-medium"
                >
                  #{t} <span className="text-blue-400">{n}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
