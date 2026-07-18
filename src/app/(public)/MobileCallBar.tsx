import Link from "next/link";
import { companyLegal } from "@/lib/site-config";

/**
 * 모바일 하단 고정 전화 바 — SMB 담당자는 폼보다 전화로 움직임.
 * lg 이상·인쇄 시 숨김. safe-area 대응.
 */
export default function MobileCallBar() {
  const tel = `tel:${companyLegal.phone.replace(/-/g, "")}`;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 lg:hidden print:hidden bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
      <a
        href={tel}
        className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-bold text-slate-900"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        전화 상담
      </a>
      <Link
        href="/contact?source=mobile-callbar"
        className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-bold text-slate-900 bg-amber-400"
      >
        상담 문의
      </Link>
    </div>
  );
}
