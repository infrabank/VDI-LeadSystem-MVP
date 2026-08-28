import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/partners/integrated-maintenance" },
  title: "전산통합유지보수 VDI·가상화 기술지원",
  description:
    "공공기관 전산통합유지보수 사업에서 Citrix, Omnissa Horizon, VMware vSphere, Acronis, Vinchin 영역의 비상주 기술지원, 정기점검, 장애분석, 운영보고서를 지원합니다.",
};

const CONTACT_TOP =
  "/contact?source=integrated-maintenance&interest=integrated-maintenance&subject=전산통합유지보수 협업 문의";
const CONTACT_BOTTOM =
  "/contact?source=integrated-maintenance-bottom&interest=integrated-maintenance&subject=전산통합유지보수 협업 문의";

const whenToWork = [
  "공공기관 전산통합유지보수 제안서에 VDI·가상화·백업 범위가 포함되어 있다.",
  "Citrix 또는 Omnissa Horizon 운영 경험자가 부족하다.",
  "VMware vSphere, ESXi, vCenter 기반 VDI 인프라 점검이 필요하다.",
  "백업은 운영 중이지만 실제 복구검증과 결과 보고서가 부족하다.",
  "월간 점검표, 장애보고서, 작업계획서, 완료보고서를 공공기관 제출 형식으로 정리해야 한다.",
  "고객 미팅에서 VDI·가상화·백업 관련 기술 질문에 대응할 사람이 필요하다.",
];

const scopeAreas = [
  {
    no: "01",
    title: "제안 전 RFP 기술요건 검토",
    desc: "VDI, 가상화, 백업, 인증서, 라이선스, 패치, 장애대응 요구사항을 확인하고 실제 운영 리스크와 견적 반영 항목을 정리합니다.",
  },
  {
    no: "02",
    title: "VDI 운영 지원",
    desc: "Citrix Virtual Apps and Desktops, Omnissa Horizon 환경의 접속장애, 로그인 지연, 프로파일, UAG/Gateway, 인증서, VDA/Agent 이슈를 분석합니다.",
  },
  {
    no: "03",
    title: "가상화 인프라 점검",
    desc: "VMware vSphere, ESXi, vCenter, 데이터스토어, 스냅샷, 리소스 사용률, 백업 영향도를 확인합니다. VDI 장애가 인프라 병목인지 제품 설정 문제인지 구분합니다.",
  },
  {
    no: "04",
    title: "백업·복구검증",
    desc: "Acronis Cyber Protect(서버·PC·NAS)와 Vinchin Backup & Recovery(가상화 VM) 기반 백업 정책, 실패 이력, 에이전트·VM 상태, 복구 테스트 결과를 점검합니다. 백업 성공 여부가 아니라 실제 복구 가능성을 확인합니다.",
  },
  {
    no: "05",
    title: "운영 산출물 작성",
    desc: "월간 점검 보고서, 장애보고서, 작업계획서, 완료보고서, 벤더 SR 정리 자료를 고객 제출 가능한 형태로 정리합니다.",
  },
];

const collaboration = [
  {
    label: "제안 단계",
    color: "var(--color-domain-managed)",
    desc: "RFP를 함께 검토하고, VDI·가상화·백업 범위의 리스크와 견적 기준을 정리합니다. 필요하면 고객 기술 미팅에 동행합니다.",
  },
  {
    label: "수주 후 운영 단계",
    color: "var(--color-domain-vdi)",
    desc: "월간 정기점검, 원격 장애 분석, 패치·인증서·라이선스 갱신 영향 검토, 운영 보고서 작성을 지원합니다.",
  },
  {
    label: "장애 발생 시",
    color: "var(--color-domain-backup)",
    desc: "로그와 설정을 기준으로 원인을 구분하고, 조치 방향과 고객 설명 자료를 정리합니다. 벤더 SR이 필요한 경우 케이스 요약과 회신 해석을 보조합니다.",
  },
];

const techAreas = [
  "Citrix Virtual Apps and Desktops",
  "Citrix StoreFront · Delivery Controller · VDA · NetScaler/Gateway",
  "Omnissa Horizon · Connection Server · UAG · Agent · Client",
  "VMware vSphere · ESXi · vCenter",
  "FSLogix · Citrix Profile Management",
  "Acronis Cyber Protect (서버·PC·NAS 백업)",
  "Vinchin Backup & Recovery (가상화 VM 백업·즉시 복구)",
  "인증서 · DNS · CRL · 외부접속 경로",
  "월간 점검표 · 장애보고서 · 작업계획서 · 완료보고서",
];

const outOfScope = [
  "전체 전산통합유지보수 총괄 수행",
  "상주 SM 인력 파견",
  "단순 PC 유지보수·헬프데스크",
  "정보통신공사업 면허가 필요한 공사의 단독 수행",
  "단순 라이선스 총판 영업",
  "보안 인증 신청 대행",
];

const packages = [
  {
    code: "A",
    title: "제안 검토 패키지",
    lines: [
      "RFP VDI·가상화·백업 범위 검토",
      "위험 항목, 기술지원 확약 필요 항목 정리",
      "견적 산정 기준 메모 제공",
      "고객 미팅 전 기술 질의 대응 준비",
    ],
  },
  {
    code: "B",
    title: "비상주 월간 운영지원",
    lines: [
      "월 1회 정기점검",
      "월간 점검 보고서",
      "운영 문의 및 장애 원격 대응",
      "패치, 인증서, 라이선스 영향 검토",
    ],
  },
  {
    code: "C",
    title: "통합유지보수 전문영역 파트너",
    lines: [
      "제안 단계 기술검토",
      "수주 후 VDI·가상화·백업 운영지원",
      "장애보고서, 작업계획서, 완료보고서 작성",
      "고객 기술 미팅 동행",
    ],
  },
];

export default function IntegratedMaintenancePage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-purple-600">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <Link href="/partners" className="hover:text-purple-600">SI 파트너</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">전산통합유지보수</span>
        </div>
      </div>

      {/* 안내 — 이 페이지는 SI 파트너 협업용 보조 페이지 */}
      <div className="bg-amber-50/60 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-sm text-gray-700 leading-relaxed kr-keep-all">
          이 페이지는 SI·주사업자와 함께 전산통합유지보수 또는 VDI 운영 사업을 수행할 때의 협업
          방식을 설명합니다. 일반 전산유지보수 문의는{" "}
          <Link href="/services/it-maintenance" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800">/services/it-maintenance</Link>,
          {" "}VDI 기술지원 문의는{" "}
          <Link href="/services/vdi-support" className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-800">/services/vdi-support</Link>
          를 참고해주세요.
        </div>
      </div>

      {/* ========== Hero ========== */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-600 via-blue-600 to-emerald-600 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            Integrated Maintenance — VDI · 가상화 · 백업
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            전산통합유지보수 사업을 위한<br className="hidden md:block" />
            <span className="md:hidden"> </span>VDI·가상화·백업 전문 기술지원
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-10 max-w-2xl">
            주사업자·SI 파트너가 공공기관 통합유지보수 범위 안에서 Citrix, Omnissa Horizon,
            VMware, Acronis, Vinchin 영역을 안정적으로 제안하고 운영할 수 있도록 비상주 전문 기술지원을 제공합니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={CONTACT_TOP}
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition"
            >
              전산통합유지보수 협업 문의
            </Link>
            <Link
              href="/partners"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
            >
              SI 파트너 협업 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 이런 상황에서 함께합니다 ========== */}
      <section className="border-b border-gray-100 bg-amber-50/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
            When to Work Together
          </p>
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900 mb-6 kr-keep-all">
            이런 상황에서 함께합니다
          </h2>
          <ul className="space-y-2.5">
            {whenToWork.map((t) => (
              <li
                key={t}
                className="flex gap-3 text-base text-gray-800 leading-relaxed kr-keep-all"
              >
                <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========== 맡을 수 있는 영역 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Scope of Work
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 kr-keep-all">
            맡을 수 있는 영역
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all">
            통합유지보수 사업 안에서 별도 운영 경험이 필요한 전문 영역을 맡습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scopeAreas.map((s) => (
              <div
                key={s.no}
                className="p-5 rounded-xl bg-white border border-gray-200"
              >
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  {s.no}
                </span>
                <h3 className="text-base font-semibold text-gray-900 mt-1.5 mb-2 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 협업 방식 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            How We Work
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            협업 방식
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {collaboration.map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-xl bg-white border border-gray-200"
                style={{ borderTop: `4px solid ${c.color}` }}
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                  {c.label}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 지원 가능한 기술 영역 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Technical Coverage
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 kr-keep-all">
            지원 가능한 기술 영역
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 kr-keep-all">
            {techAreas.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden="true" className="text-gray-400 flex-shrink-0">·</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========== 제외 범위 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Out of Scope
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 kr-keep-all">
            제외 범위
          </h2>
          <p className="text-sm text-gray-500 mb-5 kr-keep-all max-w-3xl">
            아래 영역은 단독 수행하지 않습니다. 단, 위 사업 안에 포함된 VDI·가상화·백업
            전문영역의 비상주 기술지원은 협업 가능합니다.
          </p>
          <ul className="space-y-2.5 text-base text-gray-700 leading-relaxed kr-keep-all">
            {outOfScope.map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="text-gray-400 flex-shrink-0">—</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========== 패키지 예시 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Packages
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 kr-keep-all">
            패키지 예시
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all max-w-3xl">
            가격은 기관 환경, 시스템 수, 점검 주기, 장애대응 범위, 산출물 수준에 따라 협의합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <div
                key={pkg.code}
                className="flex flex-col p-5 rounded-xl bg-white border border-gray-200"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-slate-900 text-white text-sm font-bold mb-3">
                  {pkg.code}
                </span>
                <h3 className="text-base font-semibold text-gray-900 mb-3 kr-keep-all">
                  {pkg.title}
                </h3>
                <ul className="space-y-1.5 text-sm text-gray-700 kr-keep-all">
                  {pkg.lines.map((line) => (
                    <li key={line} className="flex gap-2 leading-relaxed">
                      <span aria-hidden="true" className="text-gray-400 flex-shrink-0">·</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 왜 마이로켓인가 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Why Myloket
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 kr-keep-all">
            왜 마이로켓인가
          </h2>
          <p className="text-base text-gray-700 leading-[1.85] kr-keep-all mb-4">
            공공기관·연구기관 VDI 운영 현장에서 실제로 발생하는 문제를 다년간 다뤄왔습니다.
            접속장애, 인증서, UAG/Gateway, 프로파일, 스토리지 병목, 백업 실패와 복구검증까지
            제품과 인프라 경계에서 발생하는 문제를 함께 봅니다.
          </p>
          <p className="text-base text-gray-700 leading-[1.85] kr-keep-all">
            대규모 통합유지보수 조직은 아닙니다. 대신 주사업자와 함께 움직이는 전문 기술지원
            파트너로서, 필요한 영역을 정확히 맡고 산출물로 정리합니다.
          </p>
        </div>
      </section>

      {/* ========== 문의 ========== */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            공고명, RFP, 대상 제품, 예상 역할만 보내주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            보내주시면 1영업일 내 검토 가능한 협업 범위를 회신드립니다.
          </p>
          <Link
            href={CONTACT_BOTTOM}
            className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5"
          >
            전산통합유지보수 협업 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
