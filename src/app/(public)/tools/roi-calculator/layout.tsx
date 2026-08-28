import type { Metadata } from "next";
import { ToolExplainer } from "../ToolExplainer";

export const metadata: Metadata = {
  title: "VDI 운영 ROI 계산기",
  description: "VDI 마이그레이션·운영비용을 시뮬레이션하고 경영진 보고용 PDF를 제공하는 무료 도구.",
  alternates: { canonical: "/tools/roi-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolExplainer slug="roi-calculator" />
    </>
  );
}
