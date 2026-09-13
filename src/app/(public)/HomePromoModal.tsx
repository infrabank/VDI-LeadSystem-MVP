"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { vdiopsPromo, formatKoreanDate, pocWaiverOpen } from "@/lib/vdiops-promo";

function readHidden(): boolean {
  try {
    if (sessionStorage.getItem(vdiopsPromo.sessionKey)) return true;
    const until = Number(localStorage.getItem(vdiopsPromo.storageKey) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

export default function HomePromoModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (readHidden()) return;
    const t = setTimeout(() => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  function close(hideForDays = false) {
    try {
      if (hideForDays) {
        localStorage.setItem(
          vdiopsPromo.storageKey,
          String(Date.now() + vdiopsPromo.dismissDays * 86_400_000),
        );
      } else {
        sessionStorage.setItem(vdiopsPromo.sessionKey, "1");
      }
    } catch {
      /* 저장이 막힌 환경에서는 이 세션 동안만 닫힌 상태를 유지한다 */
    }
    setOpen(false);
    opener.current?.focus?.();
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      e.preventDefault();
      const idx = items.indexOf(document.activeElement as HTMLElement);
      const step = e.shiftKey ? -1 : 1;
      items[idx === -1 ? 0 : (idx + step + items.length) % items.length].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const waiver = pocWaiverOpen();
  const deadline = formatKoreanDate(vdiopsPromo.pocWaiver.deadline);

  return (
    <div
      className="fixed inset-0 z-[60] print:hidden animate-promo-fade bg-slate-900/60 backdrop-blur-[2px]"
      onClick={() => close()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        aria-describedby="promo-desc"
        onClick={(e) => e.stopPropagation()}
        className="animate-promo-panel fixed inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.35)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,34rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:shadow-[0_24px_64px_-16px_rgba(15,23,42,0.45)]"
      >
        <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-7 sm:pb-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <Image
              src="/products/vdiops/lockup-h.svg"
              alt="VDIOps"
              width={142}
              height={28}
              className="h-7 w-auto"
            />
            <button
              type="button"
              onClick={() => close()}
              aria-label="안내 닫기"
              className="-mr-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2
            id="promo-title"
            ref={titleRef}
            tabIndex={-1}
            className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug kr-keep-all outline-none focus-visible:outline-none mb-3"
          >
            Horizon Manual VDI, 아직 손으로 만들고 계신가요?
          </h2>
          <p id="promo-desc" className="text-sm sm:text-base text-gray-700 leading-relaxed kr-keep-all mb-2">
            VDIOps는 VM 생성, 교체, 회수를 요청서 하나와 승인으로 처리해 주는 프로그램입니다.
            마이로켓이 만들었습니다.
          </p>
          <p className="hidden sm:block text-xs text-gray-500 kr-keep-all mb-5">
            중앙행정기관 1곳에 설치해 운영 중입니다. 기관명은 약정 서명 뒤에 공개합니다.
          </p>

          <dl className="space-y-3 mb-6 mt-4 sm:mt-0">
            <div className="flex gap-3">
              <dt className="flex-shrink-0 w-24 sm:w-28 text-sm font-semibold text-gray-900">데모 계정</dt>
              <dd className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                신청하시면 마이로켓 실험실의 VDIOps 조회 계정을 발급해 드립니다. 화면을 직접 눌러
                보실 수 있습니다.
              </dd>
            </div>
            {waiver && (
              <div className="flex gap-3">
                <dt className="flex-shrink-0 w-24 sm:w-28 text-sm font-semibold text-gray-900">
                  PoC 비용 면제
                </dt>
                <dd className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                  고객 환경 시범 도입(PoC) 비용을 {deadline}까지 선착순{" "}
                  {vdiopsPromo.pocWaiver.slots}개 기관에 면제합니다. 대상은 Horizon Manual 풀을
                  운영하는 기관입니다.
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/products/vdiops?want=account#demo"
              onClick={() => close()}
              className="flex-1 text-center px-5 py-3 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 font-semibold text-sm shadow-sm shadow-amber-200/70 transition-colors"
            >
              데모 계정 신청
            </Link>
            <Link
              href="/products/vdiops"
              onClick={() => close()}
              className="flex-1 text-center px-5 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-semibold text-sm transition-colors"
            >
              VDIOps 자세히 보기
            </Link>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => close(true)}
              className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-4 py-1"
            >
              {vdiopsPromo.dismissDays}일간 보지 않기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
