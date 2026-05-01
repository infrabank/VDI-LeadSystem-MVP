import Link from "next/link";
import { company, practicesList, partnerships, certifications, customers, leadership } from "@/lib/site-config";
import { PartnerBadge } from "../PartnerBadge";
import { CustomerShowcase } from "../CustomerShowcase";
import { LeaderCard } from "../LeaderCard";

const customerCount = customers.length;
const publicCount = customers.filter((c) => c.category !== "private").length;

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
              규제 적합한 보안과 운영 연속성을 한 곳에서
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 kr-keep-all">
              공공·금융 기관은 망분리 완화·N²SF 1.0 시행 같은 규제 환경 변화와
              랜섬웨어·운영 중단 같은 운영 리스크를 동시에 다뤄야 합니다.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all">
              {company.name}는 보안 워크스페이스(접근·통제)와 데이터 보호(백업·복원력)를
              하나의 자문·운영 체계로 통합해, 정책·기술·운영의 일관성을 보장합니다.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Two Practices, One Team
            </p>
            <div className="space-y-4">
              {practicesList.map((p) => {
                const isBlue = p.primaryColor === "blue";
                return (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${isBlue ? "bg-blue-600" : "bg-emerald-600"}`}
                      ></span>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isBlue ? "text-blue-600" : "text-emerald-600"
                        }`}
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
            보안 워크스페이스와 데이터 보호 두 Practice를 함께 책임지는 핵심 인력입니다.
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
            공공·연구기관 {publicCount}곳을 포함해 {customerCount}개 기관의 VDI·DaaS 환경을 운영·기술지원하고 있습니다.
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
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12 kr-keep-all">
          보유·진행 중 인증
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
            >
              <p className="text-base font-bold text-gray-900 mb-1">{c.name}</p>
              <p className="text-xs text-gray-500 kr-keep-all">{c.desc}</p>
            </div>
          ))}
        </div>
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
            N²SF 정렬 진단·Zero Trust 전환·VDI 운영·Acronis 백업·DR에 관한 기술 상담 및 프로젝트 협업 문의를 환영합니다.
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
