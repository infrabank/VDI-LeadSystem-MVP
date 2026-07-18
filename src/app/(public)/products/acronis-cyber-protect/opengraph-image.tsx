import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `Acronis Cyber Protect — 서버·PC·NAS 백업 + 랜섬웨어 방어 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "Acronis Cyber Protect",
    headlineLine1: "서버·PC·NAS 백업 +",
    headlineLine2: "랜섬웨어 방어",
    pills: ["이미지 백업", "안티랜섬웨어", "복구검증", "Authorized Partner"],
    gradient: "linear-gradient(135deg, #1c1917 0%, #b91c1c 60%, #7f1d1d 100%)",
    accentColor: "#f87171",
    footerPath: `${company.domain}/products/acronis-cyber-protect`,
  });
}
