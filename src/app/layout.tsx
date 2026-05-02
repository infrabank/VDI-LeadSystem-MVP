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

import { practicesList } from "@/lib/site-config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  url: `https://${company.domain}`,
  description: company.description,
  areaServed: "KR",
  knowsAbout: [
    "VDI",
    "Citrix Virtual Apps and Desktops",
    "VMware Horizon",
    "Omnissa Workspace ONE",
    "DaaS",
    "Azure Virtual Desktop",
    "Windows 365",
    "MFA",
    "Multi-Factor Authentication",
    "Microsoft Entra ID",
    "라온시큐어",
    "OneAccess",
    "TouchEn OnePass",
    "GPKI",
    "Zero Trust Access",
    "Acronis Cyber Protect",
    "Backup",
    "EDR",
    "Endpoint Detection and Response",
    "Disaster Recovery",
    "Cyber Resilience",
    "데이터 보호",
    "랜섬웨어 대응",
    "N²SF",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: company.email,
    contactType: "customer service",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${company.name} Solutions`,
    itemListElement: practicesList.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${p.title} (${p.brand})`,
        description: p.tagline,
        url: `https://${company.domain}${p.href}`,
      },
    })),
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
