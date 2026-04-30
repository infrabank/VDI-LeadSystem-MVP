import type { NextConfig } from "next";

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
