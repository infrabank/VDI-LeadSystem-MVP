import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "백업·사이버복원력 자가 진단",
  description: "7영역 25문항으로 백업 성숙도와 보완 우선순위를 확인하는 무료 자가진단. 웹 리포트와 PDF를 제공합니다.",
  alternates: { canonical: "/tools/backup-readiness" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
