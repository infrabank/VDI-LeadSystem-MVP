import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `Citrix·Omnissa Horizon VDI 구축·기술지원 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "VDI Technical Support",
    headlineLine1: "Citrix · Omnissa Horizon",
    headlineLine2: "VDI 구축·기술지원",
    pills: ["접속·세션 장애 분석", "UAG·Gateway", "FSLogix·프로파일", "vSphere 연계"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #1e3a8a 100%)",
    accentColor: "#60a5fa",
    footerPath: `${company.domain}/services/vdi-support`,
  });
}
