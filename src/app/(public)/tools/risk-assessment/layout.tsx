import type { Metadata } from "next";
import { company } from "@/lib/site-config";

const title = "N²SF 정렬 진단 — 7분 자가 진단";
const description =
  "공공·연구기관의 기존 VDI·망분리·MFA·백업 환경을 N²SF 기준으로 정렬 진단합니다. " +
  "7분 자가 진단 후 5가지 산출물(VDI 유지/축소/전환 1차 검토 의견·C/S/O 등급 예비 분류·MFA 보완 지점·백업/DR 보완 지점·1쪽 요약 PDF)을 무료 제공.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools/risk-assessment" },
  openGraph: {
    title: `${title} | ${company.name}`,
    description,
    type: "website",
    url: `https://${company.domain}/tools/risk-assessment`,
    siteName: company.name,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${company.name}`,
    description,
  },
};

/**
 * `/tools/risk-assessment` page는 client component(`"use client"`)이므로 metadata export 불가.
 * 같은 폴더의 layout.tsx(server component)에 metadata를 두면 페이지에 자동 적용된다.
 */
export default function RiskAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
