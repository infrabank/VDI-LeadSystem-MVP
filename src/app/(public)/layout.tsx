import Link from "next/link";
import PublicHeader from "./PublicHeader";
import { company, practicesList, navLinks } from "@/lib/site-config";

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

            {/* Practices */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Practices
              </p>
              <ul className="space-y-2.5 text-sm">
                {practicesList.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={p.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium kr-keep-all"
                    >
                      {p.shortTitle}{" "}
                      <span className="text-xs text-gray-400">({p.brand})</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                    진단·계산 도구
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Insights · 콘텐츠
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Case Studies
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

          <div className="mt-8 md:mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-400">
            <span>&copy; {company.copyrightYear} {company.legalName}. All rights reserved.</span>
            <span className="text-gray-300 leading-relaxed kr-keep-all">
              {company.tagline}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
