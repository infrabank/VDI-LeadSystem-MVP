import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <p className="inline-flex items-center gap-2 text-blue-200 font-semibold text-sm mb-5 tracking-widest uppercase">
            <span className="w-4 h-px bg-blue-300 inline-block"></span>
            VDI Migration &amp; Operations
            <span className="w-4 h-px bg-blue-300 inline-block"></span>
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            VDI 전문성을<br className="hidden md:block" />
            구조화된 기술로 증명합니다
          </h1>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            VDI 마이그레이션과 운영에 관한 체크리스트, 케이스 스터디, 리스크 진단
            도구를 통해 실질적인 기술 인사이트를 제공합니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/tools/risk-assessment"
              className="px-8 py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              무료 리스크 진단
            </Link>
            <Link
              href="/tools/roi-calculator"
              className="px-8 py-3.5 bg-green-500/80 border border-green-400/40 text-white rounded-lg hover:bg-green-500/90 font-semibold text-base backdrop-blur-sm transition-all"
            >
              ROI 계산기
            </Link>
            <Link
              href="/content"
              className="px-8 py-3.5 bg-blue-500/30 border border-blue-400/40 text-white rounded-lg hover:bg-blue-500/40 font-semibold text-base backdrop-blur-sm transition-all"
            >
              콘텐츠 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "500+", label: "진단 완료", desc: "기업 환경 리스크 진단" },
              { stat: "98%", label: "만족도", desc: "고객 기술 만족도 기준" },
              { stat: "50+", label: "기업 활용", desc: "국내 기업 도입 사례" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="text-3xl font-bold text-blue-600 tracking-tight">{item.stat}</p>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-blue-600 font-semibold text-sm text-center mb-3 tracking-widest uppercase">What We Offer</p>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
          어떤 것을 제공하나요?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "기술 콘텐츠",
              desc: "체크리스트, 비교 분석, 케이스 스터디 등 검증된 VDI 기술 자료를 제공합니다.",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              color: "#2563eb",
            },
            {
              title: "리스크 진단",
              desc: "설문 기반 자동 스코어링으로 마이그레이션/운영 리스크를 즉시 확인할 수 있습니다.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              color: "#2563eb",
            },
            {
              title: "ROI 계산기",
              desc: "VDI 장애 비용과 개선 투자 ROI를 산정하여 경영진 보고용 PDF를 제공합니다.",
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "#059669",
            },
            {
              title: "맞춤 리포트",
              desc: "진단 결과를 웹 리포트와 PDF로 제공하여 내부 공유와 의사결정에 활용할 수 있습니다.",
              icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "#2563eb",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="card-hover group p-7 bg-white rounded-xl shadow-sm"
              style={{ border: "1px solid #e5e7eb", borderTop: `4px solid ${feature.color}` }}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2.5">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-1/2 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-4">Free Assessment</p>
          <h2 className="text-3xl font-bold text-white mb-4">
            VDI 환경의 리스크가 궁금하신가요?
          </h2>
          <p className="text-blue-100 mb-10 max-w-lg mx-auto leading-relaxed">
            5분이면 끝나는 무료 진단으로 마이그레이션/운영 리스크를 확인하고
            맞춤 리포트를 받아보세요.
          </p>
          <Link
            href="/tools/risk-assessment"
            className="inline-block px-10 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            무료 리스크 진단 시작
          </Link>
        </div>
      </section>
    </div>
  );
}
