import Link from "next/link";
import { company, practicesList, partnerships, customers } from "@/lib/site-config";
import { PartnerBadge } from "./PartnerBadge";
import { CustomerShowcase } from "./CustomerShowcase";

const customerCount = customers.length;
const publicCount = customers.filter((c) => c.category !== "private").length;

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 text-center">
          <p className="inline-flex items-center gap-2 text-blue-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
            {company.tagline}
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6 leading-tight tracking-tight kr-keep-all">
            보안 워크스페이스와<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>데이터 보호, 한 팀이 책임집니다
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            공공·금융을 위한 N²SF·Zero Trust·VDI 자문 + Acronis 기반 백업·DR·사이버복원력
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/practices"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              Practices 둘러보기
            </Link>
            <Link
              href="/tools/risk-assessment"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-500/30 border border-blue-400/40 text-white rounded-lg hover:bg-blue-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              N²SF 정렬 진단 시작
            </Link>
          </div>
        </div>
      </section>

      {/* Two Practices */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-24">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Our Practices
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          기업 보안의 두 축
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          접근·통제와 데이터 보호 — 규제 적합과 운영 연속성을 동시에 다룹니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 md:gap-8">
          {practicesList.map((p) => {
            const isBlue = p.primaryColor === "blue";
            return (
              <Link
                key={p.id}
                href={p.href}
                className="card-hover group bg-white rounded-xl border border-gray-200 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                style={{ borderTop: `4px solid ${isBlue ? "#2563eb" : "#059669"}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isBlue ? "text-blue-600" : "text-emerald-600"
                    }`}
                  >
                    {p.brand}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 kr-keep-all">{p.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-4 kr-keep-all">{p.tagline}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 kr-keep-all">{p.description}</p>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    isBlue ? "text-blue-600" : "text-emerald-600"
                  } group-hover:translate-x-0.5 transition-transform`}
                >
                  자세히 보기 →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-center">
            {[
              { stat: `${customerCount}+`, label: "운영 고객사", desc: `공공·연구기관 ${publicCount}곳 포함` },
              { stat: "274개", label: "보안통제 매핑", desc: "N²SF 1.0 정렬 진단" },
              { stat: "24x7", label: "MSP 운영", desc: "백업·복구 검증" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">{item.stat}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Quick Access
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-14">
          바로가기
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {/* Insights */}
          <Link
            href="/insights"
            className="group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Insights</h3>
            <p className="text-xs text-gray-500 kr-keep-all">기술 가이드·체크리스트·사례</p>
          </Link>

          {/* Tools */}
          <Link
            href="/tools"
            className="group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Tools</h3>
            <p className="text-xs text-gray-500 kr-keep-all">진단·계산 도구 4종</p>
          </Link>

          {/* About */}
          <Link
            href="/about"
            className="group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">About {company.name}</h3>
            <p className="text-xs text-gray-500 kr-keep-all">미션·인증·파트너십</p>
          </Link>
        </div>
      </section>

      {/* Customers trust strip */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Trusted By
          </p>
          <p className="text-center text-sm sm:text-base font-semibold text-gray-700 mb-6 md:mb-8 kr-keep-all">
            공공·연구기관 {publicCount}곳을 포함한 {customerCount}개 기관이 Myloket을 신뢰합니다
          </p>
          <CustomerShowcase variant="compact" />
          <div className="text-center mt-6 md:mt-8">
            <Link href="/about#customers" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
              전체 고객사 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Partnerships strip */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
            Technology Partnerships
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
            {partnerships.map((p) => (
              <PartnerBadge key={p.name} partner={p} variant="strip" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Free Assessment
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            현재 보안 워크스페이스 성숙도, 7분이면 확인
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            274개 보안통제 기준 N²SF 정렬 진단으로 우리 기관 현황을 파악하고
            맞춤 리포트를 받아보세요.
          </p>
          <Link
            href="/tools/risk-assessment"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            N²SF 정렬 진단 시작
          </Link>
        </div>
      </section>
    </div>
  );
}
