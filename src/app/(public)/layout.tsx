import Link from "next/link";
import PublicHeader from "./PublicHeader";
import {
  company,
  companyLegal,
  supportAreas,
  maintenancePackages,
  hasLegalInfo,
} from "@/lib/site-config";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PublicHeader />

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-50 border-t border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="font-bold text-gray-900 text-base">{company.name}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-2 inline-block"></span>
              </div>
              <p className="text-xs text-blue-600 font-semibold mb-3">{company.tagline}</p>
              <p className="text-sm text-gray-500 leading-relaxed kr-keep-all">
                {company.description}
              </p>
            </div>

            {/* Technical Support */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Technical Support
              </p>
              <ul className="space-y-2.5 text-sm">
                {supportAreas.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/#support-areas`}
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium kr-keep-all"
                    >
                      {a.brand}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-gray-200 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Maintenance
                  </p>
                </li>
                {maintenancePackages.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/#maintenance`}
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium kr-keep-all"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-gray-200 mt-2">
                  <Link href="/insights" className="text-gray-500 hover:text-blue-600 transition-colors text-xs">
                    Insights · 기술 콘텐츠
                  </Link>
                  <span className="text-gray-300 mx-2 text-xs">·</span>
                  <Link href="/case-studies" className="text-gray-500 hover:text-blue-600 transition-colors text-xs">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-gray-500 hover:text-amber-700 transition-colors text-xs">
                    SI 파트너 협업 →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Company
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                    회사 소개
                  </Link>
                </li>
                <li>
                  <Link href="/about#leadership" className="text-gray-600 hover:text-blue-600 transition-colors">
                    팀 소개
                  </Link>
                </li>
                <li>
                  <Link href="/about/certifications" className="text-gray-600 hover:text-blue-600 transition-colors">
                    인증 · 파트너십
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                    문의 · Contact
                  </Link>
                </li>
                <li className="pt-2 border-t border-gray-200 mt-2">
                  <Link href="/portal/login" className="text-indigo-600 hover:text-indigo-700 transition-colors text-xs">
                    SAP 포털
                  </Link>
                  <span className="text-gray-300 mx-2 text-xs">·</span>
                  <Link href="/admin/login" className="text-amber-600 hover:text-amber-700 transition-colors text-xs">
                    관리자
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Contact
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 kr-keep-all">
                기술 상담·프로젝트 협업·파트너십 문의를 환영합니다.
              </p>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {company.email}
              </a>
            </div>
          </div>

          {/* 사업자 정보 (전자상거래법 §10·정보통신망법 표시 의무) */}
          {hasLegalInfo() && (
            <div className="mt-8 md:mt-10 pt-6 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
              <p className="font-semibold text-gray-700 mb-1.5">{company.legalName}</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                {companyLegal.representativeName && (
                  <span>대표자: <span className="text-gray-700">{companyLegal.representativeName}</span></span>
                )}
                {companyLegal.businessNumber && (
                  <span>사업자등록번호: <span className="text-gray-700">{companyLegal.businessNumber}</span></span>
                )}
                {companyLegal.mailOrderRegNumber && (
                  <span>통신판매업: <span className="text-gray-700">{companyLegal.mailOrderRegNumber}</span></span>
                )}
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {companyLegal.address && (
                  <span>주소: <span className="text-gray-700">{companyLegal.address}</span></span>
                )}
                {companyLegal.phone && (
                  <span>대표전화: <span className="text-gray-700">{companyLegal.phone}</span></span>
                )}
                {companyLegal.fax && (
                  <span>팩스: <span className="text-gray-700">{companyLegal.fax}</span></span>
                )}
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-400">
            <span>&copy; {company.copyrightYear} {company.legalName}. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link href="/legal/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">개인정보 처리방침</Link>
              <span className="text-gray-300">·</span>
              <Link href="/legal/terms" className="text-gray-500 hover:text-blue-600 transition-colors">이용약관</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
