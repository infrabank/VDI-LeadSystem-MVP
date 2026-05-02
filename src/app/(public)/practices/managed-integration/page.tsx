import Link from "next/link";
import { practices, company } from "@/lib/site-config";

const p = practices["managed-integration"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const scenarios = [
  {
    title: "공공기관 망분리 완화 패키지",
    desc: "Citrix VDI + 라온시큐어 OneAccess(GPKI 인증) + Acronis 백업으로 행정전자정부 환경 대응. 외부 협력사 접근 보안과 데이터 복원력을 한 번에.",
    badge: "공공·연구",
    color: "#2563eb",
  },
  {
    title: "원격근무 + 랜섬웨어 대응 패키지",
    desc: "VMware Horizon + Microsoft Entra MFA + Acronis Cyber Protect EDR. 재택·외근 환경에서도 단일 관리 콘솔로 보호.",
    badge: "민간 중견",
    color: "#7c3aed",
  },
  {
    title: "민간 제조 BCP 통합",
    desc: "Omnissa Workspace ONE + Microsoft Entra ID + Acronis Cyber DR. 업무 연속성과 데이터 보호를 단일 책임으로 운영.",
    badge: "제조·법무",
    color: "#059669",
  },
];

export default function ManagedIntegrationPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-purple-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/practices" className="hover:text-purple-600">Solutions</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{p.shortTitle}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <p className="inline-flex items-center gap-2 text-purple-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-purple-300 inline-block"></span>
            {p.brand} · {p.title}
            <span className="w-3 sm:w-4 h-px bg-purple-300 inline-block"></span>
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-5 sm:mb-6 leading-[1.1] kr-keep-all">
            VDI · MFA · 백업,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>한 창구의 통합 책임
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <Link
            href="/contact?source=managed-integration&interest=managed-integration"
            className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-purple-700 rounded-lg hover:bg-purple-50 font-semibold text-sm sm:text-base shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5"
          >
            융합 패키지 상담
          </Link>
        </div>
      </section>

      {/* Why Integrated */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">왜 통합인가</p>
              <p className="text-sm font-bold text-gray-900">책임 단절 해소</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                VDI·MFA·백업을 따로따로 구매하면 도입 후 책임 떠넘기기가 발생합니다.
                &quot;그건 백업 벤더 문의하세요&quot;, &quot;그건 MFA 쪽 이슈예요&quot; — 결국 고객이 통합을 직접 풀어야 합니다.
                Myloket은 세 영역을 한 번에 통합 설계하고, 도입 후에도 한 창구에서 운영·기술지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Service Pillars
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          융합 맞춤 제안 4대 영역
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          요건 분석 → 벤더 비교 → TCO 산출 → 단일 책임 운영.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {p.pillars.map((pl) => (
            <div
              key={pl.title}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTop: "4px solid #7c3aed" }}
            >
              <h3 className="font-bold text-base text-gray-900 mb-2 kr-keep-all">{pl.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed kr-keep-all">{pl.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bundle Scenarios */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Bundle Scenarios
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            융합 패키지 시나리오 3종
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 max-w-xl mx-auto kr-keep-all">
            업종·규제·예산에 맞춘 대표 조합 예시입니다. 실제 제안은 고객 요건 분석 후 맞춤 설계됩니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {scenarios.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
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
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-purple-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Free Consultation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            우리 환경에 맞는 통합 설계를 받아보세요
          </h2>
          <p className="text-sm sm:text-base text-purple-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            요건·예산·규제 환경 인터뷰 후, VDI·MFA·백업 통합 아키텍처와 5년 TCO를 무료로 산출해드립니다.
          </p>
          <Link
            href="/contact?source=managed-integration&interest=managed-integration&subject=융합 패키지 상담 문의"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 font-semibold text-sm sm:text-base shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5"
          >
            융합 패키지 상담 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
