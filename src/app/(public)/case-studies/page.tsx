import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: "/case-studies" },
  title: "고객사례·수행 경험",
  description: `${company.name}의 공공·연구기관·민간 기업 VDI 구축·운영·유지보수 지원 사례 — Citrix · Omnissa Horizon · Acronis Cyber Protect 운영장애·복구검증 실수행 경험.`,
};

interface CaseRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  category: string | null;
  published_at: string | null;
}

export default async function CaseStudiesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("content_items")
    .select("id, slug, title, excerpt, cover_image_url, tags, category, published_at")
    .eq("type", "case")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);

  const cases: CaseRow[] = (data as CaseRow[]) || [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Case Studies
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            VDI · 백업 운영 사례
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            현장에서 다룬 경험입니다. 기관명은 익명으로, 환경과 결과는 사실대로 적습니다.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {cases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  href={`/insights/${c.slug}`}
                  className="card-hover group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200"
                >
                  {c.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.cover_image_url}
                      alt={c.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <svg aria-hidden="true"
                        className="w-10 h-10 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 mb-2">
                      Case Study
                    </span>
                    <h2 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors kr-keep-all">
                      {c.title}
                    </h2>
                    {c.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed kr-keep-all">
                        {c.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-5">
          <svg aria-hidden="true"
            className="w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">Coming Soon</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 kr-keep-all">
          사례 콘텐츠 준비 중
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 max-w-xl mx-auto kr-keep-all">
          공공·연구기관과 민간 기업의 솔루션 딜리버리 사례를 정리하고 있습니다. 외부 공개 동의를 받은 사례부터 순차적으로 공개됩니다.
        </p>
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left max-w-md mx-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">예정 사례 5종</p>
          <ul className="text-sm text-gray-700 space-y-1.5 kr-keep-all">
            <li>· 공공기관 VDI 구축·운영·유지보수 안정화 (Horizon/UAG/인증서/외부접속)</li>
            <li>· 정부출연연구기관 VDI 역할 재정의 (유지/축소/전환 판단)</li>
            <li>· 망분리 환경 전환 사전진단 (업무군·사용자군·접속 경로)</li>
            <li>· MFA 적용 위치 설계 (VDI·관리자·외부 협력사·예외 계정)</li>
            <li>· 백업·DR 복구검증 (RTO/RPO·월간 복구 테스트)</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/about#customers"
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
            전체 고객사 보기
          </Link>
          <Link
            href="/insights"
            className="px-6 py-2.5 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 text-sm font-semibold transition-colors"
          >
            관련 인사이트 콘텐츠
          </Link>
        </div>
      </div>
    </div>
  );
}
