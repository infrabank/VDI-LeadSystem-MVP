import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 print:hidden">
        <nav className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
            VDI Expert
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-3 inline-block"></span>
            <span className="text-xs font-medium text-blue-600 tracking-wide hidden sm:inline-block mt-0.5">
              Secure Workspace Practice
            </span>
          </Link>
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/n2sf"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              N²SF 진단센터
            </Link>
            <Link
              href="/content"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              콘텐츠
            </Link>
            <Link
              href="/tools/roi-calculator"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              ROI 계산기
            </Link>
            <Link
              href="/portal/login"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              SAP 포털
            </Link>
            <Link
              href="/admin/login"
              className="text-amber-600 hover:text-amber-700 transition-colors"
            >
              관리자
            </Link>
            <Link
              href="/tools/risk-assessment"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              N²SF 정렬 진단
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-50 border-t border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="font-bold text-gray-900 text-base">VDI Expert</p>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-2 inline-block"></span>
              </div>
              <p className="text-xs text-blue-600 font-semibold mb-3">Secure Workspace Practice</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                공공·금융을 위한 보안 워크스페이스·접근통제 자문. N²SF 정렬 진단부터 Zero Trust 전환·VDI 운영·CDS/망연계까지 일관된 전문성을 제공합니다.
              </p>
            </div>

            {/* Diagnosis Tools */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">진단 도구</p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/tools/risk-assessment" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    N²SF 정렬 진단
                  </Link>
                </li>
                <li>
                  <Link href="/diagnosis/n2sf-readiness" className="text-gray-600 hover:text-blue-600 transition-colors">
                    N²SF 전환 준비도 진단
                  </Link>
                </li>
                <li>
                  <Link href="/diagnosis/vdi-transition" className="text-gray-600 hover:text-blue-600 transition-colors">
                    VDI 역할 재정의 진단
                  </Link>
                </li>
                <li>
                  <Link href="/tools/roi-calculator" className="text-gray-600 hover:text-green-600 transition-colors">
                    ROI 계산기
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portal & Admin */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">포털 &amp; 관리</p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/portal/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    SAP 포털 로그인
                  </Link>
                </li>
                <li>
                  <Link href="/portal/requests/new" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    새 검토 요청
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-gray-600 hover:text-amber-600 transition-colors">
                    관리자 로그인
                  </Link>
                </li>
                <li>
                  <Link href="/admin/queue" className="text-gray-600 hover:text-amber-600 transition-colors">
                    검토 큐
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">문의</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                N²SF 정렬 진단·Zero Trust 전환·VDI 운영에 관한 기술 상담 및 프로젝트 협업 문의를 환영합니다.
              </p>
              <a
                href="mailto:contact@vdiexpert.kr"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@vdiexpert.kr
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} VDI Expert. All rights reserved.</span>
            <span className="text-gray-300">VDI Expert · Secure Workspace Practice — 공공·금융을 위한 보안 워크스페이스·접근통제 자문</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
