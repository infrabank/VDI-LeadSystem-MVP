import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "백업 ROI 계산기",
  description: "장애·랜섬웨어 시나리오별 5년 누적 회피 비용, ROI, Payback을 산출하는 무료 계산기. 경영진 보고용 근거를 만듭니다.",
  alternates: { canonical: "/tools/backup-roi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
