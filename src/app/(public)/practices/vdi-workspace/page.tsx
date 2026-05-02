import Link from "next/link";
import { practices, company, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "../../PartnerBadge";

const vdiPartners = partnerships.filter((p) => p.domain === "vdi-workspace");

const p = practices["vdi-workspace"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const services = [
  {
    rank: "01",
    title: "Citrix Virtual Apps & Desktops",
    desc: "Citrix DaaS·NetScaler·StoreFront 기반 VDI 설계·구축·MSP 운영. 온프레 → DaaS 전환 자문.",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    color: "#452170",
    href: "/contact?source=vdi-workspace&interest=vdi-workspace",
  },
  {
    rank: "02",
    title: "VMware Horizon",
    desc: "Horizon 8·UAG·App Volumes·DEM 운영. vSphere 기반 통합 가상화 환경 설계·운영.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#607078",
    href: "/contact?source=vdi-workspace&interest=vdi-workspace",
  },
  {
    rank: "03",
    title: "Omnissa Workspace ONE",
    desc: "Horizon·Workspace ONE UEM 통합. VMware EUC 사업부의 Omnissa 분사 후 마이그레이션 지원.",
    icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#0091da",
    href: "/contact?source=vdi-workspace&interest=vdi-workspace",
  },
  {
    rank: "04",
    title: "DaaS 전환 (AVD · Windows 365)",
    desc: "온프레 VDI에서 Azure Virtual Desktop·Windows 365·Citrix DaaS로의 마이그레이션 자문·구축.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    color: "#0078d4",
    href: "/contact?source=vdi-workspace&interest=daas-transition",
  },
];

export default function VdiWorkspacePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/practices" className="hover:text-blue-600">Solutions</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{p.shortTitle}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <p className="inline-flex items-center gap-2 text-blue-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
            {p.brand} · {p.title}
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-5 sm:mb-6 leading-[1.1] kr-keep-all">
            Citrix · VMware · Omnissa,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>한 전문가에게
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/contact?source=vdi-workspace&interest=vdi-workspace"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              VDI 솔루션 상담
            </Link>
            <Link
              href="/tools/risk-assessment"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-500/30 border border-blue-400/40 text-white rounded-lg hover:bg-blue-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              VDI 보안 준비도 진단
            </Link>
          </div>
        </div>
      </section>

      {/* Why Multi-vendor */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">왜 멀티 벤더인가</p>
              <p className="text-sm font-bold text-gray-900">Citrix · VMware · Omnissa</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                고객 환경마다 라이선스 정책·기존 인프라·사용자 패턴이 다릅니다.
                특정 벤더에 종속된 자문은 적합한 답을 내기 어렵습니다.
                Myloket은 Citrix·VMware·Omnissa 세 벤더를 모두 다년간 운영해 본 실무 경험을 바탕으로,
                요건에 가장 잘 맞는 형태를 중립적으로 제안합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Service Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-24">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Service Pillars
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
          4대 VDI 딜리버리 서비스
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          온프레미스 VDI부터 클라우드 DaaS 전환까지, 한 전문가가 통합 책임집니다.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {services.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className="card-hover group p-5 sm:p-7 bg-white rounded-xl shadow-sm block transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ border: "1px solid #e5e7eb", borderTop: `4px solid ${feature.color}` }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-blue-50">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-300">{feature.rank}</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-2.5 kr-keep-all">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 kr-keep-all">{feature.desc}</p>
              <span className="text-sm font-semibold text-blue-600">상담 문의 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Technology Partners */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
            VDI · DaaS Technology Partners
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
            {vdiPartners.map((partner) => (
              <PartnerBadge key={partner.name} partner={partner} />
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
            Free Consultation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            VDI 도입·전환·운영, 어디서부터 시작할지 막막하다면?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            현재 환경 진단부터 벤더 선정·아키텍처 설계·견적까지 무료로 상담드립니다.
          </p>
          <Link
            href="/contact?source=vdi-workspace&interest=vdi-workspace&subject=VDI 솔루션 상담 문의"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            VDI 솔루션 상담 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
