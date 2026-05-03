import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `VDI 역할 재정의 컨설팅 — N²SF 이후 VDI를 어디에 남길 것인가 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "VDI Repositioning",
    headlineLine1: "N²SF 이후, VDI를",
    headlineLine2: "어디에 남길 것인가",
    pills: ["유지/축소", "DaaS 전환", "고위험 분리", "운영 리스크 평가"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #1e3a8a 100%)",
    accentColor: "#60a5fa",
    footerPath: `${company.domain}/practices/vdi-workspace`,
  });
}
