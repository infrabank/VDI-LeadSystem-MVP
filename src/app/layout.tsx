import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./Analytics";
import { company, companyLegal, companyProfiles, supportAreas, maintenancePackages } from "@/lib/site-config";

const siteUrl = `https://${company.domain}`;
const siteTitle = `Citrix·Omnissa Horizon VDI 기술지원·전산 유지보수 | ${company.nameKo}`;
const siteDescription = company.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    // 브랜드 접미사는 한국어 정식 명칭으로 통일 (§3 브랜드 정체성)
    template: `%s | ${company.nameKo}`,
  },
  description: siteDescription,
  // ⚠️ canonical을 루트에 두면 모든 하위 페이지가 홈으로 canonical 상속됨 (2026-07-18 색인 버그 수정).
  // 각 페이지가 자기 자신을 가리키는 alternates.canonical을 개별 선언한다.
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
  // 소유 확인 메타태그 — 검증 코드는 HTML에 공개되는 값이라 비밀 아님.
  // google은 env 설정 시에만 출력, naver는 발급값을 기본 내장 (env로 교체 가능).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification":
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ??
        "f58845fa509954f75dda31993481ecd2d0f1549b",
    },
  },
};

/** supportAreas.id → 실제 상세 페이지 경로 (JSON-LD Offer URL용) */
const supportAreaUrl: Record<string, string> = {
  citrix: "/services/vdi-support",
  horizon: "/services/vdi-support",
  acronis: "/products/acronis-cyber-protect",
  vinchin: "/products/vinchin-backup",
};

/** WebSite — 사이트 단위 식별 (검색·AI 크롤러의 사이트 이해 보조) */
const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: company.nameKo,
  alternateName: [company.name, company.legalName],
  url: siteUrl,
  inLanguage: "ko",
  publisher: { "@id": `${siteUrl}/#org` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${siteUrl}/#org`,
  name: company.legalName,
  alternateName: [company.name, company.nameKo],
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  email: company.email,
  description: siteDescription,
  telephone: companyLegal.phone,
  ...(companyProfiles.length > 0 ? { sameAs: companyProfiles } : {}),
  founder: {
    "@type": "Person",
    name: companyLegal.representativeName,
    jobTitle: "대표 · 수석 기술지원 엔지니어",
    url: `${siteUrl}/about`,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: companyLegal.address,
    addressLocality: "세종특별자치시",
    addressCountry: "KR",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "세종특별자치시" },
    { "@type": "AdministrativeArea", name: "대전광역시" },
    { "@type": "AdministrativeArea", name: "청주시" },
    { "@type": "AdministrativeArea", name: "천안시" },
    { "@type": "Country", name: "대한민국" },
  ],
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
    "Vinchin Backup and Recovery",
    "가상화 VM 백업",
    "에이전트리스 VM 백업",
    "VMware 백업",
    "Hyper-V 백업",
    "Proxmox 백업",
    "Instant VM Recovery",
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
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "전산 유지보수 · IT 기술지원",
          description:
            "PC, 서버, 네트워크, NAS, 백업, 보안 상태를 정기적으로 점검하고 장애 대응을 지원하는 전산 유지보수 서비스.",
          url: `${siteUrl}/services/it-maintenance`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Acronis 백업·복구보안",
          description:
            "Acronis Cyber Protect 기반으로 서버와 PC 데이터를 백업하고, 장애나 랜섬웨어 상황에서 실제 복구 가능한지 확인하는 서비스.",
          url: `${siteUrl}/services/acronis-backup`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Citrix·Omnissa Horizon VDI 기술지원",
          description:
            "Citrix, Omnissa Horizon, VMware 기반 가상 데스크톱 환경의 접속장애, 인증서, 프로파일, UAG/Gateway, vSphere 연계 문제를 분석하는 서비스.",
          url: `${siteUrl}/services/vdi-support`,
        },
      },
      ...supportAreas.map((area) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${area.brand} 기술지원`,
          description: area.lines.join(" "),
          url: `${siteUrl}${supportAreaUrl[area.id] ?? "/services/vdi-support"}`,
        },
      })),
      ...maintenancePackages.map((pkg) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: pkg.title,
          description: pkg.lines.join(" "),
          url: `${siteUrl}/services/it-maintenance`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
