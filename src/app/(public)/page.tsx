import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  company,
  companyLegal,
  customers,
  customerDisplayName,
  customerCategoryLabel,
  smbCustomers,
  partnerships,
  engineerCredentials,
  leadership,
  maintenancePackages,
  supportProcess,
  operationalIssues,
  type CustomerCategory,
} from "@/lib/site-config";
import { PartnerBadge } from "./PartnerBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute: "Citrix·Omnissa Horizon VDI 기술지원·전산 유지보수 | 마이로켓",
  },
  description:
    "공공기관·연구기관 가상 데스크톱(VDI)을 구축·운영·유지보수해 온 엔지니어가 " +
    "서버·네트워크·백업까지 기업 전산환경 전체를 관리합니다. " +
    "Citrix·Omnissa Horizon VDI 기술지원, Acronis·Vinchin 백업 복구검증.",
};

const PHONE_DISPLAY = companyLegal.phone;
const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

const founder = leadership[0];
const vbtp = engineerCredentials.find((c) => c.code === "VBTP");

// public/team/{photoFile} 존재 시 사진 노출, 없으면 이니셜 아바타 폴백 (LeaderCard와 동일 패턴)
const founderHasPhoto =
  !!founder.photoFile &&
  existsSync(path.join(process.cwd(), "public", "team", founder.photoFile));

/* ---------- 히어로 팩트 라인 (검증 가능한 사실만) ---------- */
const heroFacts: string[] = [
  "공공·연구기관 VDI 수행 10여 곳",
  "Acronis 파트너 · Vinchin Silver Partner",
  "벤더 공식 기술자격 VBTP 보유",
];

/* ---------- 사업 영역 4 ---------- */
const businessAreas: {
  title: string;
  oneLiner: string;
  items: string[];
  href: string;
  linkLabel: string;
}[] = [
  {
    title: "가상 데스크톱(VDI) 구축·기술지원",
    oneLiner: "Citrix·Omnissa Horizon 전문 영역",
    items: [
      "Citrix Virtual Apps and Desktops 구축·장애 대응",
      "Omnissa Horizon · UAG · vSphere 연계",
      "접속·인증서·프로파일(FSLogix)·세션 장애 분석",
      "VDI 전환·성능 점검, SI 프로젝트 기술지원",
    ],
    href: "/services/vdi-support",
    linkLabel: "VDI 기술지원 보기",
  },
  {
    title: "전산 통합 유지보수",
    oneLiner: "서버부터 PC까지 정기 점검·장애 대응",
    items: [
      "월 정기 점검 + 장애 시 대응",
      "PC·서버·네트워크·프린터 통합 관리",
      "계정·권한·공유폴더 정리",
      "점검표·운영 보고서 제공, 원격 + 방문 지원",
    ],
    href: "/services/it-maintenance",
    linkLabel: "유지보수 서비스 보기",
  },
  {
    title: "백업·복구검증",
    oneLiner: "백업 성공이 아니라 실제 복구 가능성을 확인",
    items: [
      "Acronis Cyber Protect 운영 (서버·PC·NAS)",
      "Vinchin 가상화 VM 백업·즉시 복구",
      "랜섬웨어 대비 백업 구조 점검",
      "정기 복구 테스트와 결과 보고서",
    ],
    href: "/services/acronis-backup",
    linkLabel: "백업·복구검증 보기",
  },
  {
    title: "서버·네트워크·방화벽 관리",
    oneLiner: "기업 인프라 핵심을 점검·관리",
    items: [
      "Windows·Linux 서버 관리",
      "Active Directory·계정 관리",
      "스위치·방화벽 정책·외부 노출 점검",
      "VPN 구성·인터넷 장애 원인 분석",
    ],
    href: "/contact?source=home-business&interest=server-network&subject=서버·네트워크·방화벽 점검 문의",
    linkLabel: "서버·네트워크 점검 문의",
  },
];

/* ---------- 수행 실적 ---------- */
const categoryOrder: CustomerCategory[] = ["public", "research", "private"];

const categoryCount = (cat: CustomerCategory) =>
  customers.filter((c) => c.category === cat).length;

const categoryNote: Record<CustomerCategory, string> = {
  public: "중앙행정기관·지방자치단체 VDI 구축·운영·유지보수 지원",
  research: "정부출연연구기관 Horizon·Citrix 환경 유지보수",
  private: "제조·유통 중소기업 전산 통합 유지보수",
};

/** 벤더·규모·역할이 공개된 대표 수행 사례 */
const featuredEngagements = customers.filter(
  (c) => c.vendor && c.category !== "private",
);

/* ---------- 방문자 3경로 분기 (hero 직후) ---------- */
const visitorPaths: {
  title: string;
  audience: string;
  bullets: string[];
  href: string;
  cta: string;
  afterClick: string;
}[] = [
  {
    title: "VDI 장애·기술지원",
    audience: "Citrix·Omnissa Horizon 운영 담당자",
    bullets: [
      "접속 실패 · 로그인 지연 · 프로파일 미로드",
      "UAG·Gateway·인증서 · vSphere 연계 장애",
    ],
    href: "/services/vdi-support",
    cta: "VDI 장애 원인 상담",
    afterClick: "제품명·버전·증상만 보내면 1영업일 내 1차 원인 구분을 회신합니다.",
  },
  {
    title: "전산 통합 유지보수",
    audience: "중소·중견기업 전산 담당자",
    bullets: [
      "PC·서버·네트워크·백업 통합 관리",
      "월 정기 점검 + 장애 시 대응 · 보고서 제공",
    ],
    href: "/services/it-maintenance",
    cta: "월간 유지보수 상담",
    afterClick: "현재 환경과 불편한 문제만 알려주시면 점검 방향을 회신합니다.",
  },
  {
    title: "SI 프로젝트 협업",
    audience: "SI·통합유지보수 사업 담당자",
    bullets: [
      "VDI·가상화·백업 전문 영역 비상주 참여",
      "제안 단계 기술 검토 · 공공기관 제출 산출물",
    ],
    href: "/partners/integrated-maintenance",
    cta: "SI 프로젝트 협업 문의",
    afterClick: "사업 개요와 필요한 기술 영역을 알려주시면 참여 범위를 회신합니다.",
  },
];

/* ---------- SI 협업 ---------- */
const siCollaboration: string[] = [
  "전산통합유지보수 사업 내 VDI·가상화·백업 전문 영역 담당",
  "비상주 정기 점검·장애 분석·패치/업그레이드 검토",
  "장애보고서·작업계획서·완료보고서 등 산출물 제출",
  "제안·견적 단계 기술 검토 지원, 제안서 기술지원 파트너 참여",
];

/* ---------- 아이콘 ---------- */
function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* ========== S1. Hero + 방문자 경로 분기 ==========
          경로 카드를 별도 섹션으로 두면 "문의하라" 직후에 "당신은 셋 중 누구냐"로
          재분류를 요구하게 되므로, 첫 화면 안에서 한 번에 분기시킨다. */}
      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              <h1 className="text-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6 sm:mb-8 leading-[1.12] kr-keep-all">
                VDI 구축·기술지원부터<br />
                전산 통합 유지보수까지
              </h1>
              <p className="text-base sm:text-lg text-slate-200 mb-6 sm:mb-7 max-w-2xl leading-relaxed kr-keep-all">
                중앙행정기관·정부출연연구기관의 가상 데스크톱(VDI) 환경을 구축·운영·유지보수해 온
                엔지니어가 서버·네트워크·백업까지 기업 전산환경 전체를 관리합니다.
              </p>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-8 sm:mb-10 text-sm text-slate-300">
                {heroFacts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 kr-keep-all">
                    <span className="w-1 h-1 rounded-full bg-blue-400 inline-block flex-shrink-0" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/contact?source=home-hero&subject=유지보수·기술지원 상담 문의"
                  className="px-6 sm:px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-[0_8px_20px_-6px_rgba(120,53,15,0.55)] hover:-translate-y-0.5 text-center"
                >
                  유지보수·기술지원 문의
                </Link>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base text-center"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {PHONE_DISPLAY} 바로 통화
                </a>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-5">
                문의 후 1영업일 내 회신 · 상담만 받아도 됩니다
              </p>
            </div>

            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-slate-300 mb-4 kr-keep-all">
                어떤 도움이 필요하신가요?
              </p>
              <div className="space-y-2.5">
                {visitorPaths.map((path) => (
                  <Link
                    key={path.title}
                    href={path.href}
                    className="group block rounded-lg border border-white/15 bg-white/[0.07] p-4 sm:p-5 hover:bg-white/[0.13] hover:border-white/35"
                  >
                    <p className="text-[11px] font-semibold text-blue-300 mb-1 kr-keep-all">
                      {path.audience}
                    </p>
                    <p className="text-base font-bold text-white mb-1.5 kr-keep-all">
                      {path.title}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed kr-keep-all">
                      {path.bullets[0]}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      {path.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed kr-keep-all">
                {visitorPaths[0].afterClick}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 공식 파트너 스트립 ==========
          로고 노출은 여기 한 번으로 끝내고, S6은 인증서 실물과 자격 정보만 다룬다. */}
      <section className="bg-gray-50/60 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
          <p className="text-xs font-semibold text-gray-500 tracking-widest text-center mb-5">
            공식 파트너
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {partnerships.map((p) => (
              <PartnerBadge key={p.name} partner={p} variant="strip" />
            ))}
          </div>
        </div>
      </section>

      {/* ========== S2. 사업 영역 ========== */}
      <section id="business" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-base font-bold text-gray-900 mb-3 kr-keep-all">
            무엇을 맡길 수 있는지 확인하세요
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            VDI 전문 기술지원과 전산 통합 유지보수, 두 축으로 기업·기관 IT 환경을 지원합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {businessAreas.map((area) => (
              <div
                key={area.title}
                className="flex flex-col bg-white rounded-xl border border-gray-200 p-6 sm:p-7"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 kr-keep-all">
                  {area.title}
                </h3>
                <p className="text-sm font-medium text-blue-700 mb-4 kr-keep-all">{area.oneLiner}</p>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-5 flex-1 kr-keep-all">
                  {area.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-blue-500 flex-shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={area.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform mt-auto"
                >
                  {area.linkLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== S3. 대응하는 문제 ========== */}
      <section id="issues" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-base font-bold text-gray-900 mb-3 kr-keep-all">
            운영 현장에서 실제로 마주치는 문제를 대응합니다
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            증상만 알려주시면 됩니다. 원인 구분부터 조치·재발 방지까지 정리해 드립니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {operationalIssues.map((issue) => (
              <div
                key={issue.title}
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

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm sm:text-base text-gray-700 kr-keep-all">
              비슷한 증상이 있다면 현재 환경부터 점검해 드립니다.
            </p>
            <Link
              href="/contact?source=home-issues&subject=전산환경 점검 문의"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform"
            >
              현재 증상 상담하기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== S4. 수행 실적 ========== */}
      <section id="engagements" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-lead text-gray-900 mb-4 kr-keep-all">
            공공기관·연구기관 VDI를 수행해 왔습니다
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            중앙행정기관·정부출연연구기관의 VDI 구축·운영·유지보수 지원과 함께,
            민간 중소기업의 전산 통합 유지보수를 수행 중입니다.
          </p>

          {/* 카테고리별 수행 현황 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-10">
            {categoryOrder.map((cat) => (
              <div key={cat} className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                  {categoryCount(cat)}
                  <span className="text-base font-semibold text-gray-500 ml-1">곳</span>
                </p>
                <p className="text-sm font-bold text-gray-900 mb-1.5 kr-keep-all">
                  {customerCategoryLabel[cat]}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {categoryNote[cat]}
                </p>
              </div>
            ))}
          </div>

          {/* 대표 수행 사례 (벤더·규모·역할 공개) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10">
            {featuredEngagements.map((c) => (
              <div key={c.code} className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-900 mb-3 kr-keep-all">
                  {customerDisplayName(c)}
                </p>
                <dl className="space-y-1.5 text-xs sm:text-[13px]">
                  {c.vendor && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-8">벤더</dt>
                      <dd className="text-gray-700 kr-keep-all">{c.vendor}</dd>
                    </div>
                  )}
                  {c.userScale && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-8">규모</dt>
                      <dd className="text-gray-700 kr-keep-all">{c.userScale}</dd>
                    </div>
                  )}
                  {c.role && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-8">역할</dt>
                      <dd className="text-gray-700 kr-keep-all">{c.role}</dd>
                    </div>
                  )}
                </dl>
                {c.solvedRisks && c.solvedRisks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {c.solvedRisks.map((r) => (
                      <span
                        key={r}
                        className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 kr-keep-all"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 민간 고객사 스트립 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex-shrink-0">
              전산 통합 유지보수 고객사
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {smbCustomers.map((c, i) => (
                <span key={c.code} className="flex items-center gap-3">
                  {i > 0 && <span className="text-gray-300">·</span>}
                  <span className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">
                    {c.name}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs sm:text-sm text-gray-500 kr-keep-all">
            기관명은 외부 표기 동의를 확인한 곳만 정식 명칭으로 표기합니다. 그 외에는 익명으로 표기합니다.
          </p>
        </div>
      </section>

      {/* ========== S5. 유지보수 운영 방식 ========== */}
      <section id="maintenance" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-base font-bold text-gray-900 mb-3 kr-keep-all">
            유지보수는 이렇게 운영합니다
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            월간 점검, 장애 대응, 운영 개선, 복구검증까지 네 가지 축으로 운영하고 결과는 보고서로 남깁니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-14">
            {maintenancePackages.map((pkg) => (
              <div key={pkg.id} className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-2 kr-keep-all">{pkg.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {pkg.lines.join(" ")}
                </p>
              </div>
            ))}
          </div>

          {/* 진행 프로세스 */}
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-5">
            진행 순서
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {supportProcess.map((step) => (
              <li key={step.no} className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200">
                <p className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">{step.no}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-1 kr-keep-all">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed kr-keep-all">{step.detail}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm sm:text-base text-gray-700 kr-keep-all">
            계약을 전제로 하지 않습니다. 점검 결과만 받고 판단하셔도 됩니다.
          </p>
        </div>
      </section>

      {/* ========== S6. 파트너십·기술자격 ========== */}
      <section id="partnership" className="scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-lead text-gray-900 mb-4 kr-keep-all">
            기술 파트너십과 검증 가능한 자격
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-10 md:mb-12 leading-relaxed kr-keep-all">
            다루는 솔루션의 공식 파트너십과 벤더 공식 기술자격을 인증번호까지 공개합니다.
          </p>

          {/* 자격을 문장으로만 적지 않고 실물 인증서를 그대로 보여준다.
              파트너 로고는 히어로 직후 스트립에서 이미 노출하므로 여기서 반복하지 않는다. */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-7 items-start">
            <figure className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_28px_-16px_rgba(16,24,40,0.25)]">
              <Image
                src="/credentials/vinchin-vbtp.jpg"
                alt="Vinchin Backup Technology Professional 인증서 실물"
                width={1400}
                height={884}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="w-full h-auto"
              />
              <figcaption className="px-4 sm:px-5 py-3 text-xs text-gray-600 border-t border-gray-200 kr-keep-all">
                벤더가 직접 발급한 인증서 원본입니다. 인증번호로 조회할 수 있습니다.
              </figcaption>
            </figure>

            <div className="lg:col-span-2">
              {vbtp && (
                <div className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                  <span className="inline-block px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-bold tracking-wide mb-4">
                    {vbtp.code}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5 kr-keep-all">{vbtp.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-4">{vbtp.desc}</p>
                  <dl className="space-y-1 text-xs text-gray-600 nums">
                    <div className="flex gap-2">
                      <dt className="w-14 flex-shrink-0 text-gray-500">보유자</dt>
                      <dd className="text-gray-800">{vbtp.holder}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-14 flex-shrink-0 text-gray-500">인증번호</dt>
                      <dd className="text-gray-800 break-all">{vbtp.certificateId}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-14 flex-shrink-0 text-gray-500">유효기간</dt>
                      <dd className="text-gray-800">{vbtp.validUntil}</dd>
                    </div>
                  </dl>
                </div>
              )}

              <Link
                href="/about/certifications"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                인증·파트너십 전체 보기
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== S7. 엔지니어 ========== */}
      <section id="engineer" className="bg-gray-50 border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-sub text-gray-900 mb-8 kr-keep-all">
            상담부터 작업까지, 엔지니어가 직접 합니다
          </h2>

          <div className="p-6 sm:p-8 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-4 mb-5">
              {founderHasPhoto ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image
                    src={`/team/${founder.photoFile}`}
                    alt={founder.name || founder.role}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {founder.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{founder.name}</p>
                <p className="text-sm text-gray-600">{founder.role}</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed kr-keep-all mb-5 max-w-3xl">
              {founder.bio}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {founder.expertise?.map((chip) => (
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
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform"
            >
              회사·엔지니어 소개 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== S8. SI·통합유지보수 협업 ========== */}
      <section id="si-partners" className="bg-slate-900 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-sub text-white mb-4 kr-keep-all">
            전산통합유지보수 사업의 VDI·가상화·백업 영역을 맡습니다
          </h2>
          <p className="text-sm sm:text-base text-slate-200 mb-10 max-w-3xl leading-relaxed kr-keep-all">
            공공기관 전산통합유지보수 사업에서 Citrix·Omnissa Horizon·VMware·Acronis 영역의
            비상주 전문 기술지원 파트너로 참여합니다. 상주 인력 파견이 아니라
            전문 영역 기술자문·정기 점검·장애 대응 중심입니다.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-200 mb-10">
            {siCollaboration.map((line) => (
              <li key={line} className="flex gap-2 kr-keep-all">
                <span className="text-blue-400 flex-shrink-0">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/contact?source=home-si&interest=integrated-maintenance&subject=전산통합유지보수 협업 문의"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition-all text-center"
            >
              통합유지보수 협업 문의
            </Link>
            <Link
              href="/partners/integrated-maintenance"
              className="inline-flex items-center justify-center gap-1.5 px-2 py-3 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors"
            >
              협업 구조 자세히 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== S9. 문의 ========== */}
      <section id="contact-cta" className="scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <h2 className="h-base font-bold text-gray-900 mb-4 kr-keep-all">
            지금 겪는 문제만 말씀해 주세요
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            증상, 장비, 상황 중 아는 것만 적으면 됩니다. 나머지는 통화로 확인합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold text-sm sm:text-base text-center"
            >
              <PhoneIcon className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact?source=home-bottom"
              className="px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-200 transition-all hover:-translate-y-0.5 text-center"
            >
              문의 보내기
            </Link>
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("[유지보수·기술지원 문의]")}`}
              className="px-7 py-3.5 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50 font-semibold text-sm sm:text-base transition-all text-center"
            >
              메일로 보내기
            </a>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            영업 전화 돌리지 않습니다 · 문의 내용 확인 후 1영업일 내 직접 회신합니다 · {company.email}
          </p>
        </div>
      </section>
    </div>
  );
}
