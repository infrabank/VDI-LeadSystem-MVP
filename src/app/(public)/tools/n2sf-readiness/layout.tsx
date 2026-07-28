import type { Metadata } from "next";
import { ToolExplainer } from "../ToolExplainer";

export const metadata: Metadata = {
  title: "N²SF 전환 준비도 진단",
  description: "5섹션 15문항으로 N²SF 전환 성숙도를 진단하고 3단계 로드맵을 제시하는 무료 도구.",
  alternates: { canonical: "/tools/n2sf-readiness" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolExplainer slug="n2sf-readiness" />
    </>
  );
}
