import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `Vinchin Backup & Recovery — 가상화 VM 에이전트리스 백업·즉시 복구 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "Vinchin Backup & Recovery",
    headlineLine1: "가상화 VM 백업,",
    headlineLine2: "즉시 복구까지",
    pills: ["VMware·Hyper-V·Proxmox", "에이전트리스", "Instant Recovery", "Silver Partner"],
    gradient: "linear-gradient(135deg, #042f2e 0%, #0f766e 55%, #134e4a 100%)",
    accentColor: "#2dd4bf",
    footerPath: `${company.domain}/products/vinchin-backup`,
  });
}
