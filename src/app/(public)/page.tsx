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

const supportAccent: Record<"blue" | "indigo" | "emerald", { border: string; text: string }> = {
  blue: { border: "#2563eb", text: "text-blue-700" },
  indigo: { border: "#4f46e5", text: "text-indigo-700" },
  emerald: { border: "#059669", text: "text-emerald-700" },
};

// 유지보수 카드 단색 — accent 색을 4개로 흩지 말고 slate 단일로 통일.
// 번호 칩만 강하게 둬서 위계를 잡음.
const MAINT_ACCENT = {
  border: "#0f172a", // slate-900
  text: "text-slate-700",
  link: "text-slate-900",
} as const;

export default function HomePage() {
  return (
    <div>
      {/* ========== Section 1. Hero ========== */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <p className="inline-flex items-center gap-2 text-slate-300 font-semibold text-xs sm:text-sm mb-5 sm:mb-6 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-slate-400 inline-block" />
            IT Maintenance · Acronis Backup · VDI Support
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            전산유지보수부터<br />
            VDI 기술지원까지
          </h1>
          <p className="text-base sm:text-lg text-slate-200/90 mb-6 sm:mb-7 max-w-2xl leading-relaxed kr-keep-all">
            마이로켓은 PC·서버·네트워크·백업 운영을 정리하는 전산유지보수와 Citrix·Omnissa Horizon
            VDI 전문 기술지원을 제공합니다. 단순 수리보다 운영 상태를 확인하고, 장애 원인과 조치
            방향을 보고서로 남깁니다.
          </p>
          <p className="text-sm sm:text-base text-slate-300/80 mb-8 sm:mb-10 max-w-2xl leading-relaxed kr-keep-all border-l-2 border-blue-400/60 pl-4">
            특히 Citrix와 Omnissa Horizon 기반 VDI 운영장애, 인증서, 프로파일, UAG/Gateway,
            vSphere 연계 문제를 다년간 다뤄왔습니다.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/contact?source=home-hero&interest=it-maintenance&subject=전산유지보수 문의"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 text-center"
            >
              전산유지보수 문의
            </Link>
            <Link
              href="/contact?source=home-hero&interest=acronis&subject=Acronis 백업 상담"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center"
            >
              Acronis 백업 상담
            </Link>
            <Link
              href="/contact?source=home-hero&interest=vdi&subject=VDI 기술지원 문의"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center"
            >
              VDI 기술지원 문의
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Section 2. 2트랙 서비스 구분 ========== */}
      <section id="tracks" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-slate-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Two Tracks
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            일반 전산운영과 VDI 전문 운영을 나눠서 봅니다
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* 트랙 1 — 전산운영·백업 */}
            <div className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-8" style={{ borderTop: "4px solid #2563eb" }}>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Track 1</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">
                전산운영·백업 지원
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-5">
                전산 담당자가 없거나 운영 공백이 있는 회사의 PC, 서버, 네트워크, NAS, 백업, 보안
                상태를 정기적으로 점검합니다.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-6 flex-1 kr-keep-all">
                {[
                  "전산통합유지보수",
                  "PC·서버·네트워크 장애 대응",
                  "NAS·백업 상태 점검",
                  "Acronis 백업·복구보안",
                  "월간 점검표와 운영 보고서",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-blue-500 flex-shrink-0">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/services/it-maintenance"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform mt-auto"
              >
                전산유지보수 보기 →
              </Link>
            </div>

            {/* 트랙 2 — VDI 전문 기술지원 */}
            <div className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-8" style={{ borderTop: "4px solid #4f46e5" }}>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Track 2</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">
                VDI 전문 기술지원
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-5">
                Citrix, Omnissa Horizon, VMware 기반 VDI 환경의 접속장애, 인증서, 프로파일,
                UAG/Gateway, vSphere 연계 문제를 분석합니다.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700 mb-6 flex-1 kr-keep-all">
                {[
                  "Citrix Virtual Apps and Desktops",
                  "Omnissa Horizon",
                  "VMware vSphere / ESXi / vCenter",
                  "UAG·Gateway·인증서·DNS",
                  "FSLogix·프로파일·VDA·Agent",
                  "장애보고서·작업계획서·운영보고서",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-indigo-500 flex-shrink-0">·</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/services/vdi-support"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:translate-x-0.5 transition-transform mt-auto"
              >
                VDI 기술지원 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Section 3. 주요 서비스 3개 ========== */}
      <section id="services" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Services
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            주요 서비스
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                title: "전산통합유지보수",
                body: "전산 담당자가 없거나, 담당자가 퇴사했거나, PC·서버·백업·네트워크 문제를 어디에 맡겨야 할지 애매한 회사를 지원합니다. 단순 출장 수리보다 현재 운영 상태를 먼저 정리합니다.",
                sub: "PC, 서버, NAS, 백업, 네트워크, 계정·권한을 확인하고 월간 점검표로 남깁니다.",
                href: "/services/it-maintenance",
                color: "#2563eb",
                text: "text-blue-700",
              },
              {
                title: "Acronis 백업·복구보안",
                body: "백업 성공률보다 중요한 것은 실제 복구 가능성입니다. 서버와 PC 데이터를 Acronis Cyber Protect 기반으로 보호하고, 장애나 랜섬웨어 상황에서 복구 가능한지 확인합니다.",
                sub: "백업 정책, 실패 이력, 복구 테스트 결과를 보고서로 정리합니다.",
                href: "/services/acronis-backup",
                color: "#059669",
                text: "text-emerald-700",
              },
              {
                title: "VDI 기술지원 및 유지보수",
                body: "Citrix Virtual Apps and Desktops, Omnissa Horizon, VMware 기반 VDI 운영환경의 접속장애, 로그인 지연, 프로파일, 인증서, UAG/Gateway, vSphere 연계 문제를 운영 관점에서 분석합니다.",
                sub: "장애보고서·작업계획서·완료보고서를 제출 가능한 형태로 작성합니다.",
                href: "/services/vdi-support",
                color: "#4f46e5",
                text: "text-indigo-700",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                style={{ borderTop: `4px solid ${s.color}` }}
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-3">
                  {s.body}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed kr-keep-all mb-5 flex-1">
                  {s.sub}
                </p>
                <Link
                  href={s.href}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${s.text} hover:translate-x-0.5 transition-transform mt-auto`}
                >
                  자세히 보기 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Section 4. 문제 제기 ========== */}
      <section className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-amber-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Field Issues
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            운영 문제는 대개 경계에서 터집니다.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {operationalIssues.map((issue, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 leading-snug kr-keep-all">
                  {issue.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {issue.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Section 5. 다루는 영역 ========== */}
      <section id="support-areas" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Technical Support
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            다루는 영역
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            운영 중인 환경을 기준으로 봅니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {supportAreas.map((area) => {
              const c = supportAccent[area.accent];
              return (
                <div
                  key={area.id}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                  style={{ borderTop: `4px solid ${c.border}` }}
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 kr-keep-all">
                    {area.brand}
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-700 mb-5 flex-1">
                    {area.lines.map((line) => (
                      <p key={line} className="leading-relaxed kr-keep-all">
                        {line}
                      </p>
                    ))}
                  </div>
                  <Link
                    href={`/contact?source=support-area&interest=${area.id}`}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} hover:translate-x-0.5 transition-transform`}
                  >
                    문의하기 →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== Section 6. 유지보수 ========== */}
      <section id="maintenance" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-indigo-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Maintenance
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            필요한 방식에 맞춰 지원합니다.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {maintenancePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
                style={{ borderLeft: `4px solid ${MAINT_ACCENT.border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded">
                    {pkg.no}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">
                  {pkg.title}
                </h3>
                <div className="space-y-1.5 text-sm text-gray-700 mb-5 flex-1">
                  {pkg.lines.map((line) => (
                    <p key={line} className="leading-relaxed kr-keep-all">
                      {line}
                    </p>
                  ))}
                </div>
                <Link
                  href={`/contact?source=maintenance&interest=${pkg.id}`}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${MAINT_ACCENT.link} hover:translate-x-0.5 transition-transform mt-auto`}
                >
                  상담하기 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Section 7. 왜 마이로켓인가 ========== */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Why Myloket
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            왜 마이로켓인가
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            제품보다 운영 상황을 먼저 봅니다.
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
      <section id="engagements" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-emerald-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Engagements
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            수행 경험
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            운영 현장에서 다룬 사례들입니다.
          </p>

          <CustomerShowcase variant="compact" />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              "중앙행정기관 VDI 운영 지원",
              "정부출연연구기관 Horizon 유지보수",
              "공공기관 망분리 VDI 환경 지원",
              "연구기관 백업·DR 점검",
              "VDI 스토리지 이관",
              "UAG·Gateway 접속장애 대응",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-2.5 p-4 bg-white rounded-xl border border-gray-200"
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

      {/* ========== Section 7. 진행 프로세스 ========== */}
      <section id="process" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-slate-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            문의 후 진행 절차
          </h2>

          <ol className="space-y-3 sm:space-y-4">
            {supportProcess.map((step) => (
              <li
                key={step.no}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex sm:flex-col sm:items-start items-center gap-2 sm:gap-1 sm:w-20 flex-shrink-0">
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

      {/* ========== Section 8. Contact ========== */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            VDI나 백업 문제가 있으면<br />
            제품명, 버전, 증상만 보내주세요.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            정기 유지보수, 장애 대응, 복구검증, SI 협업 문의를 받고 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact?source=home-bottom"
              className="px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 text-center"
            >
              기술지원 문의
            </Link>
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("[VDI/백업 기술지원 문의]")}`}
              className="px-7 py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all text-center"
            >
              메일로 보내기
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
