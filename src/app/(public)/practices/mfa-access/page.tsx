import Link from "next/link";
import { practices, company } from "@/lib/site-config";

const p = practices["mfa-access"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const vendors = [
  {
    name: "Microsoft Entra ID",
    desc: "M365 보유 고객은 추가 라이선스 없이 활성화 가능. Conditional Access·SSO 통합. Azure Korea가 CSAP IaaS 인증을 보유해 공공기관 도입 적합.",
    href: "https://learn.microsoft.com/entra/",
    badge: "권장 #1",
    color: "#0078d4",
  },
  {
    name: "라온시큐어 OneAccess · TouchEn",
    desc: "한국 공공·금융 표준 PKI 기반 통합 인증. 행정 전자서명(GPKI/NPKI) 네이티브 지원, 정부 부처·지자체·공공기관 광범위 도입 레퍼런스.",
    href: "https://www.raonsecure.com/",
    badge: "권장 #2 (공공 특화)",
    color: "#0066cc",
  },
];

export default function MfaAccessPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-indigo-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/practices" className="hover:text-indigo-600">Solutions</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{p.shortTitle}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <p className="inline-flex items-center gap-2 text-indigo-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-indigo-300 inline-block"></span>
            {p.brand} · {p.title}
            <span className="w-3 sm:w-4 h-px bg-indigo-300 inline-block"></span>
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-5 sm:mb-6 leading-[1.1] kr-keep-all">
            MFA를 솔루션이 아니라,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>설계로
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <Link
            href="/contact?source=mfa-access&interest=mfa-access"
            className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-semibold text-sm sm:text-base shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
          >
            MFA QuickStart 상담
          </Link>
        </div>
      </section>

      {/* Why QuickStart */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">왜 설계인가</p>
              <p className="text-sm font-bold text-gray-900">붙이는 위치가 가치</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                MFA를 솔루션으로만 사면 가격 경쟁이 됩니다. 진짜 가치는 VDI·DaaS·외부 협력사 접속의
                어디에 어떤 정책으로 붙이고, 장애 시 어떤 우회 절차로 운영을 멈추지 않을지를 설계하는 데 있습니다.
                관리자·특권 계정 보호와 PoC 종료 기준까지 함께 정리합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars — QuickStart 산출물 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-indigo-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          QuickStart Deliverables
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          MFA QuickStart 산출물 4종
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          인증 흐름도 → 예외·장애 우회 정책 → 특권 계정 보호 → PoC 체크리스트.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {p.pillars.map((pl) => (
            <div
              key={pl.title}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTop: "4px solid #4f46e5" }}
            >
              <h3 className="font-bold text-base text-gray-900 mb-2 kr-keep-all">{pl.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed kr-keep-all">{pl.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor Recommendations */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-indigo-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Recommended Vendors
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            추천 MFA 솔루션
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 max-w-xl mx-auto kr-keep-all">
            고객 환경(M365 보유 여부·VDI 벤더·예산)에 따라 적합한 벤더를 중립적으로 제안합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {vendors.map((v) => (
              <div
                key={v.name}
                className="bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                style={{ borderTop: `4px solid ${v.color}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{v.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {v.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 kr-keep-all">{v.desc}</p>
                <a
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  공식 문서 보기 →
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-6 kr-keep-all">
            ※ 드림시큐리티·잉카인터넷 등 국내 PKI 솔루션, Okta 등 글로벌 IDaaS도 고객 요건에 따라 검토 가능합니다. 라온시큐어 파트너십은 추진 중입니다.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-indigo-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Free Consultation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            MFA를 어디에 어떻게 붙일지, 함께 설계합니다
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed kr-keep-all">
            현재 인증 흐름 인터뷰 후 사용자군별 정책·예외·장애 우회·관리자 보호·PoC 체크리스트를 산출합니다. 솔루션 단가가 아니라 운영 안정성을 만듭니다.
          </p>
          <Link
            href="/contact?source=mfa-access&interest=mfa-access&subject=MFA QuickStart 상담"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-semibold text-sm sm:text-base shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
          >
            MFA QuickStart 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
