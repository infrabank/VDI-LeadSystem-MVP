import type { NextConfig } from "next";

/**
 * 보안 헤더 — securityheaders.com A 등급 목표.
 *
 * CSP는 인라인 스크립트(JSON-LD)·인라인 스타일(Tailwind/Next.js)·외부 폰트(Pretendard CDN)·이미지(Supabase Storage)를 허용.
 * 운영 시 nonce 도입 검토 가능 (현재는 'unsafe-inline'으로 시작).
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://hooks.slack.com https://discord.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
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
    ];
  },
  async redirects() {
    return [
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
