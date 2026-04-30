"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/n2sf", label: "N²SF 진단센터", hover: "hover:text-blue-700" },
  { href: "/content", label: "콘텐츠", hover: "hover:text-blue-600" },
  { href: "/tools/roi-calculator", label: "ROI 계산기", hover: "hover:text-green-600" },
  { href: "/portal/login", label: "SAP 포털", hover: "hover:text-indigo-700", base: "text-indigo-600" },
  { href: "/admin/login", label: "관리자", hover: "hover:text-amber-700", base: "text-amber-600" },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 라우트 변경 시 메뉴 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC 키로 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 print:hidden">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-bold text-base sm:text-lg text-gray-900 tracking-tight inline-flex items-center gap-1.5">
            VDI Expert
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          </span>
          <span className="text-[9px] sm:text-[11px] font-semibold text-blue-600 tracking-[0.15em] uppercase mt-0.5">
            Secure Workspace Practice
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.base ?? "text-gray-600"} ${link.hover} transition-colors`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/risk-assessment"
            className="px-4 xl:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            N²SF 정렬 진단
          </Link>
        </div>

        {/* Mobile: CTA + 햄버거 */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/tools/risk-assessment"
            className="hidden sm:inline-block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold shadow-sm shadow-blue-200"
          >
            진단 시작
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            className="p-2 -mr-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-14 sm:top-16 bg-black/30 z-40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-slide-down">
            <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${link.base ?? "text-gray-700"} ${link.hover} py-3 text-base font-medium border-b border-gray-100 last:border-0`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/tools/risk-assessment"
                className="mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold shadow-sm shadow-blue-200"
              >
                N²SF 정렬 진단 시작
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
