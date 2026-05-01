import Link from "next/link";
import { practices, company, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "../../PartnerBadge";

const swPartners = partnerships.filter((p) => p.domain === "secure-workspace");

const p = practices["secure-workspace"];

export const metadata = {
  title: `${p.title} (${p.brand}) | ${company.name}`,
  description: p.description,
};

const services = [
  {
    rank: "01",
    title: "N²SF 정렬 진단",
    desc: "274개 보안통제 매핑 · 8영역 28문항 · C/S/O 등급 자가분류 · 모델 3·8·10 권고",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#2563eb",
    href: "/tools/risk-assessment",
    primary: true,
  },
  {
    rank: "02",
    title: "N²SF 전환 준비도",
    desc: "5섹션 15문항 · Level 1~5 등급 산출 · 3단계 전환 로드맵 제시",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "#2563eb",
    href: "/tools/n2sf-readiness",
    primary: false,
  },
  {
    rank: "03",
    title: "VDI 역할 재정의",
    desc: "9문항 진단 · 유지/보완/축소/재설계 4가지 시나리오 판정",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    color: "#4f46e5",
    href: "/tools/vdi-transition",
    primary: false,
  },
  {
    rank: "04",
    title: "VDI 운영 ROI",
    desc: "마이그레이션·운영비용 시뮬레이션 · 경영진 보고용 PDF 제공",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#059669",
    href: "/tools/roi-calculator",
    primary: false,
  },
];

export default function SecureWorkspacePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/practices" className="hover:text-blue-600">Practices</Link>
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
            공공·금융을 위한<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>보안 워크스페이스·접근통제 전문
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {p.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/tools/risk-assessment"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              N²SF 정렬 진단 시작
            </Link>
            <Link
              href="/n2sf"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-500/30 border border-blue-400/40 text-white rounded-lg hover:bg-blue-500/40 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              N²SF 진단센터
            </Link>
          </div>
        </div>
      </section>

      {/* Why N²SF */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start md:items-center">
            <div className="md:col-span-1 flex flex-col items-start gap-1">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">왜 N²SF인가</p>
              <p className="text-sm font-bold text-gray-900">법정 의무화 흐름</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                정보공개법 §9 등급분류 → 적절성 평가 → 보안성 검토(외부 절차) 흐름이 N²SF 1.0 시행으로
                의무화됩니다. 공공·금융 기관은 274개 보안통제 매핑과 C/S/O 자가분류를 선제적으로
                수행해야 신규 발주·갱신 사업에서 탈락을 막을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-center">
            {[
              { stat: "274개", label: "보안통제 매핑", desc: "N²SF 정렬 진단 기준" },
              { stat: "8개", label: "진단 영역", desc: "C/S/O 등급 전 영역 커버" },
              { stat: "50+", label: "공공·금융 기관", desc: "N²SF 자문 도입 사례" },
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

      {/* 4 Service Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-24">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Service Pillars
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
          4대 진단·자문 서비스
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-xl mx-auto kr-keep-all">
          공공·금융 보안 책임자를 위한 N²SF 중심 전문 서비스입니다.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {services.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className={`card-hover group p-5 sm:p-7 bg-white rounded-xl shadow-sm block transition-all hover:-translate-y-0.5 hover:shadow-md ${
                feature.primary ? "ring-2 ring-blue-600 ring-offset-2" : ""
              }`}
              style={{ border: "1px solid #e5e7eb", borderTop: `4px solid ${feature.color}` }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                    feature.primary ? "bg-blue-600" : "bg-blue-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.primary ? "text-white" : "text-blue-600"}`}
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
              <span className="text-sm font-semibold text-blue-600">진단 시작 →</span>
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
            {swPartners.map((p) => (
              <PartnerBadge key={p.name} partner={p} />
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
            N²SF 정렬 현황이 궁금하신가요?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            7분이면 끝나는 N²SF 정렬 진단으로 274개 보안통제 매핑 현황을 확인하고
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
