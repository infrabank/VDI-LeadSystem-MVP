// ── V4 Question Schema ──
// Total: 28 questions / 8 steps
// Step 1: 기본 정보 (v3 Step 1, 4 questions)
// Step 2: N²SF 등급 분류 (신규, 2 questions)
// Step 3: 정보서비스 모델 선택 (신규, 1 question)
// Step 4~8: v3 Step 2~6 (22 questions, step numbers +2 shifted)
// QUESTIONS_V4.length === 28

import type { RiskAssessmentV3Input } from "./questions.v3";

// ── V4-specific types ──

export type V4QuestionType = "radio" | "checkbox" | "select" | "number" | "boolean" | "multiselect";

export interface V4QuestionOption {
  value: string;
  label: string;
  desc?: string;
}

export interface V4Question {
  id: string;
  step: number;
  type: V4QuestionType;
  required: boolean;
  question: string;
  inline_help?: string;
  options?: V4QuestionOption[];
  defaultValue?: string | number | boolean | string[];
}

export interface V4Step {
  step: number;
  title: string;
  description: string;
}

// ── V4 Input type ──
export interface RiskAssessmentV4Input extends RiskAssessmentV3Input {
  data_grade: "C" | "S" | "O";
  mixed_grade?: Array<"personal_info" | "trade_secret" | "system_log" | "open_data">;
  service_model: "model3_saas_collab" | "model8_doc_mgmt" | "model10_wireless" | "other";
}

// ── Step metadata ──
export const STEPS_V4: V4Step[] = [
  { step: 1, title: "기본 정보",          description: "VDI 환경의 전체 규모와 플랫폼 정보" },
  { step: 2, title: "N²SF 등급 분류",     description: "처리 정보의 보안 등급 분류 (N²SF 가이드라인 기준)" },
  { step: 3, title: "정보서비스 모델",     description: "운용 시나리오 선택 (N²SF 부록2 권고 통제 매핑)" },
  { step: 4, title: "아키텍처/스토리지",   description: "스토리지 구성과 네트워크 아키텍처" },
  { step: 5, title: "가용성/DR",           description: "백업, 재해 복구, 가용성 체계" },
  { step: 6, title: "운영/변경관리",       description: "운영 인력, 변경 관리, 문서화 수준" },
  { step: 7, title: "자동화/확장성",       description: "자동화 수준과 확장 대응력" },
  { step: 8, title: "보안/접속",           description: "접속 방식과 보안 체계" },
];

// ── Questions ──
export const QUESTIONS_V4: V4Question[] = [

  // ── Step 1: 기본 정보 (v3 scale section, 4 questions) ──
  {
    id: "platform",
    step: 1,
    type: "select",
    required: true,
    question: "VDI 플랫폼",
    inline_help: "현재 사용 중인 주요 하이퍼바이저를 선택하세요.",
    options: [
      { value: "vmware",    label: "VMware" },
      { value: "citrix",    label: "Citrix" },
      { value: "xenserver", label: "XenServer" },
      { value: "mixed",     label: "혼합 (Mixed)" },
    ],
  },
  {
    id: "vm_count",
    step: 1,
    type: "number",
    required: true,
    question: "VM 수",
    inline_help: "관리 대상 가상 머신의 총 수를 입력하세요.",
  },
  {
    id: "host_count",
    step: 1,
    type: "number",
    required: true,
    question: "호스트(물리 서버) 수",
    inline_help: "하이퍼바이저가 설치된 물리 서버 수를 입력하세요.",
  },
  {
    id: "concurrent_users",
    step: 1,
    type: "number",
    required: false,
    question: "동시 사용자 수 (대략)",
    inline_help: "피크 타임 기준 동시 접속 사용자 수입니다.",
  },

  // ── Step 2: N²SF 등급 분류 (신규, 2 questions) ──
  {
    id: "data_grade",
    step: 2,
    type: "radio",
    required: true,
    question: "현재 시스템이 다루는 업무정보의 최고 등급은?",
    inline_help: "국방·외교·수사 또는 국민 생명·신체와 직결된 정보 → C(기밀) / 개인정보·영업비밀·내부심의 자료 또는 시스템 로그 → S(민감) / 그 외 일반 업무정보 → O(공개)",
    options: [
      { value: "C", label: "C (기밀)", desc: "정보공개법 §9 1~4호 — 국방·외교·수사·생명" },
      { value: "S", label: "S (민감)", desc: "정보공개법 §9 5~8호 + 시스템 로그·임시백업" },
      { value: "O", label: "O (공개)", desc: "C·S 외 일반 정보" },
    ],
  },
  {
    id: "mixed_grade",
    step: 2,
    type: "checkbox",
    required: false,
    question: "함께 처리되는 정보 유형 (해당사항 모두 선택)",
    inline_help: "선택 결과에 따라 등급이 자동으로 상위 승계될 수 있습니다 (N²SF 가이드라인 표 2-9).",
    options: [
      { value: "personal_info",  label: "개인정보 (이름·주민번호 등)" },
      { value: "trade_secret",   label: "영업비밀·계약정보" },
      { value: "system_log",     label: "시스템 로그·감사로그" },
      { value: "open_data",      label: "공개 가능 일반 정보" },
    ],
  },

  // ── Step 3: 정보서비스 모델 선택 (신규, 1 question) ──
  {
    id: "service_model",
    step: 3,
    type: "radio",
    required: true,
    question: "가장 가까운 운용 시나리오는?",
    inline_help: "선택한 시나리오에 맞춰 N²SF 부록2의 권고 통제가 리포트에 반영됩니다.",
    options: [
      { value: "model3_saas_collab", label: "SaaS 협업 (외부 클라우드 직접 연결)",  desc: "Microsoft 365·Google Workspace·Slack 등을 업무 단말에서 직접 사용" },
      { value: "model8_doc_mgmt",    label: "클라우드 통합문서체계",                desc: "기관 내부 + 외부 모바일·원격 단말이 동일 문서 시스템 접근" },
      { value: "model10_wireless",   label: "무선 업무환경",                        desc: "청사 내 Wi-Fi 통한 업무시스템 접속" },
      { value: "other",              label: "위 중 어느 것도 아님 / 혼합",           desc: "v1 기준 일반 점수만 산출 (모델 매핑 생략)" },
    ],
  },

  // ── Step 4: 아키텍처/스토리지 (v3 arch section, step +2 → 4, 5 questions) ──
  {
    id: "storage_type",
    step: 4,
    type: "select",
    required: true,
    question: "스토리지 유형",
    inline_help: "주요 스토리지 인프라 유형을 선택하세요.",
    options: [
      { value: "san",     label: "SAN (FC/iSCSI)" },
      { value: "nas",     label: "NAS (NFS/SMB)" },
      { value: "hci",     label: "HCI (하이퍼컨버지드)" },
      { value: "local",   label: "로컬 디스크" },
      { value: "unknown", label: "모름/기타" },
    ],
  },
  {
    id: "storage_protocol",
    step: 4,
    type: "select",
    required: false,
    question: "스토리지 프로토콜",
    options: [
      { value: "iscsi",   label: "iSCSI" },
      { value: "fc",      label: "FC (Fibre Channel)" },
      { value: "nfs",     label: "NFS" },
      { value: "smb",     label: "SMB/CIFS" },
      { value: "unknown", label: "모름/기타" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "storage_migration",
    step: 4,
    type: "boolean",
    required: true,
    question: "스토리지 이관 포함 여부",
    inline_help: "마이그레이션 시 스토리지도 함께 이관하는지 여부입니다.",
    defaultValue: false,
  },
  {
    id: "multipath_configured",
    step: 4,
    type: "select",
    required: false,
    question: "멀티패스 구성 여부",
    inline_help: "스토리지 이중화(멀티패스) 구성 상태입니다.",
    options: [
      { value: "yes",     label: "구성됨" },
      { value: "no",      label: "미구성" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "network_separation",
    step: 4,
    type: "boolean",
    required: true,
    question: "네트워크 분리(망분리) 여부",
    inline_help: "업무망/인터넷망 분리 환경인지 여부입니다.",
    defaultValue: false,
  },

  // ── Step 5: 가용성/DR (v3 dr section, step +2 → 5, 6 questions) ──
  {
    id: "ha_enabled",
    step: 5,
    type: "select",
    required: true,
    question: "고가용성(HA) 구성",
    inline_help: "호스트 장애 시 자동 복구(HA) 설정 여부입니다.",
    options: [
      { value: "yes",     label: "전체 구성" },
      { value: "partial", label: "부분 구성" },
      { value: "no",      label: "미구성" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "dr_site",
    step: 5,
    type: "select",
    required: true,
    question: "DR(재해복구) 사이트",
    inline_help: "별도 재해복구 사이트 구축 수준입니다.",
    options: [
      { value: "hot",     label: "Hot (실시간 복제)" },
      { value: "warm",    label: "Warm (주기적 복제)" },
      { value: "cold",    label: "Cold (백업 기반)" },
      { value: "none",    label: "없음" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "rpo_target",
    step: 5,
    type: "select",
    required: true,
    question: "RPO 목표 (복구 시점 목표)",
    inline_help: "데이터 손실 허용 시간입니다.",
    options: [
      { value: "<=1h",    label: "1시간 이내" },
      { value: "<=4h",    label: "4시간 이내" },
      { value: "<=24h",   label: "24시간 이내" },
      { value: ">24h",    label: "24시간 초과" },
      { value: "unknown", label: "모름/미정" },
    ],
  },
  {
    id: "rto_target",
    step: 5,
    type: "select",
    required: true,
    question: "RTO 목표 (복구 시간 목표)",
    inline_help: "서비스 복구까지 허용되는 시간입니다.",
    options: [
      { value: "<=1h",    label: "1시간 이내" },
      { value: "<=4h",    label: "4시간 이내" },
      { value: "<=24h",   label: "24시간 이내" },
      { value: ">24h",    label: "24시간 초과" },
      { value: "unknown", label: "모름/미정" },
    ],
  },
  {
    id: "backup_exists",
    step: 5,
    type: "select",
    required: true,
    question: "백업 체계 보유 여부",
    options: [
      { value: "yes",     label: "보유" },
      { value: "no",      label: "미보유" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "backup_frequency",
    step: 5,
    type: "select",
    required: false,
    question: "백업 주기",
    options: [
      { value: "daily",   label: "일 1회" },
      { value: "weekly",  label: "주 1회" },
      { value: "monthly", label: "월 1회" },
      { value: "ad-hoc",  label: "비정기" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },

  // ── Step 6: 운영/변경관리 (v3 ops section, step +2 → 6, 4 questions) ──
  {
    id: "ops_staff_level",
    step: 6,
    type: "select",
    required: true,
    question: "운영 인력 수준",
    inline_help: "VDI 운영 전담 인력의 숙련도 수준입니다.",
    options: [
      { value: "low",  label: "낮음 (비전문/겸직)" },
      { value: "mid",  label: "보통 (전담 1~2인)" },
      { value: "high", label: "높음 (전문팀 보유)" },
    ],
  },
  {
    id: "incident_response_maturity",
    step: 6,
    type: "select",
    required: true,
    question: "장애 대응 체계",
    inline_help: "장애 발생 시 대응 프로세스 성숙도입니다.",
    options: [
      { value: "ad-hoc",    label: "비정형 (개인 판단)" },
      { value: "basic",     label: "기본 (연락 체계만)" },
      { value: "standard",  label: "표준 (절차+에스컬레이션)" },
      { value: "advanced",  label: "고도화 (자동 감지+대응)" },
    ],
  },
  {
    id: "change_management",
    step: 6,
    type: "select",
    required: true,
    question: "변경 관리 수준",
    inline_help: "인프라 변경 시 승인/추적 프로세스 수준입니다.",
    options: [
      { value: "none",     label: "없음" },
      { value: "basic",    label: "기본 (구두/이메일)" },
      { value: "standard", label: "표준 (ITSM/승인)" },
      { value: "strict",   label: "엄격 (CAB/자동화)" },
    ],
  },
  {
    id: "documentation_level",
    step: 6,
    type: "select",
    required: true,
    question: "문서화 수준",
    inline_help: "인프라 구성, 운영 절차 등의 문서화 수준입니다.",
    options: [
      { value: "none",      label: "없음" },
      { value: "partial",   label: "부분적" },
      { value: "standard",  label: "표준 (주요 항목 완비)" },
      { value: "excellent", label: "우수 (전체 최신 유지)" },
    ],
  },

  // ── Step 7: 자동화/확장성 (v3 auto section, step +2 → 7, 3 questions) ──
  {
    id: "automation_level",
    step: 7,
    type: "select",
    required: true,
    question: "자동화 수준",
    inline_help: "VM 프로비저닝, 패치, 모니터링 등의 자동화 수준입니다.",
    options: [
      { value: "none",     label: "없음 (수동)" },
      { value: "some",     label: "일부 (스크립트 활용)" },
      { value: "standard", label: "표준 (도구 활용)" },
      { value: "high",     label: "높음 (오케스트레이션)" },
    ],
  },
  {
    id: "provisioning_time",
    step: 7,
    type: "select",
    required: false,
    question: "VM 프로비저닝 소요시간",
    inline_help: "신규 VM 1대 배포에 걸리는 시간입니다.",
    options: [
      { value: "<10m",    label: "10분 미만" },
      { value: "10-30m",  label: "10~30분" },
      { value: ">30m",    label: "30분 이상" },
      { value: "unknown", label: "모름" },
    ],
    defaultValue: "unknown",
  },
  {
    id: "migration_rehearsal",
    step: 7,
    type: "select",
    required: true,
    question: "이관 리허설 수행 여부",
    inline_help: "사전 이관 테스트(리허설)를 수행했는지 여부입니다.",
    options: [
      { value: "complete", label: "전체 완료" },
      { value: "partial",  label: "부분 수행" },
      { value: "none",     label: "미수행" },
    ],
  },

  // ── Step 8: 보안/접속 (v3 sec section, step +2 → 8, 3 questions) ──
  {
    id: "access_method",
    step: 8,
    type: "multiselect",
    required: true,
    question: "접속 방식 (복수 선택)",
    inline_help: "VDI 접속에 사용되는 방식을 모두 선택하세요.",
    options: [
      { value: "vpn",        label: "VPN" },
      { value: "gateway",    label: "게이트웨이/포탈" },
      { value: "direct",     label: "직접 접속" },
      { value: "zero-trust", label: "제로 트러스트" },
    ],
  },
  {
    id: "mfa_enabled",
    step: 8,
    type: "select",
    required: true,
    question: "MFA(다중 인증) 적용 여부",
    options: [
      { value: "yes",     label: "전체 적용" },
      { value: "partial", label: "부분 적용" },
      { value: "no",      label: "미적용" },
      { value: "unknown", label: "모름" },
    ],
  },
  {
    id: "privileged_access_control",
    step: 8,
    type: "select",
    required: false,
    question: "특권 접근 관리(PAM)",
    inline_help: "관리자 계정에 대한 접근 통제 수준입니다.",
    options: [
      { value: "none",     label: "없음" },
      { value: "basic",    label: "기본 (비밀번호 공유)" },
      { value: "standard", label: "표준 (개별 계정)" },
      { value: "strict",   label: "엄격 (PAM 솔루션)" },
    ],
    defaultValue: "basic",
  },
];

// ── Validation ──

export interface V4ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateV4Input(input: Partial<RiskAssessmentV4Input>): V4ValidationResult {
  const errors: string[] = [];

  // Step 1: 기본 정보 (required fields from v3)
  if (!input.platform) errors.push("platform: VDI 플랫폼을 선택하세요.");
  if (input.vm_count === undefined || input.vm_count === null) errors.push("vm_count: VM 수를 입력하세요.");
  if (input.host_count === undefined || input.host_count === null) errors.push("host_count: 호스트 수를 입력하세요.");

  // Step 2: N²SF 등급 분류
  const validGrades = ["C", "S", "O"] as const;
  if (!input.data_grade) {
    errors.push("data_grade: 업무정보 등급을 선택하세요.");
  } else if (!(validGrades as readonly string[]).includes(input.data_grade)) {
    errors.push(`data_grade: 유효하지 않은 등급입니다. C·S·O 중 선택하세요.`);
  }

  const validMixedGrade = ["personal_info", "trade_secret", "system_log", "open_data"] as const;
  if (input.mixed_grade !== undefined && Array.isArray(input.mixed_grade)) {
    const invalid = input.mixed_grade.filter(
      (v) => !(validMixedGrade as readonly string[]).includes(v)
    );
    if (invalid.length > 0) {
      errors.push(`mixed_grade: 유효하지 않은 값 포함 — ${invalid.join(", ")}`);
    }
  }

  // Step 3: 정보서비스 모델
  const validModels = ["model3_saas_collab", "model8_doc_mgmt", "model10_wireless", "other"] as const;
  if (!input.service_model) {
    errors.push("service_model: 운용 시나리오를 선택하세요.");
  } else if (!(validModels as readonly string[]).includes(input.service_model)) {
    errors.push(`service_model: 유효하지 않은 모델입니다. model3_saas_collab·model8_doc_mgmt·model10_wireless·other 중 선택하세요.`);
  }

  // Step 4: 아키텍처/스토리지 (required)
  if (!input.storage_type) errors.push("storage_type: 스토리지 유형을 선택하세요.");
  if (input.storage_migration === undefined || input.storage_migration === null) {
    errors.push("storage_migration: 스토리지 이관 포함 여부를 선택하세요.");
  }
  if (input.network_separation === undefined || input.network_separation === null) {
    errors.push("network_separation: 네트워크 분리 여부를 선택하세요.");
  }

  // Step 5: 가용성/DR (required)
  if (!input.ha_enabled)    errors.push("ha_enabled: HA 구성 여부를 선택하세요.");
  if (!input.dr_site)       errors.push("dr_site: DR 사이트 수준을 선택하세요.");
  if (!input.rpo_target)    errors.push("rpo_target: RPO 목표를 선택하세요.");
  if (!input.rto_target)    errors.push("rto_target: RTO 목표를 선택하세요.");
  if (!input.backup_exists) errors.push("backup_exists: 백업 체계 여부를 선택하세요.");

  // Step 6: 운영/변경관리 (required)
  if (!input.ops_staff_level)             errors.push("ops_staff_level: 운영 인력 수준을 선택하세요.");
  if (!input.incident_response_maturity)  errors.push("incident_response_maturity: 장애 대응 체계를 선택하세요.");
  if (!input.change_management)           errors.push("change_management: 변경 관리 수준을 선택하세요.");
  if (!input.documentation_level)         errors.push("documentation_level: 문서화 수준을 선택하세요.");

  // Step 7: 자동화/확장성 (required)
  if (!input.automation_level)    errors.push("automation_level: 자동화 수준을 선택하세요.");
  if (!input.migration_rehearsal) errors.push("migration_rehearsal: 이관 리허설 수행 여부를 선택하세요.");

  // Step 8: 보안/접속 (required)
  if (!input.access_method || (Array.isArray(input.access_method) && input.access_method.length === 0)) {
    errors.push("access_method: 접속 방식을 하나 이상 선택하세요.");
  }
  if (!input.mfa_enabled) errors.push("mfa_enabled: MFA 적용 여부를 선택하세요.");

  return { ok: errors.length === 0, errors };
}

// ── Helper: get questions by step ──
export function getQuestionsByStep(stepNumber: number): V4Question[] {
  return QUESTIONS_V4.filter((q) => q.step === stepNumber);
}
