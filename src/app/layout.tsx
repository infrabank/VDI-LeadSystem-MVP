import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VDI Expert | 공공·금융 보안 워크스페이스·접근통제 전문 (N²SF 정렬)",
  description:
    "N²SF 정렬 진단·Zero Trust 전환·VDI 운영·CDS/망연계 자문. 274개 보안통제 매핑 진단 도구 무료 제공. 공공·금융 보안 책임자 1순위 파트너.",
  openGraph: {
    title: "VDI Expert | 공공·금융 보안 워크스페이스·접근통제 전문 (N²SF 정렬)",
    description:
      "N²SF 정렬 진단·Zero Trust 전환·VDI 운영·CDS/망연계 자문. 274개 보안통제 매핑 진단 도구 무료 제공. 공공·금융 보안 책임자 1순위 파트너.",
    type: "website",
    locale: "ko_KR",
    siteName: "VDI Expert",
  },
  twitter: {
    card: "summary_large_image",
    title: "VDI Expert | 공공·금융 보안 워크스페이스·접근통제 전문 (N²SF 정렬)",
    description:
      "N²SF 정렬 진단·Zero Trust 전환·VDI 운영·CDS/망연계 자문. 274개 보안통제 매핑 진단 도구 무료 제공. 공공·금융 보안 책임자 1순위 파트너.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "VDI Expert",
  alternateName: "VDI Expert · Secure Workspace Practice",
  url: "https://vdiexpert.kr",
  description:
    "공공·금융을 위한 보안 워크스페이스·접근통제 전문. N²SF 정렬 진단·Zero Trust 전환·VDI 운영·CDS/망연계 자문.",
  areaServed: "KR",
  knowsAbout: [
    "N²SF",
    "Zero Trust",
    "VDI",
    "CDS",
    "Access Control",
    "Secure Workspace",
    "망분리",
    "보안통제",
    "공공기관 보안",
    "금융 보안",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@vdiexpert.kr",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
