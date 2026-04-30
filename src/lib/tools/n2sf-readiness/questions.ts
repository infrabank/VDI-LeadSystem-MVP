// =====================================================================
// N²SF Transition Readiness — 진단 질문 정의
// 5섹션 × 3문항 = 15문항. 각 문항 0~5점.
// 설계: docs/02-design/features/n2sf-transition-advisor.design.md
// =====================================================================

export type QuestionType = "select" | "multiselect" | "boolean" | "scale";

export interface Question {
  id: string;
  section: SectionId;
  label: string;
  help?: string;
  type: QuestionType;
  required: boolean;
  options?: { value: string; label: string; score: number }[];
  defaultValue?: unknown;
}

export type SectionId =
  | "network_separation"
  | "data_classification"
  | "authentication"
  | "cloud_saas"
  | "operations";

export interface Section {
  id: SectionId;
  title: string;
  description: string;
  weight: number; // 섹션 가중치 (총합 1.0)
}

export const SECTIONS: Section[] = [
  {
    id: "network_separation",
    title: "망분리·VDI 현황",
    description: "현재 망분리 구조와 VDI 운영 의존도를 점검합니다.",
    weight: 0.25,
  },
  {
    id: "data_classification",
    title: "데이터·업무 분류",
    description: "C/S/O 등급분류 준비 상태와 보안정책 문서화 수준을 점검합니다.",
    weight: 0.22,
  },
  {
    id: "authentication",
    title: "인증·접근 통제",
    description: "MFA, 권한관리, 외부 접속 통제 등 접근 제어 성숙도를 점검합니다.",
    weight: 0.20,
  },
  {
    id: "cloud_saas",
    title: "클라우드·SaaS 활용",
    description: "SaaS·클라우드·생성형 AI 활용에 대한 정책과 실행 수준을 점검합니다.",
    weight: 0.15,
  },
  {
    id: "operations",
    title: "운영·예산 준비도",
    description: "단말 보안, 로그·감사, 전환 예산/조직 준비도를 점검합니다.",
    weight: 0.18,
  },
];

// 점수 변환 헬퍼: option score는 0~5
export const QUESTIONS: Question[] = [
  // ── 1. 망분리·VDI 현황 ──
  {
    id: "ns_separation_type",
    section: "network_separation",
    label: "현재 망분리 구조는 어떻게 되어 있습니까?",
    type: "select",
    required: true,
    options: [
      { value: "physical", label: "물리적 망분리", score: 1 },
      { value: "logical", label: "논리적 망분리(VDI 기반)", score: 2 },
      { value: "mixed", label: "물리+논리 혼합", score: 3 },
      { value: "partial", label: "부분 분리(일부 업무만)", score: 4 },
      { value: "none", label: "미적용", score: 5 },
    ],
  },
  {
    id: "ns_vdi_usage_ratio",
    section: "network_separation",
    label: "전체 업무 중 VDI 사용 비중은 어느 정도입니까?",
    type: "select",
    required: true,
    options: [
      { value: "high", label: "80% 이상", score: 1 },
      { value: "mid-high", label: "50~80%", score: 2 },
      { value: "mid", label: "20~50%", score: 3 },
      { value: "low", label: "20% 미만", score: 4 },
      { value: "none", label: "사용 안 함", score: 5 },
    ],
  },
  {
    id: "ns_link_dependency",
    section: "network_separation",
    label: "망연계(파일·메일 등)에 대한 의존도는?",
    help: "낮을수록 단계적 전환에 유리합니다.",
    type: "select",
    required: true,
    options: [
      { value: "very-high", label: "매우 높음(주 업무 흐름의 핵심)", score: 1 },
      { value: "high", label: "높음", score: 2 },
      { value: "medium", label: "보통", score: 3 },
      { value: "low", label: "낮음", score: 4 },
      { value: "none", label: "거의 없음", score: 5 },
    ],
  },

  // ── 2. 데이터·업무 분류 ──
  {
    id: "dc_cso_status",
    section: "data_classification",
    label: "업무·데이터의 C/S/O(기밀/민감/공개) 등급분류 상태는?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "수행한 적 없음", score: 1 },
      { value: "discussion", label: "논의 단계", score: 2 },
      { value: "partial", label: "일부 시스템에 한해 분류 완료", score: 3 },
      { value: "most", label: "대부분 분류 완료", score: 4 },
      { value: "complete", label: "전체 완료 + 정기 갱신 중", score: 5 },
    ],
  },
  {
    id: "dc_data_inventory",
    section: "data_classification",
    label: "업무 데이터 인벤토리 관리 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "관리 안 함", score: 1 },
      { value: "spreadsheet", label: "스프레드시트 수준", score: 2 },
      { value: "partial-tool", label: "일부 시스템만 자동 관리", score: 3 },
      { value: "tool", label: "전사 자동 관리 도구 보유", score: 4 },
      { value: "tool-process", label: "도구+프로세스 모두 정착", score: 5 },
    ],
  },
  {
    id: "dc_security_policy_docs",
    section: "data_classification",
    label: "보안정책 문서화 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "거의 없음", score: 1 },
      { value: "outdated", label: "있으나 오래되어 미운영", score: 2 },
      { value: "basic", label: "기본 문서 보유, 일부 갱신", score: 3 },
      { value: "regular", label: "정기 검토·업데이트", score: 4 },
      { value: "operational", label: "감사·증적 연계까지 운영", score: 5 },
    ],
  },

  // ── 3. 인증·접근 통제 ──
  {
    id: "auth_mfa",
    section: "authentication",
    label: "MFA(다중인증) 적용 범위는?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "미적용", score: 1 },
      { value: "admin-only", label: "관리자 일부에만", score: 2 },
      { value: "internal", label: "내부 사용자 일부", score: 3 },
      { value: "all-internal", label: "전 직원 적용", score: 4 },
      { value: "all-external", label: "전 직원+외부 협력 모두", score: 5 },
    ],
  },
  {
    id: "auth_privileged",
    section: "authentication",
    label: "특권 계정(관리자) 통제 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "shared", label: "공용 계정 사용", score: 1 },
      { value: "named", label: "이름표시만, 별도 통제 없음", score: 2 },
      { value: "basic", label: "기본 PAM(승인·세션녹화 일부)", score: 3 },
      { value: "advanced", label: "PAM + 정기 감사", score: 4 },
      { value: "jit", label: "JIT(임시권한) + 자동 감사", score: 5 },
    ],
  },
  {
    id: "auth_remote_access",
    section: "authentication",
    label: "외부/재택 접속 통제 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "vpn-only", label: "단순 VPN", score: 1 },
      { value: "vpn-mfa", label: "VPN + MFA", score: 2 },
      { value: "vdi-only", label: "VDI 게이트웨이", score: 3 },
      { value: "ztna-pilot", label: "ZTNA/SDP 일부 적용", score: 4 },
      { value: "ztna-full", label: "ZTNA/SDP + 위치·디바이스 통제", score: 5 },
    ],
  },

  // ── 4. 클라우드·SaaS 활용 ──
  {
    id: "cs_saas_usage",
    section: "cloud_saas",
    label: "업무 SaaS(메일·협업·문서) 활용 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "사용 못함(차단)", score: 1 },
      { value: "limited-vdi", label: "VDI 안에서만 일부 사용", score: 2 },
      { value: "approved-list", label: "승인된 SaaS 일부", score: 3 },
      { value: "broad", label: "다수 SaaS 활용 + DLP 통제", score: 4 },
      { value: "csap", label: "CSAP 인증 SaaS 폭넓게 활용", score: 5 },
    ],
  },
  {
    id: "cs_genai",
    section: "cloud_saas",
    label: "생성형 AI 활용 정책은?",
    type: "select",
    required: true,
    options: [
      { value: "blocked", label: "전면 차단", score: 1 },
      { value: "no-policy", label: "정책 없이 개별 사용", score: 2 },
      { value: "guideline", label: "가이드라인 수립", score: 3 },
      { value: "internal-tool", label: "내부 전용 AI 도구 운영", score: 4 },
      { value: "integrated", label: "DLP·등급분류 연계 운영", score: 5 },
    ],
  },
  {
    id: "cs_cloud_strategy",
    section: "cloud_saas",
    label: "클라우드(IaaS/DaaS) 도입 전략은?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "없음", score: 1 },
      { value: "discussion", label: "검토 단계", score: 2 },
      { value: "pilot", label: "파일럿 진행 중", score: 3 },
      { value: "production", label: "일부 운영 중", score: 4 },
      { value: "primary", label: "주력 환경으로 운영", score: 5 },
    ],
  },

  // ── 5. 운영·예산 준비도 ──
  {
    id: "op_endpoint_security",
    section: "operations",
    label: "단말(엔드포인트) 보안 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "av-only", label: "백신만", score: 1 },
      { value: "av-dlp", label: "백신 + DLP 일부", score: 2 },
      { value: "edr-pilot", label: "EDR 일부 적용", score: 3 },
      { value: "edr-full", label: "EDR 전사", score: 4 },
      { value: "xdr", label: "XDR + 24x7 모니터링", score: 5 },
    ],
  },
  {
    id: "op_logging_audit",
    section: "operations",
    label: "로그·감사 체계 수준은?",
    type: "select",
    required: true,
    options: [
      { value: "fragmented", label: "시스템별 분산", score: 1 },
      { value: "manual", label: "수동 수집·검토", score: 2 },
      { value: "siem-pilot", label: "SIEM 일부 도입", score: 3 },
      { value: "siem-full", label: "SIEM + 정기 감사", score: 4 },
      { value: "soar", label: "SIEM/SOAR + 자동 대응", score: 5 },
    ],
  },
  {
    id: "op_budget_org",
    section: "operations",
    label: "전환 예산·전담 조직 준비도는?",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "예산·조직 모두 없음", score: 1 },
      { value: "discussion", label: "내부 논의만", score: 2 },
      { value: "tf", label: "TF 구성, 예산 미확정", score: 3 },
      { value: "budget", label: "예산 일부 확보", score: 4 },
      { value: "full", label: "예산·전담 조직 모두 확보", score: 5 },
    ],
  },
];

// ── Helpers ──

export function getQuestionsBySection(section: SectionId): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

export type N2sfReadinessAnswers = Record<string, string>;

// 응답값으로부터 점수를 추출
export function getOptionScore(q: Question, value: unknown): number {
  if (!q.options) return 0;
  const opt = q.options.find((o) => o.value === value);
  return opt?.score ?? 0;
}
