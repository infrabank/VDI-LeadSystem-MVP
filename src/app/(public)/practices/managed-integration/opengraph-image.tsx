import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `N²SF 전환 사전진단 — 공공기관 VDI·망분리 정렬 진단 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "Transition Diagnosis · 1차 진단",
    headlineLine1: "공공기관 VDI·망분리 환경의",
    headlineLine2: "N²SF 정렬 진단",
    pills: [
      "현재 구조도",
      "C/S/O 예비 분류",
      "유지/축소/전환",
      "RFP 반영 문구",
    ],
    gradient: "linear-gradient(135deg, #2e1065 0%, #5b21b6 50%, #312e81 100%)",
    accentColor: "#a78bfa",
    footerPath: `${company.domain}/practices/managed-integration`,
  });
}
