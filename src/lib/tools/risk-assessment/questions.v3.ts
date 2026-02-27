// ── V3 Question Schema ──

export type SectionId = "scale" | "arch" | "dr" | "ops" | "auto" | "sec";
export type QuestionType = "select" | "number" | "boolean" | "multiselect";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: SectionId;
  label: string;
  help?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  defaultValue?: string | number | boolean | string[];
}

export interface Section {
  id: SectionId;
  title: string;
  description: string;
}

export const SECTIONS: Section[] = [
  { id: "scale", title: "기본 규모", description: "VDI 환경의 전체 규모와 플랫폼 정보" },
  { id: "arch", title: "아키텍처/스토리지", description: "스토리지 구성과 네트워크 아키텍처" },
  { id: "dr", title: "가용성/DR", description: "백업, 재해 복구, 가용성 체계" },
  { id: "ops", title: "운영/변경관리", description: "운영 인력, 변경 관리, 문서화 수준" },
  { id: "auto", title: "자동화/확장성", description: "자동화 수준과 확장 대응력" },
  { id: "sec", title: "보안/접속", description: "접속 방식과 보안 체계" },
];

export const QUESTIONS: Question[] = [
  // ── S1: Scale ──
  {
    id: "platform",
    section: "scale",
    label: "VDI 플랫폼",
    help: "현재 사용 중인 주요 하이퍼바이저를 선택하세요.",
    type: "select",
    required: true,
    options: [
      { value: "vmware", label: "VMware" },
      { value: "citrix", label: "Citrix" },
      { value: "xenserver", label: "XenServer" },
      { value: "mixed", label: "혼합 (Mixed)" },
    ],
  },
  {
    id: "vm_count",
    section: "scale",
    label: "VM 수",
    help: "관리 대상 가상 머신의 총 수를 입력하세요.",
    type: "number",
    required: true,
  },
  {
    id: "host_count",
    section: "scale",
    label: "호스트(물리 서버) 수",
    help: "하이퍼바이저가 설치된 물리 서버 수를 입력하세요.",
    type: "number",
    required: true,
  },
  {
    id: "concurrent_users",
    section: "scale",
    label: "동시 사용자 수 (대략)",
    help: "피크 타임 기준 동시 접속 사용자 수입니다.",
    type: "number",
    required: false,
  },

  // ── S2: Architecture & Storage ──
  {
    id: "storage_type",
    section: "arch",
    label: "스토리지 유형",
    help: "주요 스토리지 인프라 유형을 선택하세요.",
    type: "select",
    required: true,
    options: [
      { value: "san", label: "SAN (FC/iSCSI)" },
      { value: "nas", label: "NAS (NFS/SMB)" },
      { value: "hci", label: "HCI (하이퍼컨버지드)" },
      { value: "local", label: "로컬 디스크" },
      { value: "unknown", label: "모름/기타" },
    ],
  },
  {
    id: "storage_protocol",
    section: "arch",
    label: "스토리지 프로토콜",
    type: "select",
    required: false,
    options: [
      { value: "iscsi", label: "iSCSI" },
      { value: "fc", label: "FC (Fibre Channel)" },
      { value: "nfs", label: "NFS" },
      { value: "smb", label: "SMB/CIFS" },
      { value: "unknown", label: "모름/기타" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "storage_migration",
    section: "arch",
    label: "스토리지 이관 포함 여부",
    help: "마이그레이션 시 스토리지도 함께 이관하는지 여부입니다.",
    type: "boolean",
    required: true,
    defaultValue: false,
  },
  {
    id: "multipath_configured",
    section: "arch",
    label: "멀티패스 구성 여부",
    help: "스토리지 이중화(멀티패스) 구성 상태입니다.",
    type: "select",
    required: false,
    options: [
      { value: "yes", label: "구성됨" },
      { value: "no", label: "미구성" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "network_separation",
    section: "arch",
    label: "네트워크 분리(망분리) 여부",
    help: "업무망/인터넷망 분리 환경인지 여부입니다.",
    type: "boolean",
    required: true,
    defaultValue: false,
  },

  // ── S3: Availability & DR ──
  {
    id: "ha_enabled",
    section: "dr",
    label: "고가용성(HA) 구성",
    help: "호스트 장애 시 자동 복구(HA) 설정 여부입니다.",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "전체 구성" },
      { value: "partial", label: "부분 구성" },
      { value: "no", label: "미구성" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "dr_site",
    section: "dr",
    label: "DR(재해복구) 사이트",
    help: "별도 재해복구 사이트 구축 수준입니다.",
    type: "select",
    required: true,
    options: [
      { value: "hot", label: "Hot (실시간 복제)" },
      { value: "warm", label: "Warm (주기적 복제)" },
      { value: "cold", label: "Cold (백업 기반)" },
      { value: "none", label: "없음" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "rpo_target",
    section: "dr",
    label: "RPO 목표 (복구 시점 목표)",
    help: "데이터 손실 허용 시간입니다.",
    type: "select",
    required: true,
    options: [
      { value: "<=1h", label: "1시간 이내" },
      { value: "<=4h", label: "4시간 이내" },
      { value: "<=24h", label: "24시간 이내" },
      { value: ">24h", label: "24시간 초과" },
      { value: "unknown", label: "모름/미정" },
    ],
  },
  {
    id: "rto_target",
    section: "dr",
    label: "RTO 목표 (복구 시간 목표)",
    help: "서비스 복구까지 허용되는 시간입니다.",
    type: "select",
    required: true,
    options: [
      { value: "<=1h", label: "1시간 이내" },
      { value: "<=4h", label: "4시간 이내" },
      { value: "<=24h", label: "24시간 이내" },
      { value: ">24h", label: "24시간 초과" },
      { value: "unknown", label: "모름/미정" },
    ],
  },
  {
    id: "backup_exists",
    section: "dr",
    label: "백업 체계 보유 여부",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "보유" },
      { value: "no", label: "미보유" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "backup_frequency",
    section: "dr",
    label: "백업 주기",
    type: "select",
    required: false,
    options: [
      { value: "daily", label: "일 1회" },
      { value: "weekly", label: "주 1회" },
      { value: "monthly", label: "월 1회" },
      { value: "ad-hoc", label: "비정기" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },

  // ── S4: Operations & Change ──
  {
    id: "ops_staff_level",
    section: "ops",
    label: "운영 인력 수준",
    help: "VDI 운영 전담 인력의 숙련도 수준입니다.",
    type: "select",
    required: true,
    options: [
      { value: "low", label: "낮음 (비전문/겸직)" },
      { value: "mid", label: "보통 (전담 1~2인)" },
      { value: "high", label: "높음 (전문팀 보유)" },
    ],
  },
  {
    id: "incident_response_maturity",
    section: "ops",
    label: "장애 대응 체계",
    help: "장애 발생 시 대응 프로세스 성숙도입니다.",
    type: "select",
    required: true,
    options: [
      { value: "ad-hoc", label: "비정형 (개인 판단)" },
      { value: "basic", label: "기본 (연락 체계만)" },
      { value: "standard", label: "표준 (절차+에스컬레이션)" },
      { value: "advanced", label: "고도화 (자동 감지+대응)" },
    ],
  },
  {
    id: "change_management",
    section: "ops",
    label: "변경 관리 수준",
    help: "인프라 변경 시 승인/추적 프로세스 수준입니다.",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "없음" },
      { value: "basic", label: "기본 (구두/이메일)" },
      { value: "standard", label: "표준 (ITSM/승인)" },
      { value: "strict", label: "엄격 (CAB/자동화)" },
    ],
  },
  {
    id: "documentation_level",
    section: "ops",
    label: "문서화 수준",
    help: "인프라 구성, 운영 절차 등의 문서화 수준입니다.",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "없음" },
      { value: "partial", label: "부분적" },
      { value: "standard", label: "표준 (주요 항목 완비)" },
      { value: "excellent", label: "우수 (전체 최신 유지)" },
    ],
  },

  // ── S5: Automation & Scale ──
  {
    id: "automation_level",
    section: "auto",
    label: "자동화 수준",
    help: "VM 프로비저닝, 패치, 모니터링 등의 자동화 수준입니다.",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "없음 (수동)" },
      { value: "some", label: "일부 (스크립트 활용)" },
      { value: "standard", label: "표준 (도구 활용)" },
      { value: "high", label: "높음 (오케스트레이션)" },
    ],
  },
  {
    id: "provisioning_time",
    section: "auto",
    label: "VM 프로비저닝 소요시간",
    help: "신규 VM 1대 배포에 걸리는 시간입니다.",
    type: "select",
    required: false,
    options: [
      { value: "<10m", label: "10분 미만" },
      { value: "10-30m", label: "10~30분" },
      { value: ">30m", label: "30분 이상" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "migration_rehearsal",
    section: "auto",
    label: "이관 리허설 수행 여부",
    help: "사전 이관 테스트(리허설)를 수행했는지 여부입니다.",
    type: "select",
    required: true,
    options: [
      { value: "complete", label: "전체 완료" },
      { value: "partial", label: "부분 수행" },
      { value: "none", label: "미수행" },
    ],
  },

  // ── S6: Security & Access ──
  {
    id: "access_method",
    section: "sec",
    label: "접속 방식 (복수 선택)",
    help: "VDI 접속에 사용되는 방식을 모두 선택하세요.",
    type: "multiselect",
    required: true,
    options: [
      { value: "vpn", label: "VPN" },
      { value: "gateway", label: "게이트웨이/포탈" },
      { value: "direct", label: "직접 접속" },
      { value: "zero-trust", label: "제로 트러스트" },
    ],
  },
  {
    id: "mfa_enabled",
    section: "sec",
    label: "MFA(다중 인증) 적용 여부",
    type: "select",
    required: true,
    options: [
      { value: "yes", label: "전체 적용" },
      { value: "partial", label: "부분 적용" },
      { value: "no", label: "미적용" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "privileged_access_control",
    section: "sec",
    label: "특권 접근 관리(PAM)",
    help: "관리자 계정에 대한 접근 통제 수준입니다.",
    type: "select",
    required: false,
    options: [
      { value: "none", label: "없음" },
      { value: "basic", label: "기본 (비밀번호 공유)" },
      { value: "standard", label: "표준 (개별 계정)" },
      { value: "strict", label: "엄격 (PAM 솔루션)" },
    ],
    defaultValue: "basic",
  },
];

// ── Helper: get questions by section ──
export function getQuestionsBySection(sectionId: SectionId): Question[] {
  return QUESTIONS.filter((q) => q.section === sectionId);
}

// ── V3 Input type (all answers) ──
export interface RiskAssessmentV3Input {
  // S1 Scale
  platform: string;
  vm_count: number;
  host_count: number;
  concurrent_users?: number;
  // S2 Arch
  storage_type: string;
  storage_protocol?: string;
  storage_migration: boolean;
  multipath_configured?: string;
  network_separation: boolean;
  // S3 DR
  ha_enabled: string;
  dr_site: string;
  rpo_target: string;
  rto_target: string;
  backup_exists: string;
  backup_frequency?: string;
  // S4 Ops
  ops_staff_level: string;
  incident_response_maturity: string;
  change_management: string;
  documentation_level: string;
  // S5 Auto
  automation_level: string;
  provisioning_time?: string;
  migration_rehearsal: string;
  // S6 Sec
  access_method: string[];
  mfa_enabled: string;
  privileged_access_control?: string;
}
