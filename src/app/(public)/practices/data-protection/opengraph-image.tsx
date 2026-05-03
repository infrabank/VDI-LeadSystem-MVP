import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `백업·DR 복구검증 서비스 — 사고 시 실제 복구 가능한지 매월 검증 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "Recovery Verification",
    headlineLine1: "사고 시 실제 복구 가능한지,",
    headlineLine2: "매월 검증합니다",
    pills: [
      "월간 복구 시연",
      "RTO/RPO 기준표",
      "랜섬웨어 24h 대응",
      "무결성 검증",
    ],
    gradient: "linear-gradient(135deg, #022c22 0%, #047857 50%, #134e4a 100%)",
    accentColor: "#6ee7b7",
    footerPath: `${company.domain}/practices/data-protection`,
  });
}
