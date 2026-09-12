import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";
import { ContentCard, type ContentListItem } from "../insights/ContentCard";

const pageDescription =
  "Omnissa Horizon Manual VDI를 운영하며 실제 환경에서 겪고 고친 일을 기록합니다. Horizon REST 429와 페이지 처리, 마스터에 구운 보안 에이전트와 sysprep 실패 같은 현장 기록입니다.";

export const metadata: Metadata = {
  title: "기술 노트",
  description: pageDescription,
  alternates: { canonical: "/tech-notes" },
};

/* 계획된 첫 글. 발행되면 자동으로 목록에 나오고 이 배열은 지운다. */
const plannedTitles = [
  "Horizon REST 429와 페이지 처리",
  "마스터에 구운 보안 에이전트와 sysprep 실패",
];

export default async function TechNotesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("id, type, title, slug, excerpt, cover_image_url, tags, category, published_at")
    .eq("status", "published")
    .contains("tags", ["tech-note"])
    .order("published_at", { ascending: false })
    .limit(24);
  const notes = (data as ContentListItem[]) || [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `https://${company.domain}/` },
      { "@type": "ListItem", position: 2, name: "기술 노트", item: `https://${company.domain}/tech-notes` },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Tech Notes
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            Manual VDI 운영 현장 기록
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed kr-keep-all">
            실제 환경에서 겪고 고친 일을 적습니다. 기능 소개가 아니라 사고와 해결 기록이며,
            고객명과 환경 값은 익명으로 처리합니다.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {notes.map((n) => (
              <ContentCard key={n.id} item={n} />
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12">
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">준비 중</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 kr-keep-all">
                첫 글을 준비하고 있습니다
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 kr-keep-all">
                월 1편을 목표로 씁니다. 주제는 VDIOps를 만들고 설치하며 실제로 겪은 일에서 고릅니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">예정 주제</p>
                <ul className="text-sm text-gray-700 space-y-1.5 kr-keep-all">
                  {plannedTitles.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                  <li>· 정적 IP 중복 감지와 포털 밖 VM이 쥔 주소</li>
                  <li>· Manual 풀 VM 교체 절차</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products/vdiops"
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-semibold text-center"
                >
                  VDIOps 제품 소개
                </Link>
                <Link
                  href="/insights"
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold text-center"
                >
                  Insights 전체 보기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
