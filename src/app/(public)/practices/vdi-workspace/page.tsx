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
    title: "유지 / 일부 축소 시나리오",
    desc: "C/S 등급 핵심 업무에 VDI를 한정하고, O등급 업무는 SaaS·RBI로 대체. 라이선스·운영 부담을 줄이며 N²SF 정렬을 확보합니다.",
    icon: "M5 13l4 4L19 7",
    color: "#2563eb",
    href: "/tools/vdi-transition",
  },
  {
    rank: "02",
    title: "DaaS 전환 가능성 검토",
    desc: "Citrix DaaS·Azure Virtual Desktop·Windows 365의 N²SF 적합성과 한계를 비교. 어떤 업무는 옮길 수 있고 어떤 업무는 옮길 수 없는지 가립니다.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    color: "#4f46e5",
    href: "/contact?source=vdi-workspace&interest=daas-transition",
  },
  {
    rank: "03",
    title: "고위험·외부 협력사 분리 설계",
    desc: "외부 협력사·고위험 업무를 별도 VDI 영역으로 분리하고, MFA·조건부 접근·세션 격리를 결합. VDI를 어디에 남길지 결정합니다.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    color: "#7c3aed",
    href: "/contact?source=vdi-workspace&interest=zero-trust",
  },
  {
    rank: "04",
    title: "운영 리스크 평가",
    desc: "FSLogix·UAG·NetScaler·인증서·라이선스·XenServer·NetApp 등 실제로 터지는 패턴을 기반으로 전환 리스크를 평가합니다.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    color: "#0891b2",
    href: "/contact?source=vdi-workspace&interest=risk-review",
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
            N²SF 이후, VDI를<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>어디에 남길 것인가
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/tools/vdi-transition"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              VDI 역할 재정의 진단(2분)
            </Link>
            <Link
              href="/contact?source=vdi-workspace&interest=vdi-workspace"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-500/30 border border-blue-400/40 text-white rounded-lg hover:bg-blue-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              VDI 역할 재정의 상담
            </Link>
          </div>
        </div>
      </section>

      {/* Why Repositioning */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">왜 재정의인가</p>
              <p className="text-sm font-bold text-gray-900">유지·축소·전환의 판단</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                N²SF 이후 모든 업무를 VDI에 두는 단순 구조는 더 이상 적정하지 않습니다.
                동시에, VDI가 끝나는 것도 아닙니다 — 역할이 바뀝니다. Citrix·VMware·Omnissa를 공공·연구기관에서
                다년간 직접 운영해 본 경험으로, 어디는 유지하고 어디는 축소하고 어디는 DaaS로 옮길지를
                벤더 종속 없이 판단합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Scenarios */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-24">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Repositioning Scenarios
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          VDI 전환 시나리오 4종
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          유지·DaaS 전환·고위험 분리·운영 리스크 — 환경별로 어떤 시나리오가 맞는지 판단합니다.
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
            N²SF 이후, VDI를 어디에 남길지 함께 결정하시죠
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed kr-keep-all">
            기존 VDI 환경 인터뷰 후 유지·축소·DaaS·고위험 분리 시나리오를 비교하고, 운영 리스크와 비용을 함께 판단합니다.
          </p>
          <Link
            href="/contact?source=vdi-workspace&interest=vdi-workspace&subject=VDI 역할 재정의 상담"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            VDI 역할 재정의 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
