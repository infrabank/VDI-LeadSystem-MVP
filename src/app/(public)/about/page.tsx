import Link from "next/link";
import { company, practicesList, partnerships, certifications, certificationStatusLabel, leadership } from "@/lib/site-config";
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

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            About {company.name}
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 leading-[1.15] kr-keep-all">
            {company.taglineKo}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mb-4 font-medium">
            {company.legalName} · {company.legalNameEn}
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            {company.description}
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
              VDI · MFA · 백업, 한 전문가의 통합 책임
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 kr-keep-all">
              기관·기업은 VDI 인프라 선택, 인증·접근통제 강화, 백업·복원력 확보를
              따로 구매하는 데 익숙해져 있습니다. 그 결과 도입 후 책임 단절이
              발생하고 운영 단계의 통합 시각이 사라집니다.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all">
              {company.name}는 Citrix·VMware·Omnissa VDI 운영 경험에 MFA(Microsoft Entra·라온시큐어)와
              Acronis 백업·EDR을 더해, 세 영역을 한 전문가가 통합 설계·운영합니다.
              도입 이후의 운영 책임도 한 창구에서 가져갑니다.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Solutions, One Expert
            </p>
            <div className="space-y-3">
              {practicesList.map((p) => {
                const dotColor: Record<string, string> = {
                  blue: "bg-blue-600",
                  indigo: "bg-indigo-600",
                  emerald: "bg-emerald-600",
                  purple: "bg-purple-600",
                };
                const textColor: Record<string, string> = {
                  blue: "text-blue-600",
                  indigo: "text-indigo-600",
                  emerald: "text-emerald-600",
                  purple: "text-purple-600",
                };
                return (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="block p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${dotColor[p.primaryColor] || dotColor.blue}`}
                      ></span>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${textColor[p.primaryColor] || textColor.blue}`}
                      >
                        {p.brand}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5 kr-keep-all">{p.title}</h3>
                    <p className="text-xs text-gray-500 kr-keep-all">{p.tagline}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Leadership
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            팀 소개
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            전문 영역별 자문·딜리버리 책임을 가진 전문가가 직접 설계·운영합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {leadership.map((leader) => (
              <LeaderCard key={leader.slot} leader={leader} />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-8 kr-keep-all">
            ※ 일부 정보는 업데이트 중입니다. 채용·협업 문의는{" "}
            <a href={`mailto:${company.email}`} className="underline font-medium">
              {company.email}
            </a>
            로 부탁드립니다.
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
            운영 고객사
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            공공·연구기관과 민간 기업의 VDI·DaaS 환경을 운영·기술지원해 왔습니다.
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
        <p className="text-center mt-6">
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
            상담·기술 협업 문의
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed kr-keep-all">
            VDI 설계·MFA 도입·백업 구축 및 융합 패키지 상담, 기술 협업 문의를 환영합니다.
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
