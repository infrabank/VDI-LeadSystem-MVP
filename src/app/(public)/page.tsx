import type { Metadata } from "next";
import Link from "next/link";
import { company, companyLegal, smbCustomers } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "마이로켓 | 중소기업 전산 유지보수 · 서버·네트워크·백업 · VDI 기술지원",
  },
  description:
    "서버, PC, 네트워크, 방화벽, 백업까지 중소기업 전산환경을 한 곳에서 관리합니다. " +
    "장애 원인을 끝까지 확인하고 직접 대응합니다. Citrix·Omnissa Horizon VDI 기술지원.",
};

const PHONE_DISPLAY = companyLegal.phone; // "010-3861-8079"
const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

/* ---------- S2. 문제 제기 ---------- */
const problems: { title: string; detail: string }[] = [
  {
    title: "PC·프린터·인터넷 문제가 반복됨",
    detail: "그때마다 업무가 멈춤. 임시 조치만 반복되고 원인은 남아 있음.",
  },
  {
    title: "서버·NAS·백업 상태를 확신할 수 없음",
    detail: "백업이 돌고 있는지, 실제 복구가 되는지 아무도 확인한 적 없음.",
  },
  {
    title: "전산 담당자가 없거나 혼자임",
    detail: "문제가 생기면 총무팀이 검색부터 시작함.",
  },
  {
    title: "문제마다 다른 업체에 연락해야 함",
    detail: "네트워크는 A업체, 서버는 B업체, 프린터는 C업체. 서로 책임을 미룸.",
  },
  {
    title: "장애 원인을 설명해 주는 사람이 없음",
    detail: "“재부팅했더니 됐어요”가 보고의 전부임.",
  },
  {
    title: "기존 유지보수 업체의 대응이 느림",
    detail: "전화는 받지만 방문은 다음 주임.",
  },
];

/* ---------- S3. 서비스 5 ---------- */
const services: {
  title: string;
  oneLiner: string;
  items: string[];
  href: string;
  linkLabel: string;
}[] = [
  {
    title: "전산 통합 유지보수",
    oneLiner: "회사 전산환경 전체를 정기 관리함",
    items: [
      "월 정기 점검 + 장애 시 대응",
      "PC, 서버, 네트워크, 프린터 통합 관리",
      "계정·권한·공유폴더 정리",
      "점검표·운영 보고서 제공",
      "원격 + 방문 지원",
    ],
    href: "/services/it-maintenance",
    linkLabel: "자세히 보기",
  },
  {
    title: "서버·네트워크·방화벽 관리",
    oneLiner: "회사 인프라 핵심을 점검·관리함",
    items: [
      "Windows·Linux 서버 관리",
      "Active Directory·계정 관리",
      "공유기·스위치·방화벽 점검",
      "인터넷 장애 원인 분석",
      "VPN 구성·점검",
    ],
    href: "/contact?source=home-services&interest=server-network&subject=서버·네트워크·방화벽 점검 문의",
    linkLabel: "점검 문의하기",
  },
  {
    title: "PC·프린터·업무환경 장애 대응",
    oneLiner: "업무를 멈추는 문제를 빠르게 대응함",
    items: [
      "PC 장애·교체·세팅",
      "프린터·복합기 연결 문제 해결",
      "공유폴더·권한 문제 해결",
      "메일·도메인·DNS 문제 대응",
      "원격 우선, 필요 시 방문",
    ],
    href: "/contact?source=home-services&interest=pc-support&subject=PC·업무환경 장애 문의",
    linkLabel: "장애 문의하기",
  },
  {
    title: "백업·보안 점검",
    oneLiner: "사고 전에 복구 가능성을 확인함",
    items: [
      "백업 정책·실패 이력 점검",
      "Acronis 백업 운영 지원 (서버·PC·NAS)",
      "Vinchin 가상화 VM 백업 운영 지원",
      "랜섬웨어 대비 백업 구조 점검",
      "방화벽 정책·외부 노출 점검",
    ],
    href: "/services/acronis-backup",
    linkLabel: "자세히 보기",
  },
  {
    title: "가상 데스크톱(VDI) 기술지원",
    oneLiner: "Citrix·Horizon 가상 데스크톱 구축·장애 대응 지원함",
    items: [
      "Citrix Virtual Apps and Desktops",
      "Omnissa(VMware) Horizon",
      "접속·인증서·프로파일·세션 장애 분석",
      "VDI 구축·전환·성능 점검",
      "SI 프로젝트 기술지원",
    ],
    href: "/services/vdi-support",
    linkLabel: "자세히 보기",
  },
];

/* ---------- S4. 왜 마이로켓인가 ---------- */
const whyMyloket: { title: string; detail: string }[] = [
  {
    title: "상담한 사람이 직접 작업함",
    detail: "영업 따로, 기사 따로 없음. 처음 통화한 엔지니어가 끝까지 대응함.",
  },
  {
    title: "전체 흐름으로 진단함",
    detail: "서버, PC, 네트워크, 방화벽을 따로 보지 않음. 문제의 경로를 처음부터 끝까지 확인함.",
  },
  {
    title: "원인과 재발 가능성까지 확인함",
    detail: "단순 복구로 끝내지 않음. 왜 발생했는지, 또 발생할지 정리해서 설명함.",
  },
  {
    title: "장비 교체보다 개선을 먼저 제안함",
    detail: "불필요한 구매 권유 없음. 현재 환경에서 가능한 조치를 우선함.",
  },
  {
    title: "VDI 프로젝트급 경험으로 중소기업 전산을 봄",
    detail: "공공기관·대기업 현장에서 다룬 기준을 중소기업 환경에 맞게 적용함.",
  },
  {
    title: "조치 내역을 기록으로 남김",
    detail: "무엇을 왜 했는지 점검표와 보고서로 정리함. 담당자가 바뀌어도 이력이 남음.",
  },
];

/* ---------- S5. 경험 카드 ---------- */
const experienceCards: { title: string; detail: string }[] = [
  {
    title: "서버·네트워크·PC 통합 유지보수",
    detail: "사내 전산 담당 공백이 있는 제조기업. 서버, 네트워크, PC 장애를 한 창구에서 대응 중임.",
  },
  {
    title: "백업 구조 점검·개선",
    detail: "백업 여부를 확인할 수 없던 환경. 백업 정책을 재정리하고 복구 가능 상태를 정기 확인함.",
  },
  {
    title: "반복 장애 원인 분석",
    detail: "업체를 바꿔도 반복되던 네트워크 장애. 구간별 진단으로 원인을 특정하고 재발을 차단함.",
  },
];

/* ---------- S6. 진행 방식 ---------- */
const processSteps: { no: string; title: string; detail: string }[] = [
  { no: "01", title: "문의 접수", detail: "전화·이메일·폼. 지금 겪는 문제만 적으면 됨." },
  { no: "02", title: "현황 확인", detail: "전화 또는 방문으로 현재 전산환경 파악. 비용 없음." },
  { no: "03", title: "점검·제안", detail: "문제 원인, 필요한 조치, 우선순위를 정리해서 제시함." },
  { no: "04", title: "조치·보고", detail: "합의된 범위만 작업. 결과는 보고서로 남김." },
  { no: "05", title: "유지보수 계약 (선택)", detail: "정기 점검이 필요하면 월 단위 계약 제안. 단발 대응도 가능함." },
];

/* ---------- S7. VDI ---------- */
const vdiScope: { platform: string; area: string }[] = [
  { platform: "Citrix Virtual Apps and Desktops", area: "접속 장애·세션 문제 분석" },
  { platform: "Omnissa Horizon (구 VMware Horizon)", area: "인증서·UAG/Gateway 문제 대응" },
  { platform: "VMware vSphere / ESXi / vCenter 연계", area: "프로파일(FSLogix)·로그인 지연 분석" },
  { platform: "VDI 구축·전환 지원", area: "성능 점검·운영환경 진단" },
];

const vdiEngagements: string[] = [
  "중앙행정기관 VDI 구축·운영·유지보수 지원",
  "정부출연연구기관 Horizon 유지보수",
  "공공기관 망분리 VDI 환경 지원",
  "VDI 스토리지 이관, UAG·Gateway 접속장애 대응",
];

export default function HomePage() {
  return (
    <div>
      {/* ========== S1. Hero ========== */}
      <section className="bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <p className="inline-flex items-center gap-2 text-slate-300 font-semibold text-xs sm:text-sm mb-5 sm:mb-6 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-slate-400 inline-block" />
            IT Maintenance · Server · Network · Backup · VDI
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            서버부터 PC까지,<br />
            회사 전산 한 곳에서 관리함
          </h1>
          <p className="text-base sm:text-lg text-slate-200 mb-6 sm:mb-7 max-w-2xl leading-relaxed kr-keep-all">
            전산 담당자가 없어도 됩니다.<br className="hidden sm:block" />
            장애 대응, 정기 점검, 백업·보안까지 직접 진단하고 직접 대응함.
          </p>
          <p className="text-sm sm:text-base text-slate-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed kr-keep-all border-l-2 border-blue-400/60 pl-4">
            공공기관·대기업 가상 데스크톱(VDI) 환경을 구축·운영·유지보수해 온 엔지니어가 직접 봅니다.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/contact?source=home-hero&interest=it-maintenance&subject=전산환경 점검 문의"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 text-center"
            >
              전산환경 점검 문의
            </Link>
            <a
              href={PHONE_TEL}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition-all text-center"
            >
              ☎ {PHONE_DISPLAY} 바로 통화
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mt-5">
            문의 후 1영업일 내 회신 · 상담만 받아도 됨
          </p>
        </div>
      </section>

      {/* ========== S2. 문제 제기 ========== */}
      <section className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Field Issues
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            이런 상황이면 연락 주세요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {problems.map((p) => (
              <div
                key={p.title}
                className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 leading-snug kr-keep-all">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm sm:text-base text-gray-700 kr-keep-all">
              하나라도 해당되면, 현재 전산환경부터 점검함.
            </p>
            <Link
              href="/contact?source=home-problems&subject=전산환경 점검 문의"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform"
            >
              점검 문의하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== S3. 서비스 ========== */}
      <section id="services" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Services
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            맡길 수 있는 일
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            서버부터 프린터까지, 한 회사 전산환경 전체를 봄.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-sm font-medium text-blue-700 mb-4 kr-keep-all">{s.oneLiner}</p>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-5 flex-1 kr-keep-all">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-blue-500 flex-shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform mt-auto"
                >
                  {s.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== S4. 왜 마이로켓인가 ========== */}
      <section id="why" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Why Myloket
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            일반 유지보수 업체와 다른 점
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {whyMyloket.map((t, i) => (
              <div key={t.title} className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white">
                <p className="text-xs font-bold text-blue-700 tracking-widest mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base font-bold text-gray-900 mb-2 kr-keep-all">{t.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{t.detail}</p>
              </div>
            ))}
          </div>

          {/* 신뢰 시각화 — 사람(엔지니어 프로필)과 기록(보고서 양식) */}
          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* 엔지니어 프로필 카드 */}
            <div className="flex flex-col p-6 sm:p-7 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs font-bold text-blue-700 tracking-widest uppercase mb-4">
                Engineer
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  제
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">제현우</p>
                  <p className="text-sm text-gray-600">대표 · 수석 기술지원 엔지니어</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all mb-4">
                공공기관·대기업 VDI 프로젝트와 중소기업 전산환경을 함께 다뤄온 엔지니어.
                상담 전화를 받는 사람과 현장에서 작업하는 사람이 같음.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["서버·네트워크·방화벽", "Acronis·Vinchin 백업·복구", "Citrix·Horizon VDI"].map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform mt-auto"
              >
                엔지니어 소개 보기 →
              </Link>
            </div>

            {/* 점검 보고서 양식 미리보기 */}
            <div className="flex flex-col p-6 sm:p-7 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs font-bold text-blue-700 tracking-widest uppercase mb-4">
                Monthly Report
              </p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 mb-4 flex-1">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-2.5 mb-3">
                  <p className="text-sm font-bold text-gray-900">월간 전산 점검 보고서</p>
                  <p className="text-[11px] text-gray-400">양식 예시</p>
                </div>
                <ul className="space-y-2">
                  {[
                    { item: "서버 상태·이벤트 로그 점검", status: "정상", warn: false },
                    { item: "백업 성공률·복구 테스트", status: "확인", warn: false },
                    { item: "방화벽 정책·외부 노출 점검", status: "개선 권고", warn: true },
                    { item: "NAS 용량·디스크 상태", status: "정상", warn: false },
                    { item: "Windows 보안 업데이트", status: "적용", warn: false },
                  ].map((row) => (
                    <li key={row.item} className="flex items-center justify-between gap-3 text-xs sm:text-[13px]">
                      <span className="text-gray-700 kr-keep-all">{row.item}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold flex-shrink-0 ${
                          row.warn
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600 kr-keep-all">
                무엇을 점검했고 무엇을 조치했는지 매월 이 형식으로 남김.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== S5. 고객사·경험 ========== */}
      <section id="engagements" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Customers
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 kr-keep-all">
            실제 기업 전산환경을 관리하고 있습니다
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed kr-keep-all">
            제조·유통·사무환경 기반 중소기업의 전산 유지보수를 수행 중임.
          </p>

          {/* 고객사 텍스트 스트립 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 md:mb-12">
            {smbCustomers.map((c, i) => (
              <span key={c.code} className="flex items-center gap-3">
                {i > 0 && <span className="text-gray-300">·</span>}
                <span className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
                  {c.name}
                </span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {experienceCards.map((card) => (
              <div key={card.title} className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-2 kr-keep-all">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-gray-600 kr-keep-all">
              공공기관·대기업 VDI 프로젝트 수행 경험은 아래 VDI 기술지원에서 확인할 수 있음.
            </p>
            <Link
              href="/contact?source=home-customers&subject=유지보수 상담"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform"
            >
              유지보수 상담하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== S6. 진행 방식 ========== */}
      <section id="process" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 md:mb-12 kr-keep-all">
            문의하면 이렇게 진행됨
          </h2>

          <ol className="space-y-3 sm:space-y-4">
            {processSteps.map((step) => (
              <li
                key={step.no}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex sm:flex-col sm:items-start items-center gap-2 sm:gap-1 sm:w-20 flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-700">{step.no}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 kr-keep-all">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm sm:text-base text-gray-700 kr-keep-all">
            계약을 전제로 하지 않음. 점검 결과만 받고 판단해도 됨.
          </p>
        </div>
      </section>

      {/* ========== S7. VDI 전문 기술지원 ========== */}
      <section id="vdi" className="bg-slate-900 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            VDI Technical Support
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            가상 데스크톱(VDI)은 전문 영역으로 따로 지원합니다
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-3 max-w-3xl leading-relaxed kr-keep-all">
            VDI는 직원 PC 업무화면을 서버에서 통합 운영하는 가상 데스크톱 환경임. 공공기관 망분리,
            금융권, 재택근무 환경에서 주로 사용됨.
          </p>
          <p className="text-sm sm:text-base text-slate-200 mb-10 md:mb-12 max-w-3xl leading-relaxed kr-keep-all">
            공공기관·대기업 현장에서 Citrix·Omnissa Horizon VDI를 구축·운영·유지보수해 온
            엔지니어가 직접 대응함. SI 프로젝트 협업, VDI 운영 고객사 장애 대응, 프로젝트 단위
            기술지원.
          </p>

          {/* 지원 범위 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-10">
            {vdiScope.map((row) => (
              <div
                key={row.platform}
                className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl"
              >
                <p className="text-sm sm:text-base font-semibold text-white mb-1 kr-keep-all">
                  {row.platform}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 kr-keep-all">{row.area}</p>
              </div>
            ))}
          </div>

          {/* 수행 경험 */}
          <div className="mb-10">
            <p className="text-xs font-bold text-blue-300 tracking-widest uppercase mb-4">
              Engagements
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-200">
              {vdiEngagements.map((line) => (
                <li key={line} className="flex gap-2 kr-keep-all">
                  <span className="text-blue-400 flex-shrink-0">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-300 mb-6 kr-keep-all">
            프로젝트 단위 투입, 장애보고서·작업계획서·완료보고서 제출 가능함.
          </p>

          <Link
            href="/contact?source=home-vdi&interest=vdi&subject=VDI 기술지원 문의"
            className="inline-block px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition-all"
          >
            VDI 기술지원 문의
          </Link>
        </div>
      </section>

      {/* ========== S8. 문의 ========== */}
      <section id="contact-cta" className="scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 kr-keep-all">
            지금 겪는 문제만 말씀해 주세요
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            증상, 장비, 상황 중 아는 것만 적으면 됨. 나머지는 통화로 확인함.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={PHONE_TEL}
              className="px-7 py-3.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold text-sm sm:text-base transition-all text-center"
            >
              ☎ {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact?source=home-bottom"
              className="px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 text-center"
            >
              점검 문의 보내기
            </Link>
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("[전산환경 점검 문의]")}`}
              className="px-7 py-3.5 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50 font-semibold text-sm sm:text-base transition-all text-center"
            >
              메일로 보내기
            </a>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            영업 전화 돌리지 않음 · 문의 내용 확인 후 1영업일 내 직접 회신함 · {company.email}
          </p>
        </div>
      </section>
    </div>
  );
}
