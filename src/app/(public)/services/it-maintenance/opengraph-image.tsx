import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `전산 통합 유지보수 — 서버·PC·네트워크·백업 정기 점검 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "IT Maintenance",
    headlineLine1: "서버부터 PC까지,",
    headlineLine2: "전산 통합 유지보수",
    pills: ["월 정기 점검", "장애 대응", "점검표·운영 보고서", "원격 + 방문"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #334155 55%, #1e293b 100%)",
    accentColor: "#38bdf8",
    footerPath: `${company.domain}/services/it-maintenance`,
  });
}
