"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// GA4 측정 ID — HTML에 공개되는 값이라 기본 내장, env로 교체 가능
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-YFXVLVG5F4";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** App Router SPA 네비게이션 시 page_view 수동 전송 (초기 로드는 gtag config가 전송) */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4 + 전환 이벤트 추적. NEXT_PUBLIC_GA_ID 미설정 시 아무것도 렌더하지 않음.
 * 전화(tel:)·메일(mailto:) 클릭은 주요 전환 수단이므로 contact_click 이벤트로 수집.
 */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!anchor || !window.gtag) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        window.gtag("event", "contact_click", { method: "tel" });
      } else if (href.startsWith("mailto:")) {
        window.gtag("event", "contact_click", { method: "mailto" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
