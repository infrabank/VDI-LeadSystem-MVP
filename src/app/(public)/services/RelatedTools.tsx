import Link from "next/link";

export interface RelatedTool {
  href: string;
  title: string;
  desc: string;
  duration: string;
}

/**
 * 서비스 페이지 하단 — 관련 무료 진단 도구 안내 스트립.
 * 문의 CTA 직전에 배치해 "상담 전 자가진단" 동선을 제공한다.
 */
export function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  return (
    <section className="border-b border-gray-100 bg-blue-50/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
          Free Diagnostic Tools
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 kr-keep-all">
          상담 전에 현재 상태를 먼저 진단해 보세요
        </h2>
        <p className="text-sm text-gray-600 mb-8 kr-keep-all">
          무료 자가진단 후 웹 리포트와 PDF를 바로 받을 수 있습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-700 kr-keep-all">
                  {t.title}
                </h3>
                <span className="flex-shrink-0 text-[11px] font-medium text-gray-400 mt-0.5">
                  {t.duration}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed kr-keep-all">
                {t.desc}
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                무료 진단 시작 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
