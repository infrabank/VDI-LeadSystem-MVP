import Link from "next/link";
import { practices, company } from "@/lib/site-config";

const p = practices["mfa-access"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const vendors = [
  {
    name: "Cisco Duo",
    desc: "VDI·VPN·SaaS 통합 MFA. 도입 가장 쉽고 VDI 통합 레퍼런스 풍부. 보안 우선 중견기업 추천.",
    href: "https://duo.com/",
    badge: "권장 #1",
    color: "#00bceb",
  },
  {
    name: "Microsoft Entra ID",
    desc: "M365 보유 고객은 추가 라이선스 없이 활성화 가능. Conditional Access·SSO 통합.",
    href: "https://learn.microsoft.com/entra/",
    badge: "권장 #2",
    color: "#0078d4",
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
            VDI 진입을 한 번 더,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>안전하게
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <Link
            href="/contact?source=mfa-access&interest=mfa-access"
            className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-semibold text-sm sm:text-base shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
          >
            MFA 도입 상담
          </Link>
        </div>
      </section>

      {/* Why MFA */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">왜 MFA인가</p>
              <p className="text-sm font-bold text-gray-900">VDI의 자연스러운 확장</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                VDI·DaaS 환경의 가장 큰 보안 공백은 진입 인증입니다. 비밀번호만으로는 피싱·자격증명 유출 공격을 막기 어렵고,
                망분리 완화 정책이 진행됨에 따라 외부 협력사·재택 사용자의 접근도 늘어납니다.
                MFA는 VDI 보안의 기본 전제 조건입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-indigo-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Service Pillars
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          MFA·접근통제 4대 영역
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          라이선스 리셀 + 구축 + 유지보수를 한 창구에서 제공합니다.
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
            ※ Okta·OneLogin 등 다른 벤더도 고객 요건에 따라 검토 가능합니다.
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
            MFA 도입, 어디서부터 시작할지 막막하다면?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            현재 환경 진단부터 벤더 선정·라이선스·도입 일정·견적까지 무료로 상담드립니다.
          </p>
          <Link
            href="/contact?source=mfa-access&interest=mfa-access&subject=MFA 도입 상담 문의"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-semibold text-sm sm:text-base shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
          >
            MFA 도입 상담 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
