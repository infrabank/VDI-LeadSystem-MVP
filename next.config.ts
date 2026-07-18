import type { NextConfig } from "next";

/**
 * 보안 헤더 — securityheaders.com A 등급 + ISMS-P 2.10.1·OWASP 정합.
 *
 * Red Team Round 2 (2026-05-01) — HIGH 2: unsafe-eval 제거.
 *   • script-src에서 'unsafe-eval' 제거 (JSON-LD엔 불필요)
 *   • 'unsafe-inline'은 Next.js inline JSON-LD 메타데이터용으로 잠정 유지
 *     (운영 안정 후 nonce 기반 CSP로 전환 — TODO: 2026 Q3)
 *
 * CSP는 인라인 스크립트(JSON-LD)·인라인 스타일(Tailwind/Next.js)·외부 폰트(Pretendard CDN)·이미지(Supabase Storage)를 허용.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' 제거 — Red Team Round 2 HIGH 2.
      // 'unsafe-inline'은 Next.js JSON-LD 메타용 — nonce 전환은 2026 Q3 별도 PR.
      // googletagmanager는 GA4 스크립트 로드용 (2026-07-18 GA4 도입).
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://hooks.slack.com https://discord.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

/**
 * /reports/[token] 전용 추가 헤더 — Red Team Round 2 CRITICAL 2.
 *   • X-Robots-Tag: 검색엔진 인덱싱 차단 (metadata.robots와 이중 방어)
 *   • Referrer-Policy: no-referrer — URL의 access_token이 외부 referer로 누출 차단
 */
const reportsExtraHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate, max-age=0" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
  outputFileTracingIncludes: {
    "/api/reports/\\[toolRunId\\]/generate": ["./src/templates/reports/**/*"],
    "/api/reports/roi/\\[toolRunId\\]/generate": ["./src/templates/reports/**/*"],
    "/api/reports/retry-pdf/\\[reportId\\]": ["./src/templates/reports/**/*"],
    "/api/tools/risk-assessment/run": ["./src/templates/reports/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // /reports/[token] 전용 — 검색엔진 인덱싱·Referer leak·캐싱 차단
      {
        source: "/reports/:token",
        headers: reportsExtraHeaders,
      },
      {
        source: "/reports/roi/:token",
        headers: reportsExtraHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // ===== 대표 도메인 통합 (2026-07-18 SEO §2) =====
      // www.myloket / mlkit / www.mlkit → https://myloket.co.kr 로 경로 보존 영구 리디렉션.
      // Vercel에 붙은 모든 도메인 별칭이 이 앱을 서빙하므로 host 조건 리디렉션으로 통합.
      // (permanent: true → 308, 검색엔진은 301과 동일하게 영구 이전으로 처리)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.myloket.co.kr" }],
        destination: "https://myloket.co.kr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mlkit.co.kr" }],
        destination: "https://myloket.co.kr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mlkit.co.kr" }],
        destination: "https://myloket.co.kr/:path*",
        permanent: true,
      },
      // 콘텐츠 → Insights 리네이밍 (글로벌 IA 표준)
      { source: "/content", destination: "/insights", permanent: true },
      { source: "/content/:slug*", destination: "/insights/:slug*", permanent: true },
      // 진단 도구 → /tools 통합
      {
        source: "/diagnosis/n2sf-readiness",
        destination: "/tools/n2sf-readiness",
        permanent: true,
      },
      {
        source: "/diagnosis/vdi-transition",
        destination: "/tools/vdi-transition",
        permanent: true,
      },
      { source: "/diagnosis", destination: "/tools", permanent: true },
    ];
  },
};

export default nextConfig;
