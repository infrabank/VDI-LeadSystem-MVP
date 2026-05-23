import Link from "next/link";
import {
  company,
  supportAreas,
  maintenancePackages,
  operationalIssues,
  trustSignals,
  supportProcess,
} from "@/lib/site-config";
import { CustomerShowcase } from "./CustomerShowcase";

const supportAccentMap: Record<
  "blue" | "indigo" | "emerald",
  { border: string; text: string; soft: string; chip: string }
> = {
  blue: {
    border: "#2563eb",
    text: "text-blue-700",
    soft: "bg-blue-50",
    chip: "bg-blue-50 text-blue-700 border-blue-100",
  },
  indigo: {
    border: "#4f46e5",
    text: "text-indigo-700",
    soft: "bg-indigo-50",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  emerald: {
    border: "#059669",
    text: "text-emerald-700",
    soft: "bg-emerald-50",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
};

const maintenanceAccentMap: Record<
  "blue" | "indigo" | "amber" | "emerald",
  { border: string; text: string; bg: string }
> = {
  blue: { border: "#2563eb", text: "text-blue-700", bg: "bg-blue-50" },
  indigo: { border: "#4f46e5", text: "text-indigo-700", bg: "bg-indigo-50" },
  amber: { border: "#d97706", text: "text-amber-700", bg: "bg-amber-50" },
  emerald: { border: "#059669", text: "text-emerald-700", bg: "bg-emerald-50" },
};

export default function HomePage() {
  return (
    <div>
      {/* ========== Section 1. Hero ========== */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <p className="inline-flex items-center gap-2 text-slate-300 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-slate-400 inline-block" />
            VDI · Backup Technical Support
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-5 sm:mb-7 leading-[1.15] kr-keep-all">
            VDI와 백업 운영장애,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>구축 경험 있는 엔지니어가 직접 지원합니다
          </h1>
          <p className="text-base sm:text-lg text-slate-200/90 mb-8 sm:mb-10 max-w-3xl leading-relaxed kr-keep-all">
            Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect 환경의
            기술지원·유지보수·복구검증을 제공합니다. 공공기관·연구기관·기업 VDI 운영현장에서 실제로 발생하는
            접속장애, 인증서, 프로파일, 스토리지, 라이선스, 백업 복구 이슈를 실무 기준으로 대응합니다.
          </p>

          <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            {supportAreas.map((s) => (
              <span
                key={s.id}
                className="text-xs sm:text-sm font-semibold text-slate-100 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full kr-keep-all"
              >
                {s.brand}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contact?source=hero&interest=incident-response"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 text-center"
            >
              기술지원 문의하기
            </Link>
            <Link
              href="/contact?source=hero&interest=monthly-checkup"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/30 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center"
            >
              유지보수 범위 상담하기
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Section 2. 고객이 실제로 겪는 문제 ========== */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-amber-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Field Issues
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            운영 중인 VDI와 백업 환경은 “구축”보다 “장애 대응”이 더 어렵습니다
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            현장에서 반복적으로 마주치는 5가지 문제입니다. 어디서 들어본 일반론이 아니라, 운영자가
            어제·오늘 처리하고 있는 일입니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {operationalIssues.map((issue, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 leading-snug kr-keep-all">
                    {issue.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {issue.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Section 3. 전문 기술지원 분야 ========== */}
      <section id="support-areas" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Technical Support
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            전문 기술지원 분야
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            3개 핵심 제품 — 구축 이후의 운영장애·유지보수·복구검증을 직접 봅니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {supportAreas.map((area) => {
              const c = supportAccentMap[area.accent];
              return (
                <div
                  key={area.id}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                  style={{ borderTop: `4px solid ${c.border}` }}
                >
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.text}`}>
                    {area.brand}
                  </p>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 kr-keep-all">
                    {area.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-4 kr-keep-all">
                    {area.tagline}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-5 flex-1">
                    {area.scope.map((s) => (
                      <li key={s} className="flex items-start gap-2 kr-keep-all">
                        <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.soft}`} style={{ backgroundColor: c.border }} />
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/contact?source=support-area&subject=${encodeURIComponent(area.title + " 문의")}`}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} hover:translate-x-0.5 transition-transform`}
                  >
                    이 분야 기술지원 문의 →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== Section 4. 유지보수 서비스 패키지 ========== */}
      <section id="maintenance" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-indigo-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Maintenance Packages
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            유지보수 서비스 패키지
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            가격대 비교가 아니라 운영자가 어떤 도움을 받고 싶은지에 맞춰 4가지로 정리했습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {maintenancePackages.map((pkg) => {
              const c = maintenanceAccentMap[pkg.accent];
              return (
                <div
                  key={pkg.id}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                  style={{ borderLeft: `4px solid ${c.border}` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${c.bg} ${c.text}`}>
                      Package {pkg.no}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 kr-keep-all">
                    {pkg.title}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">대상</p>
                  <ul className="text-sm text-gray-700 mb-4 space-y-1.5">
                    {pkg.target.map((t) => (
                      <li key={t} className="flex items-start gap-2 kr-keep-all">
                        <span className="text-gray-300 flex-shrink-0">·</span>
                        <span className="leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">제공</p>
                  <ul className="text-sm text-gray-700 mb-5 space-y-1.5 flex-1">
                    {pkg.provides.map((p) => (
                      <li key={p} className="flex items-start gap-2 kr-keep-all">
                        <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ backgroundColor: c.border }} />
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/contact?source=maintenance&interest=${pkg.id}&subject=${encodeURIComponent(pkg.title + " 상담")}`}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} hover:translate-x-0.5 transition-transform mt-auto`}
                  >
                    이 패키지 상담 →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== Section 5. 왜 마이로켓인가 ========== */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Why Myloket
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            왜 마이로켓인가
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            벤더 제품 설명이 아니라, 실제 운영 중 터지는 문제를 기준으로 봅니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {trustSignals.map((t, i) => (
              <div
                key={t.title}
                className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white"
              >
                <p className="text-xs font-bold text-blue-700 tracking-widest mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-bold text-gray-900 mb-2 kr-keep-all">{t.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Section 6. 수행 경험 ========== */}
      <section id="engagements" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-emerald-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Engagements
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            수행 경험
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            공공·연구기관·민간 VDI/백업 환경에서 구축·운영·유지보수를 지원해 온 사례입니다.
            기관명은 동의 정책에 따라 익명 표기하며, 환경·규모·역할은 사실 그대로 적습니다.
          </p>

          <CustomerShowcase variant="compact" />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              "중앙행정기관 VDI 구축·운영·유지보수 지원",
              "정부 출연 연구기관 Omnissa Horizon 유지보수",
              "공공기관 Citrix · VMware 기반 망분리 VDI 환경 지원",
              "연구기관 백업 · DR 운영 점검",
              "VDI 스토리지 이관 및 성능 이슈 분석",
              "인증서 · UAG · Gateway 접속장애 대응",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-2.5 p-4 bg-white rounded-lg border border-gray-200"
              >
                <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">·</span>
                <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">{line}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10">
            <Link
              href="/about#customers"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              전체 수행 경험 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Section 7. 지원 프로세스 ========== */}
      <section id="process" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-slate-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            문의 이후 어떻게 진행되는지
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            기술지원 문의가 접수되면 다음 5단계로 진행합니다.
          </p>

          <ol className="space-y-3 sm:space-y-4">
            {supportProcess.map((step) => (
              <li
                key={step.no}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex sm:flex-col sm:items-start items-center gap-2 sm:gap-1 sm:w-24 flex-shrink-0">
                  <span className="text-xs font-bold tracking-widest text-blue-700">
                    STEP
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-700">
                    {step.no}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 kr-keep-all">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ========== Section 8. 문의 CTA ========== */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            운영 중인 VDI 또는 백업 환경에 문제가 있다면,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>제품명·버전·증상만 먼저 보내주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            구성도·로그가 있으면 첨부해 주시면 1차 원인 구분이 빠릅니다. 평일 1영업일 내 회신드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact?source=home-bottom"
              className="px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 text-center"
            >
              기술지원 문의 보내기
            </Link>
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("[VDI/백업 기술지원 문의]")}`}
              className="px-7 py-3.5 bg-white/10 border border-white/30 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center"
            >
              대표에게 직접 메일
            </a>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            {company.email} · 평일 1영업일 내 회신
          </p>
        </div>
      </section>
    </div>
  );
}
