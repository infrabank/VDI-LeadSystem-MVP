import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `백업·복구검증 — 백업 성공이 아니라 실제 복구 가능성 확인 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "Backup & Recovery Verification",
    headlineLine1: "백업 성공이 아니라,",
    headlineLine2: "복구 가능성을 확인",
    pills: ["Acronis Cyber Protect", "정기 복구 테스트", "랜섬웨어 대비", "결과 보고서"],
    gradient: "linear-gradient(135deg, #022c22 0%, #047857 55%, #064e3b 100%)",
    accentColor: "#34d399",
    footerPath: `${company.domain}/services/acronis-backup`,
  });
}
