import Link from "next/link";
import type { Metadata } from "next";
import {
  publishedTemplates,
  TEMPLATE_CATEGORY_LABEL,
  type TemplateCategory,
} from "@/lib/templates";
import { company } from "@/lib/site-config";

const pageTitle = "산출물 템플릿";
const pageDescription =
  "공공·연구·금융 기관의 N²SF 전환·VDI 재정의·MFA·복구검증 실무에서 바로 쓰는 체크리스트·매트릭스·산출물 프레임워크. 모두 무료 PDF로 즉시 다운로드.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/resources/templates" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: `https://${company.domain}/resources/templates`,
    siteName: company.name,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${company.name}`,
    description: pageDescription,
  },
};

const categoryAccent: Record<TemplateCategory, { border: string; bg: string; text: string }> = {
  checklist: { border: "#7c3aed", bg: "bg-purple-50", text: "text-purple-700" },
  matrix: { border: "#2563eb", bg: "bg-blue-50", text: "text-blue-700" },
  framework: { border: "#059669", bg: "bg-emerald-50", text: "text-emerald-700" },
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
      name: "Resources",
      item: `https://${company.domain}/resources/templates`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: pageTitle,
      item: `https://${company.domain}/resources/templates`,
    },
  ],
};

export default function ResourcesTemplatesPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Resources · Templates
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            현장에서 바로 쓰는 산출물 템플릿
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            분석서·체크리스트·의사결정 매트릭스를 무료 PDF로 다운로드하세요.
            기관 환경에 맞춰 그대로 채워 사용하거나, 내부 회의·임원 보고 자료로 활용 가능합니다.
          </p>
        </div>
      </section>

      {/* Templates grouped by category */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {publishedTemplates.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            아직 발행된 템플릿이 없습니다.
          </div>
        ) : (
          (() => {
            // 카테고리 정렬 순서 — 가치 기준 (자가 점검 → 의사결정 → 산출물 양식)
            const categoryOrder: TemplateCategory[] = ["checklist", "matrix", "framework"];
            const grouped: Record<TemplateCategory, typeof publishedTemplates> = {
              checklist: [],
              matrix: [],
              framework: [],
            };
            for (const t of publishedTemplates) grouped[t.category].push(t);

            return (
              <div className="space-y-12 md:space-y-16">
                {categoryOrder
                  .filter((c) => grouped[c].length > 0)
                  .map((category) => {
                    const items = grouped[category];
                    const accent = categoryAccent[category];
                    return (
                      <div key={category}>
                        <div className="flex items-center gap-3 mb-5 md:mb-6">
                          <span
                            className="inline-block w-1 h-7 rounded"
                            style={{ background: accent.border }}
                          ></span>
                          <h2 className={`text-lg sm:text-xl font-bold ${accent.text} tracking-tight`}>
                            {TEMPLATE_CATEGORY_LABEL[category]}
                          </h2>
                          <span className="text-xs text-gray-400">{items.length}건</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                          {items.map((t) => (
                            <article
                              key={t.slug}
                              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300 flex flex-col"
                              style={{ borderTop: `4px solid ${accent.border}` }}
                            >
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 kr-keep-all">
                                {t.title}
                              </h3>
                              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all flex-1 mb-4">
                                {t.summary}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                                <span>약 {t.pages}쪽</span>
                                <span>최근 갱신 {t.updatedAt}</span>
                              </div>
                              <a
                                href={`/api/templates/${t.slug}/download`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: accent.border }}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                PDF 다운로드
                              </a>
                            </article>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })()
        )}
      </section>

      {/* Use note */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">
            템플릿 사용 안내
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed kr-keep-all">
            <li>
              <span className="font-semibold text-gray-900">1차 자가 점검 용도.</span>{" "}
              본 템플릿은 정식 N²SF 정렬·보안성 검토 산출물이 아닙니다. 발주·심의 산출물은
              KISA·국정원 지침과 기관 환경에 맞춰 별도 작성합니다.
            </li>
            <li>
              <span className="font-semibold text-gray-900">자유 사용 가능.</span>{" "}
              내부 회의·임원 보고·RFP 초안 작성에 자유롭게 활용하세요. 외부 재배포 시
              출처(${company.legalName}) 표기를 부탁드립니다.
            </li>
            <li>
              <span className="font-semibold text-gray-900">현장 갱신.</span>{" "}
              템플릿은 실제 사전진단 프로젝트 결과로 정기 갱신됩니다 — 더 나은 항목·표현이
              나올 때마다 버전 업데이트.
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 kr-keep-all">
            템플릿을 채우는 인터뷰가 필요하신가요?
          </h2>
          <p className="text-sm text-blue-100 mb-6 max-w-xl mx-auto kr-keep-all">
            기관 환경 인터뷰 후 마이로켓 1차 진단 산출물로 정리해드립니다.
            범위·일정·비용은 분석서 §13의 참고 단가 기준으로 산정합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/practices#pricing"
              className="inline-block px-6 sm:px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              참고 단가 보기
            </Link>
            <a
              href="mailto:jhw@mlkit.co.kr"
              className="inline-block px-6 sm:px-8 py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 font-semibold text-sm backdrop-blur-sm transition-all"
            >
              대표에게 직접 메일
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
