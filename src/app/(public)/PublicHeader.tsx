"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, navLinks, ctaLink } from "@/lib/site-config";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 경로 변경 시 모바일 메뉴 자동 닫기 — SPA 라우팅 후 UI 동기화 목적.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

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
            {company.name}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          </span>
          <span className="text-[9px] sm:text-[11px] font-semibold text-blue-600 tracking-[0.15em] uppercase mt-0.5">
            {company.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ctaLink.href}
            className="px-4 xl:px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            {ctaLink.label}
          </Link>
        </div>

        {/* Mobile: CTA + 햄버거 */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href={ctaLink.href}
            className="hidden sm:inline-block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-semibold shadow-sm shadow-blue-200"
          >
            {ctaLink.shortLabel}
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
                  className="py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="text-base font-medium text-gray-700">{link.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{link.description}</div>
                </Link>
              ))}
              <Link
                href={ctaLink.href}
                className="mt-3 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-semibold shadow-sm shadow-blue-200"
              >
                {ctaLink.label}
              </Link>
              {/* Secondary access (포털·관리자) */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 text-xs">
                <Link href="/portal/login" className="text-indigo-600 hover:text-indigo-700">
                  SAP 포털
                </Link>
                <span className="text-gray-300">·</span>
                <Link href="/admin/login" className="text-amber-600 hover:text-amber-700">
                  관리자
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
