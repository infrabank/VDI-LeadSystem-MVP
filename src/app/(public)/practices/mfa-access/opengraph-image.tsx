import { company } from "@/lib/site-config";
import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";
import { renderPracticeOg } from "@/lib/og-practice";

export const runtime = "nodejs";
export const alt = `MFA QuickStart for VDI/DaaS — 솔루션이 아니라 설계로 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPracticeOg({
    eyebrow: "MFA Design · QuickStart",
    headlineLine1: "MFA를 솔루션이 아니라,",
    headlineLine2: "설계로",
    pills: [
      "인증 흐름도",
      "예외/장애 우회",
      "특권 계정 보호",
      "PoC 체크리스트",
    ],
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #312e81 100%)",
    accentColor: "#a5b4fc",
    footerPath: `${company.domain}/practices/mfa-access`,
  });
}
