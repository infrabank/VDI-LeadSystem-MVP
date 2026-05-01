import Link from "next/link";
import { practices, company, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "../../PartnerBadge";

const dpPartners = partnerships.filter((p) => p.domain === "data-protection");

const p = practices["data-protection"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const usecases = [
  {
    title: "랜섬웨어 대응",
    desc: "감염 탐지·격리·롤백을 한 콘솔에서 통합 운영, 사이버복원력 표준 RTO 충족",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "BCP·재해복구",
    desc: "RTO/RPO 목표 기반 DR 설계, Acronis Cyber Disaster Recovery 클라우드 페일오버",
    icon: "M3 12a9 9 0 0118 0M3 12a9 9 0 0118 0m-9-9v9m0 9V12",
  },
  {
    title: "엔드포인트 통합 보호",
    desc: "백업 + 안티-멀웨어 + 패치 관리 + 원격 제어를 단일 에이전트로",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    title: "MSP 24x7 운영",
    desc: "복구 검증·정기 테스트·월간 리포트 포함 매니지드 서비스",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
];

const layers = [
  { num: "1", title: "보호(Protect)", desc: "백업 정책·암호화·접근통제로 데이터 자체를 안전하게" },
  { num: "2", title: "탐지(Detect)", desc: "AI 기반 랜섬웨어 행위 탐지·이상 활동 모니터링" },
  { num: "3", title: "복구(Recover)", desc: "검증된 복구 시나리오, 분 단위 RTO 달성" },
  { num: "4", title: "검증(Validate)", desc: "정기 복구 테스트·복원력 평가 리포트" },
];

export default function DataProtectionPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/practices" className="hover:text-emerald-600">Practices</Link>
          <span className="mx-2 text-gray-300">/</span>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6 leading-tight tracking-tight kr-keep-all">
            랜섬웨어·운영 중단에<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>흔들리지 않는 데이터 보호
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/about#contact"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
            >
              데이터 보호 상담 문의
            </Link>
            <Link
              href="/insights?tag=data-protection"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-emerald-500/30 border border-emerald-400/40 text-white rounded-lg hover:bg-emerald-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              관련 콘텐츠 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Why Acronis */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">왜 Acronis인가</p>
              <p className="text-sm font-bold text-gray-900">백업 + 보안 통합</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                전통적 백업은 랜섬웨어로부터 데이터를 보호하지 못합니다. Acronis Cyber Protect는
                백업·안티-멀웨어·EDR·패치 관리를 단일 플랫폼으로 통합해, 침해 사고 발생 시에도
                감염되지 않은 시점으로 신속한 복구가 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-layer model */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-emerald-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
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
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTop: "4px solid #059669" }}
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
          <p className="text-emerald-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Use Cases
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-14 kr-keep-all">
            주요 활용 시나리오
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {usecases.map((u, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-emerald-600"
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
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
            Cyber Protection Technology Partner
          </p>
          <div className="max-w-sm mx-auto">
            {dpPartners.map((p) => (
              <PartnerBadge key={p.name} partner={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 진단 도구 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-emerald-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Free Assessment
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          백업·사이버복원력 자가 진단
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          7영역 25문항 · 약 7분 — Acronis Cyber Protect 도입 시나리오 포함 무료 리포트.
        </p>
        <Link
          href="/tools/backup-readiness"
          className="card-hover group block max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-md ring-2 ring-emerald-600 ring-offset-2"
          style={{ borderTop: "4px solid #059669" }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              NEW · Free
            </span>
          </div>
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 kr-keep-all">
            백업·사이버복원력 자가 진단
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 kr-keep-all">
            현재 백업 정책·랜섬웨어 보호·DR·복구 검증 수준을 7영역 25문항으로 점검합니다.
            Level 1~5 등급과 Acronis 도입 우선순위 권고를 무료 리포트로 받아보세요.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
            진단 시작 →
          </span>
        </Link>

        <div className="text-center mt-8 md:mt-10 text-xs text-gray-400 kr-keep-all">
          향후 백업 ROI 계산기·RTO/RPO 가이드 추가 예정
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
            데이터 보호 전략, 어디서부터 시작할지 막막하다면?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            현재 백업 환경 진단부터 RTO/RPO 목표 설정·Acronis 도입 견적까지 무료로 상담드립니다.
          </p>
          <Link
            href={`mailto:${company.email}?subject=데이터 보호 상담 문의`}
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
          >
            상담 문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
