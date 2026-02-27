import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VDI Expert - VDI 전문 기술 콘텐츠 & 진단",
  description:
    "VDI 마이그레이션과 운영에 관한 체크리스트, 케이스 스터디, 리스크 진단 도구를 제공합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
