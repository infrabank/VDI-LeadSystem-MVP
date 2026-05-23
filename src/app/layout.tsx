import type { Metadata } from "next";
import "./globals.css";
import { company, supportAreas, maintenancePackages } from "@/lib/site-config";

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
    "Citrix Virtual Apps and Desktops",
    "Citrix VAD 기술지원",
    "Citrix XenDesktop 유지보수",
    "Citrix NetScaler",
    "Citrix Gateway",
    "Citrix StoreFront",
    "Delivery Controller",
    "Omnissa Horizon",
    "VMware Horizon 기술지원",
    "Horizon Connection Server",
    "Unified Access Gateway",
    "UAG 장애 분석",
    "FSLogix 장애",
    "Citrix Profile Management",
    "Blast / PCoIP 접속 품질",
    "VMware vSphere",
    "VMware ESXi",
    "vCenter",
    "Acronis Cyber Protect",
    "백업 복구검증",
    "Recovery Verification",
    "랜섬웨어 백업 보존",
    "RTO / RPO",
    "VDI 유지보수",
    "VDI 장애 대응",
    "VDI 운영장애",
    "공공기관 VDI 기술지원",
    "정부 출연 연구기관 VDI",
    "SI 기술지원 파트너",
    "월간 점검 보고서",
    "공공기관 운영 보고서",
    "Omnissa Workspace ONE",
    "N²SF 환경 VDI 유지보수",
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
    name: `${company.name} Technical Support & Maintenance`,
    itemListElement: [
      ...supportAreas.map((area) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: area.title,
          description: `${area.brand} — ${area.tagline}`,
          url: `${siteUrl}/#support-areas`,
        },
      })),
      ...maintenancePackages.map((pkg) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: pkg.title,
          description: pkg.provides.join(" · "),
          url: `${siteUrl}/#maintenance`,
        },
      })),
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
