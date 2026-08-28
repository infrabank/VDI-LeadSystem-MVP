"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, companyLegal, navLinks, ctaLink } from "@/lib/site-config";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null);
  const pathname = usePathname();

  /** 현재 보고 있는 메뉴를 표시한다. 자식 경로까지 부모 항목을 활성으로 본다. */
  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  useEffect(() => {
    // 경로 변경 시 모바일 메뉴·데스크톱 드롭다운 자동 닫기 — SPA 라우팅 후 UI 동기화.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setDesktopMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDesktopMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 print:hidden">
      {/* GNB 항목이 6개라 본문(max-w-5xl)보다 한 단계 넓게 잡아 줄바꿈 방지 */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link href="/" className="flex flex-col leading-tight shrink-0">
          <span className="font-bold text-base sm:text-lg text-gray-900 tracking-tight inline-flex items-center gap-1.5">
            {company.name}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          </span>
          <span className="text-[9px] sm:text-[11px] font-semibold text-blue-600 tracking-[0.15em] uppercase mt-0.5">
            {company.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setDesktopMenu(link.label)}
                onMouseLeave={() => setDesktopMenu(null)}
                // 키보드 접근성 — Tab 포커스 진입 시 드롭다운 열고, 포커스가 밖으로 나가면 닫기
                onFocus={() => setDesktopMenu(link.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setDesktopMenu(null);
                  }
                }}
              >
                <Link
                  href={link.href}
                  aria-haspopup="true"
                  aria-expanded={desktopMenu === link.label}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`inline-flex items-center gap-1 whitespace-nowrap border-b-2 pb-0.5 transition-colors ${
                    isActive(link.href)
                      ? "text-blue-700 border-blue-600"
                      : desktopMenu === link.label
                        ? "text-blue-700 border-transparent"
                        : "text-gray-600 border-transparent hover:text-blue-700"
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${
                      desktopMenu === link.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                {/* Dropdown panel (hover bridge via pt-3) */}
                {desktopMenu === link.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                    <div className="w-72 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/70 p-2">
                      {link.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block px-3 py-2.5 rounded-lg hover:bg-blue-50/60 transition-colors group"
                        >
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {c.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 kr-keep-all">
                            {c.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`border-b-2 pb-0.5 transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-blue-700 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}

          {/* 장애 상황에서 가장 먼저 찾는 번호라 노트북 폭(lg)부터 노출한다.
              lg에서는 아이콘만, xl부터 번호까지 보여 GNB 줄바꿈을 막는다. */}
          <a
            href={PHONE_TEL}
            aria-label={`전화 ${companyLegal.phone}`}
            className="hidden lg:inline-flex items-center gap-1.5 font-semibold text-gray-900 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden xl:inline">{companyLegal.phone}</span>
          </a>
          <Link
            href={ctaLink.href}
            className="px-4 xl:px-5 py-2 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold transition-colors shadow-sm shadow-amber-200/70 whitespace-nowrap"
          >
            {ctaLink.label}
          </Link>
        </div>

        {/* Mobile: CTA + 햄버거 */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href={ctaLink.href}
            className="inline-block px-3 py-2 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 text-xs font-semibold shadow-sm shadow-amber-200/70"
          >
            {ctaLink.shortLabel}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            className="p-2.5 -mr-2 text-gray-700 hover:text-blue-600 transition-colors"
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-slide-down max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <div key={link.href} className="border-b border-gray-100 last:border-0">
                  <Link href={link.href} className="block py-3">
                    <div className="text-base font-medium text-gray-700">{link.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 kr-keep-all">{link.description}</div>
                  </Link>
                  {link.children && (
                    <div className="pb-3 -mt-1 space-y-0.5">
                      {link.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block py-2 pl-4 border-l-2 border-blue-100 ml-1"
                        >
                          <div className="text-sm font-medium text-gray-700">{c.label}</div>
                          <div className="text-[11px] text-gray-400 kr-keep-all">{c.description}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href={PHONE_TEL}
                className="mt-3 px-4 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-center font-semibold"
              >
                ☎ {companyLegal.phone} 바로 통화
              </a>
              <Link
                href={ctaLink.href}
                className="mt-2 px-4 py-3 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 text-center font-semibold shadow-sm shadow-amber-200/70"
              >
                {ctaLink.label}
              </Link>
              {/* Secondary access (포털·관리자) */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 text-xs">
                <Link href="/portal/login" className="text-indigo-600 hover:text-indigo-700">
                  SAP 포털
                </Link>
                <span className="text-gray-300">·</span>
                <Link href="/admin/login" className="text-amber-700 hover:text-amber-800">
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
