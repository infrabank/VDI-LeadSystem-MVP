import Link from "next/link";
import { practices, company, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "../../PartnerBadge";

const dpPartners = partnerships.filter((p) => p.domain === "data-protection");

const p = practices["data-protection"];

export const metadata = {
  alternates: { canonical: "/practices/data-protection" },
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const usecases = [
  {
    title: "월간 복구 테스트 리포트",
    desc: "주요 시스템을 매월 실제 복구 시연하고 결과·소요 시간·개선 권고를 리포트로 산출",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    title: "랜섬웨어 24시간 대응 절차",
    desc: "사고 시점부터 복원까지 절차·연락 체계·산출물을 미리 정해두고 정기 점검",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "RTO/RPO 기준표",
    desc: "시스템별 목표 시간·복원 우선순위·책임자를 명시한 기준표 운영·갱신",
    icon: "M3 12a9 9 0 0118 0M3 12a9 9 0 0118 0m-9-9v9m0 9V12",
  },
  {
    title: "백업 무결성 검증",
    desc: "정기 자동 검증 + EDR·롤백 연계 운영. 사고 전에 복구 가능성을 증빙",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

const layers = [
  { num: "1", title: "보호(Protect)", desc: "백업 정책·암호화·접근통제로 데이터 자체를 안전하게" },
  { num: "2", title: "탐지(Detect)", desc: "AI 기반 랜섬웨어 행위 탐지·이상 활동 모니터링" },
  { num: "3", title: "복구(Recover)", desc: "시스템별 목표 RTO/RPO를 정의하고, 정기 복구 테스트로 달성 가능성 검증" },
  { num: "4", title: "검증(Validate)", desc: "정기 복구 테스트·복원력 평가 리포트" },
];

export default function DataProtectionPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <Link href="/practices" className="hover:text-emerald-700">Practices</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">{p.shortTitle}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <p className="inline-flex items-center gap-2 text-emerald-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-emerald-300 inline-block"></span>
            {p.brand} · {p.title}
            <span className="w-3 sm:w-4 h-px bg-emerald-300 inline-block"></span>
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            사고 시 실제 복구 가능한지,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>매월 검증합니다
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/tools/backup-readiness"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5"
            >
              백업·복원력 자가 진단(7분)
            </Link>
            <Link
              href="/contact?source=data-protection&interest=data-protection"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-emerald-500/30 border border-emerald-400/40 text-white rounded-lg hover:bg-emerald-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition"
            >
              복구검증 서비스 상담
            </Link>
          </div>
        </div>
      </section>

      {/* Why Verification */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">왜 복구검증인가</p>
              <p className="text-sm font-bold text-gray-900">백업이 아니라 증빙</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                백업이 돌아간다는 것과 사고 시 실제 복구가 가능하다는 것은 다른 문제입니다.
                서버·PC·NAS는 Acronis Cyber Protect로, 가상화 VM은 Vinchin Backup &amp; Recovery로 보호하고,
                그 위에 매월 복구 시연·RTO/RPO 기준표·랜섬웨어 24시간 대응 절차·무결성 검증 결과를
                정기적으로 산출합니다. 라이선스만 공급하는 리셀러와 달리 복구 가능성을 증빙으로 남깁니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-layer model */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-emerald-700 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Cyber Resilience Framework
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          4단계 사이버복원력 체계
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          침해 사고를 가정한 통합 보호·복구 운영 모델입니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {layers.map((l) => (
            <div
              key={l.num}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTop: "4px solid var(--color-domain-backup)" }}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
                {l.num}
              </span>
              <h3 className="font-bold text-base text-gray-900 mb-2 kr-keep-all">{l.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed kr-keep-all">{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-emerald-700 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Use Cases
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-14 kr-keep-all">
            주요 활용 시나리오
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {usecases.map((u, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <svg aria-hidden="true"
                      className="w-5 h-5 text-emerald-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={u.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 kr-keep-all">{u.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partner */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-widest mb-6 md:mb-8">
            Cyber Protection Technology Partner
          </p>
          <div className="max-w-sm mx-auto">
            {dpPartners.map((p) => (
              <PartnerBadge key={p.name} partner={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 진단·계산 도구 2종 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-emerald-700 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Free Assessment
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          데이터 보호 진단·계산 도구
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          7분 자가 진단으로 성숙도를 확인하고, 5필드 입력으로 5년 ROI까지 산출합니다. 둘 다 무료입니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {/* 자가 진단 */}
          <Link
            href="/tools/backup-readiness"
            className="card-hover group block p-6 sm:p-7 bg-white rounded-xl shadow-sm border border-gray-200 transition hover:-translate-y-0.5 hover:shadow-md ring-2 ring-emerald-600 ring-offset-2"
            style={{ borderTop: "4px solid var(--color-domain-backup)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                NEW · 약 7분
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 kr-keep-all">
              백업·사이버복원력 자가 진단
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 kr-keep-all">
              7영역 25문항 · Level 1~5 등급 · Acronis 도입 우선순위 권고 무료 리포트.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              진단 시작 →
            </span>
          </Link>

          {/* ROI 계산기 */}
          <Link
            href="/tools/backup-roi"
            className="card-hover group block p-6 sm:p-7 bg-white rounded-xl shadow-sm border border-gray-200 transition hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderTop: "4px solid var(--color-domain-backup)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <svg aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                NEW · 약 4분
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 kr-keep-all">
              백업 ROI 계산기
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 kr-keep-all">
              5필드 입력 → 5년 누적 회피 비용·ROI%·Payback. Best/Expected/Worst 시나리오 비교.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              ROI 산출 시작 →
            </span>
          </Link>
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Link
            href="/insights/tag/data-protection"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors"
          >
            관련 가이드·체크리스트 보기 →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-teal-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-emerald-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Free Consultation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            백업이 돌아가는 것 vs 실제 복구 가능한 것, 증빙해드립니다
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed kr-keep-all">
            현재 백업 환경 인터뷰 후 RTO/RPO 기준표·월간 복구 테스트 리포트·랜섬웨어 24시간 대응 절차를 체계로 만들어 운영합니다.
          </p>
          <Link
            href="/contact?source=data-protection&interest=data-protection&subject=백업·DR 복구검증 서비스 상담"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5"
          >
            복구검증 서비스 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
