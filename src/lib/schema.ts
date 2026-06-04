/**
 * JSON-LD (schema.org) 헬퍼 — SEO/AEO/GEO 구조화 데이터.
 *
 * 루트 레이아웃의 ProfessionalService org(`#org`)를 기준으로,
 * 서비스 페이지에서 Service · FAQPage · BreadcrumbList를 생성한다.
 *
 * 사용: 페이지에서 `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }} />`
 */

import { company } from "./site-config";

export const SITE_URL = `https://${company.domain}`;
export const ORG_ID = `${SITE_URL}/#org`;

export interface FaqItem {
  q: string;
  a: string;
}

/** FAQPage — AEO(답변 엔진)·구글 FAQ 리치 결과용 */
export function faqPageLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList — 경로 탐색 + 구글 빵부스러기 표시 */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Service — 서비스 정의(GEO/AEO 추론용). provider는 org #org를 참조 */
export function serviceLd(opts: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
  /** 행정구역 명칭 배열 — 미지정 시 대한민국 전역 */
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    provider: { "@type": "ProfessionalService", "@id": ORG_ID, name: company.legalName },
    areaServed: (opts.areaServed ?? ["대한민국"]).map((a) => ({
      "@type": "AdministrativeArea",
      name: a,
    })),
  };
}

/** 여러 JSON-LD 객체를 하나의 문자열 배열로 — 페이지에서 map 렌더 */
export function jsonLdScripts(...objects: object[]): string[] {
  return objects.map((o) => JSON.stringify(o));
}
