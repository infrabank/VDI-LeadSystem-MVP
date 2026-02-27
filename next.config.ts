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
};

export default nextConfig;
