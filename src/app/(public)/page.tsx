import Link from "next/link";
import { company, practicesList, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "./PartnerBadge";
import { CustomerShowcase } from "./CustomerShowcase";

const practiceColorMap: Record<string, { border: string; text: string }> = {
  blue: { border: "#2563eb", text: "text-blue-600" },
  indigo: { border: "#4f46e5", text: "text-indigo-600" },
  emerald: { border: "#059669", text: "text-emerald-600" },
  purple: { border: "#7c3aed", text: "text-purple-600" },
};

const bundleScenarios = [
  {
    title: "공공기관 망분리 완화 패키지",
    desc: "Citrix VDI + 라온시큐어 OneAccess(GPKI) + Acronis 백업 — 행정전자정부 환경 외부 협력사 접근 보안과 데이터 복원력을 한 번에.",
    badge: "공공·연구",
    color: "#2563eb",
  },
  {
    title: "원격근무 + 랜섬웨어 대응",
    desc: "VMware Horizon + Microsoft Entra MFA + Acronis Cyber Protect EDR — 재택·외근 환경 통합 보호.",
    badge: "민간 중견",
    color: "#7c3aed",
  },
  {
    title: "민간 제조 BCP 통합",
    desc: "Omnissa Workspace ONE + Microsoft Entra ID + Acronis Cyber DR — 업무 연속성과 데이터 보호 단일 책임.",
    badge: "제조·법무",
    color: "#059669",
  },
];

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
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-5 sm:mb-6 leading-[1.1] kr-keep-all">
            Citrix · VMware · Omnissa,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>한 전문가에게
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            VDI 솔루션 딜리버리에 MFA와 Acronis 백업·EDR을 더해, 요건에 가장 잘 맞는 형태로 설계합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/practices"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              주력 솔루션 보기
            </Link>
            <Link
              href="/tools/risk-assessment"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/30 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              VDI 보안 준비도 진단
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Solutions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-24">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Our Solutions
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          주력 솔루션 4영역
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          VDI · MFA · 백업·EDR · 융합 맞춤 제안 — 한 전문가가 통합 책임집니다.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {practicesList.map((p) => {
            const c = practiceColorMap[p.primaryColor] || practiceColorMap.blue;
            return (
              <Link
                key={p.id}
                href={p.href}
                className="card-hover group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300 flex flex-col"
                style={{ borderTop: `4px solid ${c.border}` }}
              >
                <span className={`text-xs font-bold uppercase tracking-widest mb-3 ${c.text}`}>
                  {p.brand}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 kr-keep-all">{p.title}</h3>
                <p className="text-xs font-medium text-gray-500 mb-3 kr-keep-all">{p.tagline}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 kr-keep-all flex-1">
                  {p.description.length > 100 ? p.description.slice(0, 100) + "…" : p.description}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:translate-x-0.5 transition-transform`}
                >
                  자세히 →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bundle Scenarios (융합 맞춤 제안) */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Integrated Solution
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            융합 맞춤 제안 — 단일 책임 운영
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
            VDI·MFA·백업을 따로 사지 않습니다. 요건에 맞춰 통합 설계하고, 도입 후에도 한 창구에서 책임집니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {bundleScenarios.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderTop: `4px solid ${s.color}` }}
              >
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  {s.badge}
                </span>
                <h3 className="font-bold text-base text-gray-900 mb-2 kr-keep-all">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link
              href="/practices/managed-integration"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              융합 맞춤 제안 자세히 →
            </Link>
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
            <p className="text-xs text-gray-500 kr-keep-all">전문 영역·인증·파트너십</p>
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
            주요 공공·연구기관과 민간 기업의 VDI·DaaS 환경을 운영해 왔습니다
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
            현재 VDI 보안 준비도, 7분이면 확인
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            8개 영역 28문항 자가 진단으로 현황을 점검하고 맞춤 리포트를 받아보세요.
          </p>
          <Link
            href="/tools/risk-assessment"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            VDI 보안 준비도 진단
          </Link>
        </div>
      </section>
    </div>
  );
}
