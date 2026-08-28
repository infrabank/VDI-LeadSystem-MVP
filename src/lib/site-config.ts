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
  tagline: "IT Maintenance & VDI Support",
  taglineKo: "VDI 구축·기술지원 · 전산 통합 유지보수 · 백업 복구검증",
  description:
    "공공기관·연구기관의 가상 데스크톱(VDI)을 구축·운영·유지보수해 온 엔지니어가 " +
    "서버·네트워크·백업까지 기업 전산환경 전체를 관리합니다. " +
    "Citrix·Omnissa Horizon VDI 기술지원, Acronis·Vinchin 백업 복구검증.",
  email: "contact@mlkit.co.kr",
  domain: "myloket.co.kr",
  copyrightYear: new Date().getFullYear(),
} as const;

/**
 * 회사가 직접 관리하는 외부 공식 프로필 — Organization JSON-LD의 sameAs로 출력됨.
 * 검색엔진·AI가 동일 회사임을 연결하는 근거. 실제 관리 중인 프로필만 추가할 것.
 * (Google 비즈니스 프로필·네이버 스마트플레이스·LinkedIn 등 — 승인 후 최종 URL 입력)
 */
export const companyProfiles: string[] = [
  // Google 비즈니스 프로필 (2026-07-18 등록) — 두 형태 모두 같은 프로필의 정규 식별 URL
  "https://maps.google.com/?cid=13368138966729633881", // Maps 고유 CID 링크 (가장 안정적)
  "https://www.google.com/search?kgmid=/g/11nr84lxvz", // 지식패널 kgmid
  // "https://map.naver.com/p/entry/place/…", // 네이버 스마트플레이스 (검토 중 — 승인 후 입력)
  // "https://www.linkedin.com/company/…",
];

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
  businessNumber: "216-88-00409",
  /** 통신판매업 신고번호 — 형식: "제 0000-OO시OO구-0000호" (해당 시) */
  mailOrderRegNumber: "2018-세종아름-0019",
  /** 대표자 (실명) */
  representativeName: "제현우",
  /** 본점 소재지 (도로명 전체 주소) */
  address: "세종특별자치시 집현중앙7로 6, 지식산업센터 B동 609호 (집현동)",
  /** 대표 전화 — 형식: "02-0000-0000" */
  phone: "010-3861-8079",
  /** 팩스 (선택) */
  fax: "02-6280-8087",
  /**
   * 개인정보보호 책임자 (법 §31 — 직책·실명·연락처 명시 의무).
   * 실명·직책 입력 후 footer/privacy 자동 노출.
   */
  privacyOfficer: {
    name: "제현우", // 예: "홍길동"
    role: "CISO", // 예: "CISO" / "개인정보보호 책임자" / "CTO 겸 책임자"
    email: "contact@mlkit.co.kr",
    phone: "010-3861-8079", // 직통 전화 (대표 전화와 다를 경우)
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
    companyLegal.phone,
  );
}

export function hasPrivacyOfficer(): boolean {
  return Boolean(
    companyLegal.privacyOfficer.name && companyLegal.privacyOfficer.role,
  );
}

export type PracticeId =
  | "vdi-workspace"
  | "mfa-access"
  | "data-protection"
  | "managed-integration";

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
  primaryColor: string; // tailwind color name (blue, indigo, emerald, purple 등)
}

export const practices: Record<PracticeId, Practice> = {
  "managed-integration": {
    id: "managed-integration",
    href: "/practices/managed-integration",
    brand: "Transition Diagnosis",
    title: "N²SF 전환 사전진단",
    shortTitle: "N²SF 사전진단",
    tagline: "공공기관 VDI·망분리 환경의 N²SF 정렬 진단·로드맵",
    description:
      "공공기관·연구기관·기존 VDI 운영 기관을 위한 N²SF 전환 1차 진단입니다. 현재 VDI/망분리 구조를 분석한 뒤 업무를 C/S/O 등급으로 예비 분류합니다. 어디는 유지하고 어디는 축소하며 어디는 전환할지 1차 로드맵을 도출합니다. 후속 구축 사업의 RFP 문구와 보안성 검토 산출물 초안까지 정리합니다.",
    pillars: [
      {
        title: "현재 VDI/망분리 구조도",
        desc: "물리·논리 구성, 사용자군, 외부 협력사 접근 경로 정리",
      },
      {
        title: "C/S/O 예비 분류",
        desc: "업무·시스템 단위 N²SF 등급 예비 검토와 근거 메모",
      },
      {
        title: "유지·축소·전환 대상 구분",
        desc: "기존 VDI/망연계/UAG/외부접속을 등급별 시나리오에 매핑",
      },
      {
        title: "1차 전환 로드맵·RFP 문구",
        desc: "단계별 일정·전제·증빙, 발주 시점에 쓸 RFP 반영 문구 초안",
      },
    ],
    ctaLabel: "N²SF 전환 사전진단 상담",
    ctaHref: "/about#contact",
    primaryColor: "purple",
  },
  "vdi-workspace": {
    id: "vdi-workspace",
    href: "/practices/vdi-workspace",
    brand: "VDI Repositioning",
    title: "VDI 역할 재정의 컨설팅",
    shortTitle: "VDI 재정의",
    tagline: "N²SF 이후 VDI를 어디에 남길지 판단·시나리오 설계",
    description:
      "Citrix·VMware·Omnissa VDI를 공공·연구기관에서 다년간 설계·구축·운영해 왔습니다. 그 경험으로 N²SF 이후 VDI의 역할을 재정의합니다. 완전 유지, 일부 축소, DaaS 전환, 고위험 업무만 VDI 유지, 외부 협력사용 VDI 재정의 같은 시나리오를 비교하면서 운영 리스크와 비용을 판단합니다.",
    pillars: [
      {
        title: "전환 시나리오 비교",
        desc: "유지·축소·DaaS·RBI/CDS·Zero Trust 조합을 비용·리스크 기준으로 비교",
      },
      {
        title: "고위험·외부 협력사 분리 설계",
        desc: "VDI를 어디에 남기고 어디에 다른 통제로 대체할지 결정",
      },
      {
        title: "운영 리스크 판단",
        desc: "FSLogix·UAG·NetScaler·인증서·라이선스 등 실제 장애 패턴 기반 리스크 평가",
      },
      {
        title: "DaaS 전환 자문",
        desc: "Citrix DaaS·Azure Virtual Desktop·Windows 365 적합성과 한계",
      },
    ],
    ctaLabel: "VDI 역할 재정의 상담",
    ctaHref: "/about#contact",
    primaryColor: "blue",
  },
  "mfa-access": {
    id: "mfa-access",
    href: "/practices/mfa-access",
    brand: "MFA Design",
    title: "MFA QuickStart for VDI/DaaS",
    shortTitle: "MFA QuickStart",
    tagline: "어디에 붙이고 예외정책과 장애 대응은 어떻게 설계할지",
    description:
      "MFA를 솔루션으로 팔지 않습니다. VDI·DaaS·외부 협력사 접속의 어느 지점에 어떻게 붙일지를 설계합니다. M365 기반은 Microsoft Entra ID로, 행정 전자서명(GPKI/NPKI) 기반 공공기관은 라온시큐어로 대응합니다. 사용자군별 정책, 예외 계정, 장애 시 우회 절차까지 정리합니다.",
    pillars: [
      {
        title: "사용자군별 인증 흐름도",
        desc: "내부직원·외부 협력사·관리자·시스템 계정 분리 설계",
      },
      {
        title: "예외·장애 우회 정책",
        desc: "MFA 장애 시 운영 중단을 막는 우회 절차와 감사 기록",
      },
      {
        title: "관리자·특권 계정 보호",
        desc: "Conditional Access·PAM·세션 격리 정책 설계",
      },
      {
        title: "PoC 체크리스트",
        desc: "도입 전 검증해야 할 항목과 종료 기준",
      },
    ],
    ctaLabel: "MFA QuickStart 상담",
    ctaHref: "/about#contact",
    primaryColor: "indigo",
  },
  "data-protection": {
    id: "data-protection",
    href: "/practices/data-protection",
    brand: "Recovery Verification",
    title: "백업·DR 복구검증 서비스",
    shortTitle: "복구검증",
    tagline: "사고 시 실제 복구 가능한지 매월 검증·증빙",
    description:
      'Acronis Cyber Protect 인증 파트너로 백업·DR·EDR을 운영합니다. 다만 저희가 파는 것은 단순 백업이 아니라 "사고 시 실제 복구 가능한지"를 검증하는 일입니다. 월간 복구 테스트 리포트, RTO/RPO 기준표, 랜섬웨어 24시간 대응 절차, 중요 시스템별 복구 우선순위, 백업 무결성 검증 결과를 정기적으로 산출합니다.',
    pillars: [
      {
        title: "월간 복구 테스트 리포트",
        desc: "주요 시스템 복구 시연·결과 기록·개선 권고",
      },
      {
        title: "RTO/RPO 기준표",
        desc: "시스템별 목표 시간·복원 우선순위·책임자 명시",
      },
      {
        title: "랜섬웨어 24시간 대응 절차",
        desc: "사고 발생 시점부터 복원까지 절차·연락 체계·산출물",
      },
      {
        title: "백업 무결성 검증",
        desc: "정기 자동 검증과 EDR·롤백 연계 운영",
      },
    ],
    ctaLabel: "복구검증 서비스 상담",
    ctaHref: "/about#contact",
    primaryColor: "emerald",
  },
};

export const practicesList: Practice[] = [
  practices["managed-integration"],
  practices["vdi-workspace"],
  practices["mfa-access"],
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
export type CertificationStatus =
  | "preparing"
  | "applied"
  | "in_review"
  | "certified"
  | "not_pursued";

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
    desc: "정보보안 경영 시스템 (ISMS-P 인증을 받은 뒤 단계를 나눠 검토)",
    status: "preparing",
    targetMilestone: "2027 H1 검토",
  },
];

/** 인증 상태 한글 라벨 (UI 노출용) */
export const certificationStatusLabel: Record<
  CertificationStatus,
  { label: string; color: string }
> = {
  preparing: { label: "준비 단계", color: "amber" },
  applied: { label: "신청 완료", color: "blue" },
  in_review: { label: "심사 진행 중", color: "indigo" },
  certified: { label: "인증 보유", color: "emerald" },
  not_pursued: { label: "해당 없음", color: "gray" },
};

/**
 * 엔지니어 기술자격 (벤더 공식 기술자격) — 회사 정보보호 인증(certifications)과 구분.
 *
 * 원칙(2026-06-23): 회사 인증이 아니라 *대표 엔지니어 개인*이 보유한 벤더 공식 자격임을
 * 명확히 표기. 실제 솔루션을 다룰 역량 증빙 용도. 인증서 번호·발급기관·보유자를 모두 명시해
 * 발주처·고객이 검증할 수 있는 수준으로 정직하게 노출.
 */
export interface EngineerCredential {
  /** 자격 약칭 (예: "VBTP") */
  code: string;
  /** 정식 명칭 */
  name: string;
  /** 발급 기관 */
  issuer: string;
  /** 보유자 (엔지니어 실명·직책) */
  holder: string;
  /** 인증서 번호 */
  certificateId: string;
  /** 발급일 — 예: "2026.06.23" */
  issuedOn: string;
  /** 유효 기간 — 예: "2026.06 ~ 2029.06" */
  validUntil: string;
  /** 한 줄 설명 */
  desc: string;
  /** public/credentials/ 하위 인증서 이미지 파일명 (확장자 포함) */
  imageFile?: string;
  /** 연관 파트너 솔루션명 (배지 매칭용) — 예: "Vinchin Backup & Recovery" */
  relatedSolution?: string;
}

export const engineerCredentials: EngineerCredential[] = [
  {
    code: "VBTP",
    name: "Vinchin Backup Technology Professional",
    issuer: "Chengdu Vinchin Technology Co., Ltd.",
    holder: "제현우 (대표 · 수석 기술지원 엔지니어)",
    certificateId: "VBTP-158879215260623",
    issuedOn: "2026.06.23",
    validUntil: "2026.06 ~ 2029.06 (3년)",
    desc:
      "Vinchin Channel Partner Technology Training 과정을 이수하고 Vinchin Backup & Recovery의 " +
      "백업·복구 기술 역량을 검증받은 벤더 공식 기술자격입니다.",
    imageFile: "vinchin-vbtp.jpg",
    relatedSolution: "Vinchin Backup & Recovery",
  },
];

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
 * Leadership — 1인 전문 회사 정직 표기.
 *
 * 분석 노트(2026-05-03): "4명 슬롯 + 정보 업데이트 예정" 구조는 1인기업의 빈틈으로 보임.
 * 대신 대표 단일 카드 + "구축은 검증된 파트너 컨소시엄으로 수행"이라는 구조를 명시.
 */
export const leadership: LeaderProfile[] = [
  {
    slot: "founder",
    role: "대표 · 수석 기술지원 엔지니어",
    name: "제현우",
    // public/team/founder.jpg 업로드 시 홈·About에 자동 노출 (없으면 이니셜/로고 폴백)
    photoFile: "founder.jpg",
    bio:
      "공공·정부출연연구기관 10여 곳의 Citrix Virtual Apps and Desktops · Omnissa Horizon 기반 VDI를 " +
      "다년간 설계·구축·운영·유지보수해 왔습니다. 접속장애, FSLogix/프로파일, UAG·NetScaler, 인증서, " +
      "스토리지·네트워크 병목, Acronis·Vinchin 백업 복구검증까지 운영 현장에서 실제로 터지는 문제를 패턴으로 분류해 " +
      "같은 기준으로 대응합니다. N²SF 등 공공기관 보안환경 이해를 바탕으로 보고서·증빙 산출물도 작성합니다.",
    expertise: [
      "Citrix Virtual Apps and Desktops",
      "Citrix NetScaler / Gateway",
      "Omnissa Horizon · UAG",
      "VMware vSphere · ESXi · vCenter",
      "FSLogix · Citrix Profile Management",
      "Acronis Cyber Protect · 백업 복구검증",
      "Vinchin Backup & Recovery · 가상화 VM 백업",
      "공공기관 운영 보고서 · N²SF 환경 이해",
    ],
    email: "jhw@mlkit.co.kr",
  },
];

export interface Partnership {
  name: string;
  role: string;
  domain: PracticeId;
  /** /public/partners/ 하위 SVG 파일명 (확장자 포함). 자산 업로드 후 활성화. */
  logoFile?: string;
  /** 로고 미준비 시 텍스트 칩 색상 (tailwind class) */
  textColor: string;
  bgColor: string;
  /**
   * 공식 파트너 계약 여부 — false인 벤더가 생기면 "기술지원 제품"으로 구분 표기할 것.
   * 2026-07-18 대표 확인: 현재 5개 벤더 모두 공식 파트너.
   */
  official: boolean;
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
  /**
   * 신뢰 증빙 필드 (모두 optional, 외부 노출용).
   * 기관명은 익명이어도 *어떤 기술을 어떤 규모로 어떤 책임으로* 다뤘는지 알 수 있도록 함.
   * 채워지면 CustomerShowcase grouped variant에서 카드 본문에 노출.
   */
  /** 사용 벤더·솔루션 (예: "Citrix XenDesktop / NetScaler") */
  vendor?: string;
  /** 사용자 규모 범위 (예: "약 200~500 사용자") */
  userScale?: string;
  /** 수행 역할 (예: "VDI 운영·UAG 운영 안정화·Agent 장애 대응") */
  role?: string;
  /** 해결한 리스크 — chip 배지로 노출 */
  solvedRisks?: string[];
  /** 산출물 유형 — 추가 정보, 노출은 선택 */
  deliverables?: string[];
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
  {
    code: "MODS",
    name: "국가데이터처",
    category: "public",
    disclosed: false,
    anonymizedLabel: "중앙행정 데이터 기관",
    note: "통계정보원(Kosii) SDC 통계데이터센터 VDI",
    vendor: "Omnissa Horizon / VMware ESXi",
    userScale: "연구원·전문가·대학교수 수백 명",
    role: "VDI 구축·운영·유지보수 지원 (통계 분석 환경)",
    solvedRisks: ["장애 전반 대응", "VDI 단말기 유지보수"],
    deliverables: [
      "월간 운영 리포트",
      "장애 사후 분석 보고서",
      "PowerCLI 기반 스토리지 사용률 대시보드 제공",
    ],
  },
  {
    code: "MPM",
    name: "인사혁신처",
    category: "public",
    disclosed: false,
    anonymizedLabel: "중앙행정기관 A",
    note: "Citrix Virtual Desktop / XenServer",
  },
  {
    code: "SFD",
    name: "세종소방",
    category: "public",
    disclosed: false,
    anonymizedLabel: "지방자치단체 소방조직",
  },
  {
    code: "KIEP",
    name: "대외경제정책연구원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "정부 출연 경제정책 연구기관",
  },
  {
    code: "KRIHS",
    name: "국토연구원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "정부 출연 국토 연구기관",
    vendor: "Omnissa Horizon · UAG (VMware ESXi)",
    userScale: "약 100~300 연구원",
    role: "Horizon·UAG 운영, 외부접속 안정화",
    solvedRisks: ["외부접속 안정화", "사용자 환경 표준화"],
    deliverables: ["월간 운영 리포트"],
  },
  {
    code: "KISTI",
    name: "한국과학기술정보연구원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "정부 출연 과학기술정보 연구기관",
    vendor: "Citrix · Omnissa Workspace ONE",
    userScale: "수백 명 규모",
    role: "멀티 벤더 운영 + 마이그레이션 자문",
    solvedRisks: ["멀티 벤더 호환성", "벤더 정책 변경 및 전환 리스크 검토"],
    deliverables: ["마이그레이션 가이드"],
  },
  {
    code: "KLRI",
    name: "한국법제연구원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "정부 출연 법제 연구기관",
  },
  {
    code: "KRISO",
    name: "선박해양플랜트연구소",
    category: "research",
    disclosed: false,
    anonymizedLabel: "정부 출연 해양 연구기관",
  },
  {
    code: "KINS",
    name: "한국원자력안전기술원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "원자력 규제 R&D 기관",
  },
  {
    code: "KINAC",
    name: "한국원자력통제기술원",
    category: "research",
    disclosed: false,
    anonymizedLabel: "원자력 규제 R&D 기관",
  },
  {
    code: "DJGLASS",
    name: "대진글라스",
    category: "private",
    // 2026-06-10 홈페이지 개편 — 대표 지시로 정식명 노출 전환
    disclosed: true,
    anonymizedLabel: "민간 제조 기업",
    role: "전산 통합 유지보수 (서버·네트워크·PC)",
  },
  {
    code: "LABKOREA",
    name: "랍코리아",
    category: "private",
    // 2026-06-10 홈페이지 개편 — 대표 지시로 정식명 노출
    disclosed: true,
    anonymizedLabel: "민간 기업",
    role: "전산 통합 유지보수",
  },
  {
    code: "HOOPKOREA",
    name: "후프코리아",
    category: "private",
    // 2026-06-10 홈페이지 개편 — 대표 지시로 정식명 노출
    disclosed: true,
    anonymizedLabel: "민간 기업",
    role: "전산 통합 유지보수",
  },
];

/** 홈 S5 고객사 텍스트 스트립 — 노출 동의된 민간(중소기업) 고객사만 */
export const smbCustomers: Customer[] = customers.filter(
  (c) => c.category === "private" && c.disclosed,
);

/** 외부 노출용 표기 — disclosed=false면 익명 라벨 반환 */
export function customerDisplayName(c: Customer): string {
  return c.disclosed
    ? c.name
    : c.anonymizedLabel || `${customerCategoryLabel[c.category]} 운영 고객`;
}

export const customerCategoryLabel: Record<CustomerCategory, string> = {
  public: "공공기관",
  research: "정부 출연 연구기관",
  private: "민간 기업",
};

export const partnerships: Partnership[] = [
  {
    name: "Citrix",
    role: "Virtual Apps & Desktops · DaaS · NetScaler",
    domain: "vdi-workspace",
    logoFile: "citrix.svg",
    textColor: "text-[#452170]",
    bgColor: "bg-violet-50",
    official: true,
  },
  {
    name: "VMware",
    role: "Horizon · vSphere",
    domain: "vdi-workspace",
    logoFile: "vmware.svg",
    textColor: "text-[#607078]",
    bgColor: "bg-gray-50",
    official: true,
  },
  {
    name: "Omnissa",
    role: "Horizon · Workspace ONE UEM",
    domain: "vdi-workspace",
    logoFile: "omnissa.svg",
    textColor: "text-[#0072ad]",
    bgColor: "bg-sky-50",
    official: true,
  },
  {
    name: "Acronis",
    role: "Cyber Protect Authorized Partner / MSP",
    domain: "data-protection",
    logoFile: "acronis.svg",
    textColor: "text-[#cc0000]",
    bgColor: "bg-red-50",
    official: true,
  },
  {
    name: "Vinchin",
    role: "Backup & Recovery · 가상화 VM 백업·즉시 복구 · Silver Partner",
    domain: "data-protection",
    logoFile: "vinchin.png",
    textColor: "text-[#00704d]",
    bgColor: "bg-teal-50",
    official: true,
  },
];

export interface NavChild {
  href: string;
  label: string;
  description: string;
}

export interface NavLink {
  href: string;
  label: string;
  description: string;
  /** 드롭다운 하위 항목 — 있으면 GNB에서 메뉴로 펼쳐짐 */
  children?: NavChild[];
}

export const navLinks: NavLink[] = [
  {
    href: "/services/vdi-support",
    label: "VDI 기술지원",
    description: "Citrix · Omnissa Horizon 구축·장애 대응",
  },
  {
    href: "/services/it-maintenance",
    label: "전산유지보수",
    description: "서버·PC·네트워크·프린터 통합 관리",
  },
  {
    href: "/services/acronis-backup",
    label: "백업·보안",
    description: "백업 점검·복구 검증·보안 설정 점검",
    children: [
      {
        href: "/services/acronis-backup",
        label: "백업·보안 점검",
        description: "복구 가능성·보안 설정 점검 서비스",
      },
      {
        href: "/products/acronis-cyber-protect",
        label: "Acronis Cyber Protect",
        description: "서버·PC·NAS 백업 + 랜섬웨어 방어",
      },
      {
        href: "/products/vinchin-backup",
        label: "Vinchin Backup & Recovery",
        description: "가상화 VM 백업·즉시 복구",
      },
    ],
  },
  {
    href: "/tools",
    label: "진단 도구",
    description: "무료 자가진단 · 웹 리포트 + PDF 제공",
    children: [
      {
        href: "/tools/backup-readiness",
        label: "백업·사이버복원력 자가 진단",
        description: "7영역 25문항 · 성숙도와 보완 우선순위",
      },
      {
        href: "/tools/backup-roi",
        label: "백업 ROI 계산기",
        description: "5년 누적 회피 비용·ROI·Payback 산출",
      },
      {
        href: "/tools/vdi-transition",
        label: "VDI 역할 재정의 진단",
        description: "유지·보완·축소·재설계 시나리오 후보",
      },
      {
        href: "/tools",
        label: "전체 진단 도구 보기",
        description: "N²SF 정렬·전환 준비도·운영 ROI 등 6종",
      },
    ],
  },
  {
    href: "/case-studies",
    label: "고객사례",
    description: "실제 기업 전산환경 유지보수 경험",
  },
  {
    href: "/contact",
    label: "문의",
    description: "전산환경 점검·유지보수 상담",
  },
];

export const ctaLink = {
  href: "/contact?source=header",
  label: "문의하기",
  shortLabel: "문의",
};

/**
 * 핵심 기술지원 분야.
 * Citrix Virtual Apps and Desktops / Omnissa Horizon / Acronis Cyber Protect / Vinchin Backup & Recovery.
 * lines: 카드 본문 2줄 (담백한 톤).
 */
export interface SupportArea {
  id: string;
  brand: string;
  lines: string[];
  accent: "blue" | "indigo" | "emerald";
}

export const supportAreas: SupportArea[] = [
  {
    id: "citrix",
    brand: "Citrix Virtual Apps and Desktops",
    lines: [
      "접속 장애, StoreFront, Delivery Controller, VDA, Gateway 문제를 봅니다.",
      "프로파일, 인증서, 라이선스 이슈도 함께 점검합니다.",
    ],
    accent: "blue",
  },
  {
    id: "horizon",
    brand: "Omnissa Horizon",
    lines: [
      "Connection Server, UAG, Agent, Client, Instant Clone 문제를 봅니다.",
      "Blast, PCoIP, FSLogix, vSphere 연계 이슈도 확인합니다.",
    ],
    accent: "indigo",
  },
  {
    id: "acronis",
    brand: "Acronis Cyber Protect",
    lines: [
      "서버·PC·NAS 백업 정책, 실패 이력, 에이전트 상태를 점검합니다.",
      "필요하면 복구 테스트와 결과 보고서를 정리합니다.",
    ],
    accent: "emerald",
  },
  {
    id: "vinchin",
    brand: "Vinchin Backup & Recovery",
    lines: [
      "VMware·Hyper-V·Proxmox·XenServer 등 가상화 VM을 에이전트리스로 백업합니다.",
      "즉시 복구·V2V 마이그레이션과 백업 복구검증을 함께 지원합니다.",
    ],
    accent: "emerald",
  },
];

/**
 * 홈페이지 — 유지보수 4 패키지.
 * 가격이 아닌 운영자 관점의 유지보수 유형.
 * lines: 2줄 본문 (대상/제공 라벨 제거).
 */
export interface MaintenancePackage {
  id: string;
  no: string;
  title: string;
  lines: string[];
  accent: "blue" | "indigo" | "amber" | "emerald";
}

export const maintenancePackages: MaintenancePackage[] = [
  {
    id: "monthly-checkup",
    no: "01",
    title: "월간 점검",
    lines: [
      "서비스 상태, 인증서, 라이선스, 백업 성공률을 정기 점검합니다.",
      "월간 보고서를 제공합니다.",
    ],
    accent: "blue",
  },
  {
    id: "incident-response",
    no: "02",
    title: "장애 대응",
    lines: [
      "접속 장애, 로그인 지연, 백업 실패 원인을 확인합니다.",
      "로그와 설정을 보고 조치 방향을 정리합니다.",
    ],
    accent: "amber",
  },
  {
    id: "operations-improvement",
    no: "03",
    title: "운영 개선",
    lines: [
      "반복되는 성능 저하와 프로파일 문제를 봅니다.",
      "구성, 병목, 운영 절차를 함께 정리합니다.",
    ],
    accent: "indigo",
  },
  {
    id: "recovery-verification",
    no: "04",
    title: "복구검증",
    lines: [
      "백업이 실제로 복구되는지 확인합니다.",
      "복구 테스트 결과를 보고서로 남깁니다.",
    ],
    accent: "emerald",
  },
];

/**
 * 홈페이지 — 운영현장에서 실제로 마주치는 문제 6건.
 */
export const operationalIssues: { title: string; detail: string }[] = [
  { title: "접속이 안 됩니다", detail: "UAG, Gateway, 인증서, DNS를 함께 봅니다." },
  { title: "로그인이 느립니다", detail: "프로파일, FSLogix, 스토리지를 확인합니다." },
  { title: "인증서가 문제를 만듭니다", detail: "만료, 체인, CRL 설정을 점검합니다." },
  { title: "VDI가 느립니다", detail: "호스트, 데이터스토어, 네트워크 병목을 봅니다." },
  { title: "백업은 되는데 불안합니다", detail: "정책과 실패 이력을 확인합니다." },
  { title: "복구가 검증되지 않았습니다", detail: "실제 복구 가능성을 점검합니다." },
];

/**
 * 홈페이지 — 왜 마이로켓인가 (5 실무 신뢰 카드).
 */
export const trustSignals: { title: string; detail: string }[] = [
  { title: "VDI 장애 경험", detail: "접속, 프로파일, 인증서, UAG 문제를 다뤄왔습니다." },
  { title: "인프라까지 확인", detail: "vSphere, 스토리지, 네트워크 병목을 함께 봅니다." },
  { title: "보고서 작성", detail: "점검 결과와 조치 내역을 제출 가능한 형태로 정리합니다." },
  { title: "복구검증", detail: "백업 성공 여부가 아니라 실제 복구 가능성을 봅니다." },
  { title: "SI 협업", detail: "영업, 제안, 고객 미팅에 필요한 기술 자료를 지원합니다." },
];

/**
 * 홈페이지 — 지원 프로세스 5단계.
 */
export const supportProcess: { no: string; title: string; detail: string }[] = [
  { no: "01", title: "환경 확인", detail: "제품명, 버전, 증상을 확인합니다." },
  { no: "02", title: "원인 구분", detail: "제품, 인프라, 인증서, 계정, 백업 문제를 나눕니다." },
  { no: "03", title: "진단", detail: "로그와 설정을 확인합니다." },
  { no: "04", title: "조치", detail: "가능한 조치와 필요한 변경을 구분합니다." },
  { no: "05", title: "정리", detail: "결과와 재발 방지안을 문서로 남깁니다." },
];
