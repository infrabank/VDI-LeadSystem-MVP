import type { Metadata } from "next";
import "./globals.css";
import { company, practicesList } from "@/lib/site-config";

const siteUrl = `https://${company.domain}`;
const siteTitle = `${company.legalName} | ${company.taglineKo}`;
const siteDescription = company.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${company.name}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: siteUrl,
    locale: "ko_KR",
    siteName: company.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#org`,
  name: company.legalName,
  alternateName: company.name,
  url: siteUrl,
  description: siteDescription,
  areaServed: "KR",
  knowsAbout: [
    "N²SF",
    "N2SF Workspace Transition",
    "공공기관 보안 워크스페이스 전환",
    "VDI 역할 재정의",
    "VDI Repositioning",
    "MFA QuickStart",
    "백업·DR 복구검증",
    "Recovery Verification",
    "VDI",
    "Citrix Virtual Apps and Desktops",
    "Omnissa Horizon",
    "VMware vSphere",
    "VMware ESXi",
    "Omnissa Workspace ONE",
    "DaaS",
    "Azure Virtual Desktop",
    "Windows 365",
    "MFA",
    "Microsoft Entra ID",
    "라온시큐어",
    "OneAccess",
    "TouchEn OnePass",
    "GPKI",
    "Zero Trust Access",
    "Acronis Cyber Protect",
    "Backup",
    "EDR",
    "Disaster Recovery",
    "Cyber Resilience",
    "랜섬웨어 24시간 대응",
    "C/S/O 등급 분류",
    "보안성 검토",
    "KISA",
    "CSAP",
    "망분리 완화",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: company.email,
    contactType: "customer service",
    areaServed: "KR",
    availableLanguage: ["ko"],
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
        url: `${siteUrl}${p.href}`,
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
