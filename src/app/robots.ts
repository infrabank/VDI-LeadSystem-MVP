import type { MetadataRoute } from "next";
import { company } from "@/lib/site-config";

const base = `https://${company.domain}`;

/** 비공개 영역 — 모든 크롤러 공통 차단 */
const DISALLOW = [
  "/admin",
  "/admin/",
  "/api",
  "/api/",
  "/portal",
  "/portal/",
  "/reports",
  "/reports/",
  "/thank-you",
];

/**
 * 검색·AI 검색 크롤러 명시 허용 목록.
 * - 검색 노출용 크롤러(OAI-SearchBot, Claude-SearchBot 등)와 모델 학습용
 *   크롤러(GPTBot 등)는 정책이 분리됨. 현재 정책: 학습 크롤러도 차단하지 않음
 *   (노출 극대화). 학습 제공을 원치 않으면 GPTBot·ClaudeBot에 disallow: "/" 규칙을
 *   별도로 추가할 것 — 검색 노출(OAI-SearchBot)에는 영향 없음.
 */
const AI_SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
