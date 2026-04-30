/**
 * Corporate site configuration.
 *
 * mlkit Corporation의 단일 출처 of truth — 회사 정보, 2-Practice 메타데이터,
 * 파트너십·인증, navigation·footer에서 공유하는 값.
 *
 * 향후 i18n: 한국어 only로 출발, label_ko/label_en 슬롯 마련 예정.
 */

export const company = {
  name: "mlkit",
  nameKo: "마이로켓",
  legalName: "(주)마이로켓",
  legalNameEn: "MyRocket Inc.",
  tagline: "Enterprise Workspace Security · Data Protection",
  taglineKo: "기업 보안 워크스페이스·데이터 보호 전문",
  description:
    "공공·금융 기관을 위한 보안 워크스페이스(VDI·Zero Trust·N²SF)와 데이터 보호(백업·DR·사이버복원력) 전문 컨설팅·운영 서비스.",
  email: "contact@mlkit.co.kr",
  domain: "mlkit.co.kr",
  copyrightYear: new Date().getFullYear(),
} as const;

export type PracticeId = "secure-workspace" | "data-protection";

export interface Practice {
  id: PracticeId;
  href: string;
  brand: string; // sub-brand 명칭
  title: string; // 한국어 정식명
  shortTitle: string; // nav·card용 짧은 제목
  tagline: string; // 1-line summary
  description: string; // hero용 단락
  pillars: { title: string; desc: string }[]; // 3-4개 핵심 영역
  ctaLabel: string;
  ctaHref: string;
  primaryColor: string; // tailwind color name (blue, emerald 등)
}

export const practices: Record<PracticeId, Practice> = {
  "secure-workspace": {
    id: "secure-workspace",
    href: "/practices/secure-workspace",
    brand: "VDI Expert",
    title: "보안 워크스페이스 Practice",
    shortTitle: "보안 워크스페이스",
    tagline: "VDI · Zero Trust · N²SF 정렬 자문",
    description:
      "공공·금융을 위한 보안 워크스페이스·접근통제 전문. N²SF 1.0 정렬 진단부터 Zero Trust 전환·VDI 운영·CDS/망연계까지 일관된 전문성을 제공합니다.",
    pillars: [
      { title: "N²SF 정렬 진단", desc: "274개 보안통제 매핑 · C/S/O 등급 · 모델 3·8·10 권고" },
      { title: "Zero Trust 전환", desc: "5섹션 15문항 준비도 진단 · 3단계 전환 로드맵" },
      { title: "VDI 운영·재정의", desc: "9문항 진단 · 유지/보완/축소/재설계 시나리오" },
      { title: "CDS·망연계", desc: "정보 연계 보안통제 매핑·운영 자문" },
    ],
    ctaLabel: "N²SF 정렬 진단 시작",
    ctaHref: "/tools/risk-assessment",
    primaryColor: "blue",
  },
  "data-protection": {
    id: "data-protection",
    href: "/practices/data-protection",
    brand: "Acronis Powered",
    title: "데이터 보호 Practice",
    shortTitle: "데이터 보호",
    tagline: "Acronis 기반 백업 · DR · 사이버복원력",
    description:
      "랜섬웨어·운영 중단·자연재해로부터 기업 데이터를 보호하는 통합 백업·재해복구·사이버복원력 솔루션. Acronis Cyber Protect 파트너로서 설계·구축·운영을 일관되게 제공합니다.",
    pillars: [
      { title: "통합 백업·복구", desc: "Acronis Cyber Protect 기반 엔드포인트·서버·VM 통합 보호" },
      { title: "재해복구(DR)", desc: "RTO/RPO 목표 기반 DR 설계·운영, 클라우드 페일오버" },
      { title: "사이버복원력", desc: "랜섬웨어 탐지·차단·롤백, 안티-멀웨어 통합 보호" },
      { title: "MSP 운영 서비스", desc: "24x7 모니터링·복구 검증·정기 리포트" },
    ],
    ctaLabel: "데이터 보호 상담 문의",
    ctaHref: "/about#contact",
    primaryColor: "emerald",
  },
};

export const practicesList: Practice[] = [
  practices["secure-workspace"],
  practices["data-protection"],
];

export const certifications = [
  { name: "ISMS-P", desc: "정보보호 및 개인정보보호 관리체계 인증 (예정)" },
  { name: "ISO/IEC 27001", desc: "정보보안 경영 시스템 (예정)" },
];

export interface Partnership {
  name: string;
  role: string;
  domain: "secure-workspace" | "data-protection";
  /** /public/partners/ 하위 SVG 파일명 (확장자 포함). 자산 업로드 후 활성화. */
  logoFile?: string;
  /** 로고 미준비 시 텍스트 칩 색상 (tailwind class) */
  textColor: string;
  bgColor: string;
}

export const partnerships: Partnership[] = [
  {
    name: "VMware",
    role: "VDI · Workspace ONE Partner",
    domain: "secure-workspace",
    logoFile: "vmware.svg",
    textColor: "text-[#607078]",
    bgColor: "bg-gray-50",
  },
  {
    name: "Omnissa",
    role: "Horizon · UEM Solutions Partner",
    domain: "secure-workspace",
    logoFile: "omnissa.svg",
    textColor: "text-[#0091da]",
    bgColor: "bg-sky-50",
  },
  {
    name: "Citrix",
    role: "DaaS · NetScaler Partner",
    domain: "secure-workspace",
    logoFile: "citrix.svg",
    textColor: "text-[#452170]",
    bgColor: "bg-violet-50",
  },
  {
    name: "Acronis",
    role: "Cyber Protect Authorized Partner / MSP",
    domain: "data-protection",
    logoFile: "acronis.svg",
    textColor: "text-[#cc0000]",
    bgColor: "bg-red-50",
  },
];

export const navLinks = [
  { href: "/practices", label: "Practices", description: "보안 워크스페이스·데이터 보호" },
  { href: "/insights", label: "Insights", description: "기술 콘텐츠·가이드" },
  { href: "/tools", label: "Tools", description: "진단·계산 도구" },
  { href: "/about", label: "About", description: "회사 소개·인증" },
] as const;

export const ctaLink = {
  href: "/tools/risk-assessment",
  label: "N²SF 진단 시작",
  shortLabel: "진단 시작",
};
