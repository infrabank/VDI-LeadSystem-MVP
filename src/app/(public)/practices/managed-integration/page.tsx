import Link from "next/link";
import { practices, company } from "@/lib/site-config";

const p = practices["managed-integration"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const scenarios = [
  {
    title: "인터넷 VDI 축소 + 업무 VDI 유지",
    desc: "외부 인터넷 업무는 O등급 SaaS 또는 RBI로 대체하고, 업무 VDI는 C/S 등급 업무에만 한정. 라이선스·운영 부담을 줄이며 N²SF 정렬을 확보.",
    badge: "공공·연구",
    color: "#2563eb",
  },
  {
    title: "신규 발주 사전 N²SF 정렬",
    desc: "갱신·재발주 시점이 가까운 기관에 대해, RFP에 N²SF C/S/O 분류·MFA·백업 증빙 요건을 미리 반영. 발주 후 변경 비용을 차단.",
    badge: "지자체·산하기관",
    color: "#7c3aed",
  },
  {
    title: "DaaS 전환 가능성 검토",
    desc: "온프레 VDI 운영 부담이 큰 기관에서 Citrix DaaS·AVD·Windows 365의 N²SF 적합성과 한계를 비교. 전환 가능 업무와 유지 업무를 구분.",
    badge: "정부 출연 연구기관",
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
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            큰 전환을 시작하기 전,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>1차 진단부터
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/tools/risk-assessment"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-purple-700 rounded-lg hover:bg-purple-50 font-semibold text-sm sm:text-base shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5"
            >
              N²SF 정렬 자가 진단(7분)
            </Link>
            <Link
              href="/contact?source=managed-integration&interest=managed-integration"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-purple-500/30 border border-purple-400/40 text-white rounded-lg hover:bg-purple-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              사전진단 상담
            </Link>
          </div>
        </div>
      </section>

      {/* Why Diagnosis */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">왜 사전진단인가</p>
              <p className="text-sm font-bold text-gray-900">기관별 환경 해석</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                N²SF는 단순 제품 도입이 아닙니다. KISA 실증 사례집도 기관별 네트워크·연동 시스템·보안 정책에 맞춰
                재설계할 것을 권고합니다. 1차 진단 없이 큰 전환을 시도하면 일정·비용·보안성 검토 모두 흔들립니다.
                현재 VDI·망분리 구조부터 정리하고, 등급 분류와 유지·축소·전환 대상을 먼저 가립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars — 사전진단 산출물 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Diagnosis Deliverables
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          사전진단 산출물 4종
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          현재 구조 → C/S/O 분류 → 유지·축소·전환 → 1차 로드맵·RFP 문구.
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

      {/* Bundle Scenarios — 사전진단 결과 시나리오 */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Diagnosis Outcomes
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            진단 결과 시나리오 3종
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 max-w-xl mx-auto kr-keep-all">
            현장에서 자주 도출되는 1차 진단 결과 예시입니다. 실제 권고는 기관별 환경 분석 후 결정합니다.
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
            기관별 N²SF 정렬, 1차 진단부터 시작하세요
          </h2>
          <p className="text-sm sm:text-base text-purple-100 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed kr-keep-all">
            현재 VDI·망분리 구조 인터뷰 후, C/S/O 예비 분류·유지/축소/전환 대상·1차 로드맵·RFP 반영 문구 초안을 산출합니다.
          </p>
          <Link
            href="/contact?source=managed-integration&interest=managed-integration&subject=N²SF 전환 사전진단 상담"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 font-semibold text-sm sm:text-base shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5"
          >
            N²SF 전환 사전진단 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
