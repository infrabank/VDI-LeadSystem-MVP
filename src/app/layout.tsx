import type { Metadata } from "next";
import "./globals.css";
import { company } from "@/lib/site-config";

const title = `${company.legalName} | ${company.taglineKo}`;
const description = company.description;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
    siteName: company.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  url: `https://${company.domain}`,
  description: company.description,
  areaServed: "KR",
  knowsAbout: [
    "N²SF",
    "Zero Trust",
    "VDI",
    "CDS",
    "Access Control",
    "Secure Workspace",
    "Acronis Cyber Protect",
    "Backup",
    "Disaster Recovery",
    "Cyber Resilience",
    "망분리",
    "보안통제",
    "데이터 보호",
    "공공기관 보안",
    "금융 보안",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: company.email,
    contactType: "customer service",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${company.name} Practices`,
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "보안 워크스페이스 Practice (VDI Expert)",
          description: "VDI · Zero Trust · N²SF 정렬 자문",
          url: `https://${company.domain}/practices/secure-workspace`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "데이터 보호 Practice (Acronis Powered)",
          description: "Acronis 기반 백업 · DR · 사이버복원력",
          url: `https://${company.domain}/practices/data-protection`,
        },
      },
    ],
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
