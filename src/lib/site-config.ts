/**
 * Corporate site configuration.
 *
 * Myloket((주)마이로켓)의 단일 출처 of truth — 회사 정보, 2-Practice 메타데이터,
 * 파트너십·인증, navigation·footer에서 공유하는 값.
 *
 * 향후 i18n: 한국어 only로 출발, label_ko/label_en 슬롯 마련 예정.
 */

export const company = {
  name: "Myloket",
  nameKo: "마이로켓",
  legalName: "(주)마이로켓",
  legalNameEn: "Myloket Inc.",
  tagline: "Enterprise Workspace Security · Data Protection",
  taglineKo: "기업 보안 워크스페이스·데이터 보호 전문",
  description:
    "공공·금융 기관을 위한 보안 워크스페이스(VDI·Zero Trust·N²SF)와 데이터 보호(백업·DR·사이버복원력) 전문 컨설팅·운영 서비스.",
  email: "contact@mlkit.co.kr",
  domain: "myloket.co.kr",
  copyrightYear: new Date().getFullYear(),
} as const;

/**
 * 법적 사업자 정보 (전자상거래법 §10·정보통신망법·개인정보보호법 §30 표시 의무).
 *
 * 표시 위치: footer / /legal/privacy / /legal/terms / /about
 *
 * ⚠️ TODO(2026-Q2): 빈 문자열인 필드는 사용자가 직접 입력 후 배포 — 빈 채로 운영하면 KISA·공정위 점검 시 시정명령 대상.
 * Red Team Round 2 (2026-05-01) — 본 구조 추가됨, 실 데이터 입력 후 disclosed 전환.
 */
export const companyLegal = {
  /** 사업자등록번호 — 형식: "000-00-00000" */
  businessNumber: "",
  /** 통신판매업 신고번호 — 형식: "제 0000-OO시OO구-0000호" (해당 시) */
  mailOrderRegNumber: "",
  /** 대표자 (실명) */
  representativeName: "",
  /** 본점 소재지 (도로명 전체 주소) */
  address: "",
  /** 대표 전화 — 형식: "02-0000-0000" */
  phone: "",
  /** 팩스 (선택) */
  fax: "",
  /**
   * 개인정보보호 책임자 (법 §31 — 직책·실명·연락처 명시 의무).
   * 실명·직책 입력 후 footer/privacy 자동 노출.
   */
  privacyOfficer: {
    name: "",      // 예: "홍길동"
    role: "",      // 예: "CISO" / "개인정보보호 책임자" / "CTO 겸 책임자"
    email: "contact@mlkit.co.kr",
    phone: "",     // 직통 전화 (대표 전화와 다를 경우)
  },
} as const;

/**
 * companyLegal 필드 중 표시 가능한 것만 골라내는 헬퍼.
 * 빈 문자열은 "데이터 미입력 = 표시 안 함" — 사용자에게 거짓 정보 노출 차단.
 */
export function hasLegalInfo(): boolean {
  return Boolean(
    companyLegal.businessNumber ||
    companyLegal.representativeName ||
    companyLegal.address ||
    companyLegal.phone
  );
}

export function hasPrivacyOfficer(): boolean {
  return Boolean(companyLegal.privacyOfficer.name && companyLegal.privacyOfficer.role);
}

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

/**
 * 인증 상태 단계 (정직한 표시 — RFP 평가위원·발주처가 검증할 수 있는 수준).
 * - "preparing"   : 준비 단계 (내부 갭 분석·문서화 진행, 신청 전)
 * - "applied"     : 신청 완료 (심사기관 접수, 심사 대기·진행 중)
 * - "in_review"   : 심사 진행 중 (실사·인터뷰 수행 중)
 * - "certified"   : 인증 보유 (인증서 번호·유효기간 표시)
 * - "not_pursued" : 추진하지 않음 (해당 없음을 명시)
 */
export type CertificationStatus = "preparing" | "applied" | "in_review" | "certified" | "not_pursued";

export interface Certification {
  name: string;
  desc: string;
  status: CertificationStatus;
  /** 목표 시점 (preparing/applied 단계에서) — 예: "2026 Q3" */
  targetMilestone?: string;
  /** 인증서 번호 (certified 단계 필수) */
  certificateId?: string;
  /** 유효 기간 (certified 단계 필수) — 예: "2026.05 ~ 2029.05" */
  validUntil?: string;
  /** 심사기관 (applied/in_review/certified 시) — 예: "KISA / KAIT" */
  certifyingBody?: string;
  /** 인증 범위 (scope) — 예: "본사 보안 컨설팅 서비스" */
  scope?: string;
}

/**
 * Red Team Round 2 (2026-05-01) — "(예정)" 표기 정직화.
 *
 * 원칙: "(예정)" 같은 모호한 표기 금지. 실제 단계(preparing/applied/in_review/certified) 명시.
 * 단계 진전 시 status 필드만 업데이트하면 자동으로 표시 변경.
 */
export const certifications: Certification[] = [
  {
    name: "ISMS-P",
    desc: "정보보호 및 개인정보보호 관리체계 인증",
    status: "preparing",
    targetMilestone: "2026 Q3 신청 목표",
    certifyingBody: "KISA / KAIT (검토 중)",
    scope: "본사 보안 자문·MSP 운영 서비스",
  },
  {
    name: "ISO/IEC 27001",
    desc: "정보보안 경영 시스템 (ISMS-P 인증 후 단계적 추진 검토)",
    status: "preparing",
    targetMilestone: "2027 H1 검토",
  },
];

/** 인증 상태 한글 라벨 (UI 노출용) */
export const certificationStatusLabel: Record<CertificationStatus, { label: string; color: string }> = {
  preparing:    { label: "준비 단계",     color: "amber" },
  applied:      { label: "신청 완료",     color: "blue" },
  in_review:    { label: "심사 진행 중",  color: "indigo" },
  certified:    { label: "인증 보유",     color: "emerald" },
  not_pursued:  { label: "해당 없음",     color: "gray" },
};

export interface LeaderProfile {
  /** 슬롯 식별자 (URL·anchor·photo 파일명에 사용) */
  slot: string;
  /** 직책 (필수, placeholder 표시용) */
  role: string;
  /** 실명 — 미공개 시 undefined → "정보 업데이트 예정" 노출 */
  name?: string;
  /** 1-2 문장 약력 */
  bio?: string;
  /** /public/team/ 하위 사진 파일명 (확장자 포함). 미준비 시 이니셜 fallback */
  photoFile?: string;
  /** 핵심 전문 분야 태그 */
  expertise?: string[];
  email?: string;
  linkedinUrl?: string;
}

/**
 * Leadership 슬롯 — name·photo가 비어있으면 placeholder 표시.
 * 정보 채워지면 자동으로 정상 노출 (별도 코드 변경 불필요).
 */
export const leadership: LeaderProfile[] = [
  {
    slot: "ceo",
    role: "CEO · Founder",
    expertise: ["기업 보안 전략", "공공·금융 컨설팅"],
  },
  {
    slot: "secure-workspace-lead",
    role: "보안 워크스페이스 Practice 리드",
    expertise: ["VDI", "Zero Trust", "N²SF"],
  },
  {
    slot: "data-protection-lead",
    role: "데이터 보호 Practice 리드",
    expertise: ["Acronis Cyber Protect", "DR/BCP"],
  },
  {
    slot: "tech-lead",
    role: "기술 리드 (CTO)",
    expertise: ["인프라 자동화", "보안 아키텍처"],
  },
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

export type CustomerCategory = "public" | "research" | "private";

export interface Customer {
  /** 약칭 코드 (영문) */
  code: string;
  /** 정식 기관명 (한글) */
  name: string;
  /** 카테고리: public(공공기관), research(정부출연연구기관), private(민간) */
  category: CustomerCategory;
  /** 외부 표기 동의 받음 — false면 익명화 표기 ("공공·연구기관 A" 등) */
  disclosed: boolean;
  /** 익명화 표기 시 사용할 라벨 (disclosed=false 일 때) */
  anonymizedLabel?: string;
  /** 환경 비고 (선택, 내부용) */
  note?: string;
}

/**
 * 운영 중 고객사 (Maint 프로젝트 기준).
 *
 * 동의 정책:
 * - disclosed=true: 외부 공개 동의 받음 (정식명 노출)
 * - disclosed=false: 동의 미확인 — anonymizedLabel로 익명화 노출
 *
 * 디폴트는 false (안전한 기본값). 동의 확인 후 true로 전환.
 * KINS·KINAC 등 안보 민감 기관은 동의 받기 전까지 영구 익명 권장.
 */
export const customers: Customer[] = [
  { code: "MODS", name: "국가데이터처", category: "public", disclosed: false, anonymizedLabel: "중앙행정 데이터 기관", note: "통계정보원(Kosii) SDC 통계데이터센터 VDI" },
  { code: "MPM", name: "인사혁신처", category: "public", disclosed: false, anonymizedLabel: "중앙행정기관 A", note: "Citrix Virtual Desktop / XenServer" },
  { code: "SFD", name: "세종소방", category: "public", disclosed: false, anonymizedLabel: "지방자치단체 소방조직" },
  { code: "KIEP", name: "대외경제정책연구원", category: "research", disclosed: false, anonymizedLabel: "정부 출연 경제정책 연구기관" },
  { code: "KRIHS", name: "국토연구원", category: "research", disclosed: false, anonymizedLabel: "정부 출연 국토 연구기관" },
  { code: "KISTI", name: "한국과학기술정보연구원", category: "research", disclosed: false, anonymizedLabel: "정부 출연 과학기술정보 연구기관" },
  { code: "KLRI", name: "한국법제연구원", category: "research", disclosed: false, anonymizedLabel: "정부 출연 법제 연구기관" },
  { code: "KRISO", name: "선박해양플랜트연구소", category: "research", disclosed: false, anonymizedLabel: "정부 출연 해양 연구기관" },
  { code: "KINS", name: "한국원자력안전기술원", category: "research", disclosed: false, anonymizedLabel: "원자력 규제 R&D 기관" },
  { code: "KINAC", name: "한국원자력통제기술원", category: "research", disclosed: false, anonymizedLabel: "원자력 규제 R&D 기관" },
  { code: "DJGLASS", name: "대진글라스", category: "private", disclosed: false, anonymizedLabel: "민간 제조 기업" },
];

/** 외부 노출용 표기 — disclosed=false면 익명 라벨 반환 */
export function customerDisplayName(c: Customer): string {
  return c.disclosed ? c.name : (c.anonymizedLabel || `${customerCategoryLabel[c.category]} 운영 고객`);
}

export const customerCategoryLabel: Record<CustomerCategory, string> = {
  public: "공공기관",
  research: "정부 출연 연구기관",
  private: "민간 기업",
};

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
  { href: "/contact", label: "Contact", description: "상담 문의" },
] as const;

export const ctaLink = {
  href: "/tools/risk-assessment",
  label: "N²SF 진단 시작",
  shortLabel: "진단 시작",
};
