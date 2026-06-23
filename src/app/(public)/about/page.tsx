import Link from "next/link";
import {
  company,
  supportAreas,
  partnerships,
  certifications,
  certificationStatusLabel,
  engineerCredentials,
  leadership,
} from "@/lib/site-config";
import { PartnerBadge } from "../PartnerBadge";
import { CustomerShowcase } from "../CustomerShowcase";
import { LeaderCard } from "../LeaderCard";

// Tailwind는 동적으로 생성된 클래스명을 purge할 수 없음 — 명시적 map.
const certBadgeClass: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  gray: "bg-gray-50 text-gray-600 border-gray-200",
};

export const metadata = {
  title: `About | ${company.name}`,
  description: company.description,
};

const responsibilityRows = [
  { area: "월간 점검", direct: "원격 점검과 상태 확인", partner: "현장 점검 동행 (필요 시)" },
  { area: "장애 원인 구분", direct: "로그 분석과 영역 분리", partner: "현장 운영자 인터뷰" },
  { area: "장애 대응", direct: "원인 분석과 조치 가이드", partner: "현장 조치·변경작업" },
  { area: "운영 개선", direct: "구성 진단과 개선안", partner: "변경작업 실행" },
  { area: "복구검증", direct: "테스트 설계와 리포트", partner: "복구 시연 데이터 수집" },
  { area: "벤더 SR 대응", direct: "케이스 정리와 회신 검토", partner: "벤더 채널 전달" },
  { area: "보고서·서명", direct: "제출 형식 보고서 작성", partner: "납품·인수 서명" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            About {company.name}
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            VDI와 백업 운영 장애를<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>직접 다루는 기술지원 회사
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mb-4 font-medium">
            {company.legalName} · {company.legalNameEn}
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed kr-keep-all">
            마이로켓은 공공기관·연구기관·기업의 VDI와 백업 운영 환경을 지원하는 기술지원 회사입니다.
            Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect, Vinchin Backup &amp; Recovery 환경에서 발생하는
            접속 장애, 인증서, 프로파일, 스토리지, 라이선스, 백업 복구 검증 이슈를 대표 엔지니어가 직접 대응합니다.
          </p>
        </div>
      </section>

      {/* Mission / Identity */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
              Our Mission
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 kr-keep-all">
              운영 장애를 직접 본 엔지니어가 대응합니다
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 kr-keep-all">
              마이로켓은 Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect,
              Vinchin Backup &amp; Recovery 환경의 기술지원·유지보수·복구 검증을 전문으로 합니다. 진단·설계는 대표 엔지니어가 직접 책임지고,
              대규모 구축은 검증된 파트너 컨소시엄과 함께 수행합니다.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all">
              VDI 접속 장애, FSLogix·프로파일 문제, UAG·인증서 이슈, 스토리지·네트워크 병목,
              백업 실패와 복구 검증까지. 구축 이후의 운영 문제를 패턴으로 분류해 같은 기준으로 대응합니다.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              핵심 기술지원 분야
            </p>
            <div className="space-y-3">
              {supportAreas.map((a) => {
                const dotColor: Record<string, string> = {
                  blue: "bg-blue-600",
                  indigo: "bg-indigo-600",
                  emerald: "bg-emerald-600",
                };
                const textColor: Record<string, string> = {
                  blue: "text-blue-700",
                  indigo: "text-indigo-700",
                  emerald: "text-emerald-700",
                };
                return (
                  <Link
                    key={a.id}
                    href="/#vdi"
                    className="block p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${dotColor[a.accent] || dotColor.blue}`}
                      ></span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${textColor[a.accent] || textColor.blue}`}
                      >
                        {a.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5 kr-keep-all">{a.brand}</h3>
                    <p className="text-xs text-gray-500 kr-keep-all">{a.lines[0]}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section id="leadership" className="bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Founder
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            대표 소개
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            공공·연구기관 10여 곳에서 VDI를 구축·운영·유지보수해 온 대표가 직접 기술지원·장애 분석·복구 검증을 수행합니다.
          </p>
          <div className="max-w-2xl mx-auto">
            {leadership.map((leader) => (
              <LeaderCard key={leader.slot} leader={leader} />
            ))}
          </div>
        </div>
      </section>

      {/* Responsibility — RACI 책임 분담 (1인 단일 장애점 우려 해소) */}
      <section id="responsibility" className="bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Responsibility
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            대표 직접 책임 + 검증된 파트너 컨소시엄
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 md:mb-12 max-w-2xl mx-auto kr-keep-all">
            분석·판단·산출물은 대표가 직접 맡고, 대규모 구축과 현장 상주는 파트너가 분담합니다.
          </p>

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 w-[28%]">구분</th>
                  <th className="px-4 py-3 font-semibold text-blue-700 w-[36%]">
                    마이로켓 직접 책임
                  </th>
                  <th className="px-4 py-3 font-semibold text-emerald-700 w-[36%]">
                    파트너 수행
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {responsibilityRows.map((row) => (
                  <tr key={row.area} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-gray-900 kr-keep-all">{row.area}</td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all">{row.direct}</td>
                    <td className="px-4 py-3 text-gray-700 kr-keep-all">{row.partner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {responsibilityRows.map((row) => (
              <div key={row.area} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-bold text-gray-900 mb-2 kr-keep-all">{row.area}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="font-semibold text-blue-700 flex-shrink-0">마이로켓</span>
                    <span className="text-gray-600 kr-keep-all">{row.direct}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-emerald-700 flex-shrink-0">파트너</span>
                    <span className="text-gray-600 kr-keep-all">{row.partner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-6 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            ※ 사업 규모와 계약 조건에 따라 단계별로 조정됩니다. 단일 장애점 리스크는 파트너로 분산합니다.
          </p>
        </div>
      </section>

      {/* Customers */}
      <section id="customers" className="bg-white border-y border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Customers
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            구축·운영·유지보수 지원 고객사
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            공공·연구기관과 민간 기업의 VDI·백업 환경을 함께 지원해 왔습니다.
          </p>
          <CustomerShowcase variant="grouped" />
          <p className="text-xs text-gray-400 text-center mt-8 kr-keep-all">
            ※ 일부 기관명은 기관 정책에 따라 외부 표기 수준이 조정될 수 있습니다.
          </p>
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Partnerships
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12 kr-keep-all">
            기술·운영 파트너
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {partnerships.map((p) => (
              <PartnerBadge key={p.name} partner={p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/about/certifications"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              인증·자격 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications snapshot */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Certifications
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          인증 단계
        </h2>
        <p className="text-xs text-gray-500 text-center mb-8 md:mb-12 kr-keep-all">
          준비 → 신청 → 심사 → 보유 단계 중 현재 위치를 정직하게 표시합니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {certifications.map((c) => {
            const statusMeta = certificationStatusLabel[c.status];
            return (
              <div
                key={c.name}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="text-base font-bold text-gray-900">{c.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${certBadgeClass[statusMeta.color] || certBadgeClass.gray}`}>
                    {statusMeta.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 kr-keep-all mb-1.5">{c.desc}</p>
                {c.targetMilestone && c.status !== "certified" && (
                  <p className="text-xs text-gray-500">목표: {c.targetMilestone}</p>
                )}
                {c.status === "certified" && c.certificateId && (
                  <p className="text-xs text-gray-500">인증서: {c.certificateId}{c.validUntil && ` · ${c.validUntil}`}</p>
                )}
              </div>
            );
          })}
        </div>
        {engineerCredentials.length > 0 && (
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-8 max-w-2xl mx-auto kr-keep-all">
            <span className="font-semibold text-gray-700">대표 엔지니어 보유 기술자격</span> ·{" "}
            {engineerCredentials.map((cr, i) => (
              <span key={cr.code}>
                {i > 0 && ", "}
                <span className="font-semibold text-emerald-700">{cr.code}</span>
                {" "}({cr.name})
              </span>
            ))}
          </p>
        )}
        <p className="text-center mt-4">
          <a href="/about/certifications" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            전체 인증·파트너십 보기 →
          </a>
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-r from-blue-600 to-indigo-700 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            기술지원·유지보수 문의
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            Citrix · Omnissa Horizon · Acronis · Vinchin 환경의 운영장애·유지보수·복구검증 상담,
            SI 파트너 기술 협업 문의를 환영합니다.
          </p>
          <Link
            href="/contact?source=about-cta"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            상담 문의 폼 열기
          </Link>
          <p className="text-xs text-blue-200/80 mt-3 kr-keep-all">
            또는 직접 이메일:{" "}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
