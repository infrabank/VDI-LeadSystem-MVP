import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <nav className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-xl text-gray-900 tracking-tight">
            VDI Expert
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-3 inline-block"></span>
          </Link>
          <div className="flex items-center gap-10 text-sm font-medium">
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
              href="/tools/risk-assessment"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              무료 리스크 진단
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <p className="font-bold text-gray-900 text-base">VDI Expert</p>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-2 inline-block"></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                VDI 마이그레이션과 운영에 관한 체크리스트, 케이스 스터디, 리스크 진단 도구를 통해 실질적인 기술 인사이트를 제공합니다.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">바로가기</p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/content" className="text-gray-600 hover:text-blue-600 transition-colors">
                    콘텐츠 라이브러리
                  </Link>
                </li>
                <li>
                  <Link href="/tools/risk-assessment" className="text-gray-600 hover:text-blue-600 transition-colors">
                    무료 리스크 진단
                  </Link>
                </li>
                <li>
                  <Link href="/tools/roi-calculator" className="text-gray-600 hover:text-green-600 transition-colors">
                    ROI 계산기
                  </Link>
                </li>
                <li>
                  <Link href="/content?type=checklist" className="text-gray-600 hover:text-blue-600 transition-colors">
                    체크리스트
                  </Link>
                </li>
                <li>
                  <Link href="/content?type=case" className="text-gray-600 hover:text-blue-600 transition-colors">
                    케이스 스터디
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact / Social */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">문의</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                VDI 전문가와의 기술 상담 및 프로젝트 협업 문의는 아래로 연락해주세요.
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
            <span className="text-gray-300">VDI Migration &amp; Operations Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
