// =====================================================================
// 백업·사이버복원력 자가 진단 — 진단 질문 정의
// 7섹션 × 3~4문항 = 25문항. 각 문항 0~3점.
// 설계: docs/02-design/features/backup-readiness.design.md
// =====================================================================

export interface Question {
  id: string;
  section: SectionId;
  label: string;
  help?: string;
  required?: boolean;
  options: { value: string; label: string; score: 0 | 1 | 2 | 3 }[];
}

export type SectionId =
  | "scope"
  | "policy"
  | "ransomware"
  | "recovery_validation"
  | "service_level"
  | "disaster_recovery"
  | "security_access";

export interface Section {
  id: SectionId;
  title: string;
  description: string;
  weight: number; // 합 1.0
}

export const SECTIONS: Section[] = [
  {
    id: "scope",
    title: "백업 적용 범위",
    description: "서버·VM·엔드포인트·SaaS·DB까지 백업이 어디까지 적용되어 있는지 점검합니다.",
    weight: 0.18,
  },
  {
    id: "policy",
    title: "백업 주기·정책",
    description: "백업 주기, 보관 기간, 3-2-1 규칙 준수 여부를 점검합니다.",
    weight: 0.14,
  },
  {
    id: "ransomware",
    title: "랜섬웨어 보호",
    description: "Immutable 백업·안티 멀웨어 통합·무결성 검증·롤백 시나리오를 점검합니다.",
    weight: 0.18,
  },
  {
    id: "recovery_validation",
    title: "복구 검증",
    description: "정기 복구 테스트·시간 측정·시나리오 문서화 수준을 점검합니다.",
    weight: 0.14,
  },
  {
    id: "service_level",
    title: "RTO/RPO 정의",
    description: "업무별 RTO/RPO SLA 명문화 수준을 점검합니다.",
    weight: 0.10,
  },
  {
    id: "disaster_recovery",
    title: "DR / 페일오버",
    description: "DR 사이트·클라우드 페일오버·훈련 주기·복제 지연을 점검합니다.",
    weight: 0.14,
  },
  {
    id: "security_access",
    title: "백업 보안",
    description: "암호화·MFA·감사로그·키관리 등 백업 시스템 자체의 보안을 점검합니다.",
    weight: 0.12,
  },
];

export const QUESTIONS: Question[] = [
  // ── 1. 백업 적용 범위 (4) ──
  {
    id: "scope_servers",
    section: "scope",
    label: "서버·VM 백업 적용 범위는?",
    options: [
      { value: "core_only", label: "일부 핵심 시스템만", score: 0 },
      { value: "half", label: "운영 환경 절반 이상", score: 1 },
      { value: "all_prod", label: "운영 환경 전부", score: 2 },
      { value: "all", label: "운영+개발/테스트 포함 전부", score: 3 },
    ],
  },
  {
    id: "scope_endpoints",
    section: "scope",
    label: "엔드포인트(노트북·PC) 백업 운영은?",
    options: [
      { value: "none", label: "미운영", score: 0 },
      { value: "executives", label: "임원·핵심 부서만", score: 1 },
      { value: "half", label: "전사 50% 이상", score: 2 },
      { value: "all", label: "전사 100%", score: 3 },
    ],
  },
  {
    id: "scope_saas",
    section: "scope",
    label: "SaaS·클라우드 데이터(M365/Google/SaaS DB) 백업은?",
    options: [
      { value: "none", label: "백업하지 않음", score: 0 },
      { value: "partial", label: "일부 데이터만", score: 1 },
      { value: "mail_drive", label: "메일·드라이브 통합", score: 2 },
      { value: "all", label: "모든 SaaS 통합 백업", score: 3 },
    ],
  },
  {
    id: "scope_db",
    section: "scope",
    label: "DB·중요 애플리케이션 별도 백업 정책은?",
    options: [
      { value: "none", label: "정책 없음", score: 0 },
      { value: "partial", label: "일부 DB만", score: 1 },
      { value: "all_db", label: "주요 DB 모두", score: 2 },
      { value: "consistent", label: "트랜잭션 일관성까지 보장", score: 3 },
    ],
  },

  // ── 2. 백업 주기·정책 (3) ──
  {
    id: "policy_frequency",
    section: "policy",
    label: "백업 주기는?",
    options: [
      { value: "irregular", label: "부정기 또는 월 1회 미만", score: 0 },
      { value: "weekly", label: "주 1회", score: 1 },
      { value: "daily", label: "일 1회", score: 2 },
      { value: "incremental", label: "일 1회 + 시간 단위 증분", score: 3 },
    ],
  },
  {
    id: "policy_retention",
    section: "policy",
    label: "보관 기간 정책은?",
    options: [
      { value: "none", label: "기준 없음", score: 0 },
      { value: "short", label: "30일 이하", score: 1 },
      { value: "medium", label: "31~90일", score: 2 },
      { value: "tiered", label: "단계별 보관 (3-2-1 준수)", score: 3 },
    ],
  },
  {
    id: "policy_321",
    section: "policy",
    label: "백업 사본 분리 (3-2-1 규칙) 준수 수준은?",
    help: "3-2-1: 사본 3개 / 매체 2종류 / 오프사이트 1사본",
    options: [
      { value: "single", label: "단일 사본", score: 0 },
      { value: "same_site", label: "동일 사이트 2사본", score: 1 },
      { value: "diff_media", label: "다른 매체 2사본", score: 2 },
      { value: "full", label: "3-2-1 (오프사이트 1사본 포함)", score: 3 },
    ],
  },

  // ── 3. 랜섬웨어 보호 (4) ──
  {
    id: "ransom_immutable",
    section: "ransomware",
    label: "Immutable / WORM 백업 적용 수준은?",
    options: [
      { value: "none", label: "미적용", score: 0 },
      { value: "core", label: "일부 핵심만", score: 1 },
      { value: "most", label: "대부분", score: 2 },
      { value: "all", label: "모든 백업 immutable", score: 3 },
    ],
  },
  {
    id: "ransom_antimalware",
    section: "ransomware",
    label: "안티-멀웨어·EDR 통합은?",
    options: [
      { value: "separated", label: "백업과 분리 운영", score: 0 },
      { value: "partial", label: "일부 통합", score: 1 },
      { value: "integrated", label: "통합 운영", score: 2 },
      { value: "ai_active", label: "AI 행위 탐지·자동 차단 통합", score: 3 },
    ],
  },
  {
    id: "ransom_integrity",
    section: "ransomware",
    label: "백업 데이터 무결성 검증 방식은?",
    options: [
      { value: "none", label: "검증 안 함", score: 0 },
      { value: "manual", label: "수기 검증", score: 1 },
      { value: "auto_hash", label: "자동 해시 검증", score: 2 },
      { value: "ai", label: "AI 기반 이상 탐지", score: 3 },
    ],
  },
  {
    id: "ransom_rollback",
    section: "ransomware",
    label: "랜섬웨어 사고 시 롤백 시나리오 운영은?",
    options: [
      { value: "none", label: "정의 없음", score: 0 },
      { value: "doc_only", label: "문서만 존재", score: 1 },
      { value: "yearly", label: "연 1회 모의훈련", score: 2 },
      { value: "quarterly", label: "분기 1회 자동화 훈련", score: 3 },
    ],
  },

  // ── 4. 복구 검증 (3) ──
  {
    id: "recover_test_frequency",
    section: "recovery_validation",
    label: "정기 복구 테스트 주기는?",
    options: [
      { value: "none", label: "안 함", score: 0 },
      { value: "yearly", label: "연 1회", score: 1 },
      { value: "quarterly", label: "분기 1회", score: 2 },
      { value: "monthly", label: "월 1회 자동 검증", score: 3 },
    ],
  },
  {
    id: "recover_time_log",
    section: "recovery_validation",
    label: "복구 시간 측정·기록은?",
    options: [
      { value: "none", label: "안 함", score: 0 },
      { value: "occasional", label: "가끔", score: 1 },
      { value: "every_test", label: "매 테스트마다", score: 2 },
      { value: "auto_report", label: "자동 리포트화", score: 3 },
    ],
  },
  {
    id: "recover_runbook",
    section: "recovery_validation",
    label: "복구 시나리오 문서화 수준은?",
    options: [
      { value: "none", label: "없음", score: 0 },
      { value: "core_only", label: "핵심 시스템만", score: 1 },
      { value: "most", label: "대부분", score: 2 },
      { value: "runbook", label: "시나리오별 runbook 운영", score: 3 },
    ],
  },

  // ── 5. RTO/RPO (3) ──
  {
    id: "sl_rto",
    section: "service_level",
    label: "업무별 RTO 정의 수준은?",
    options: [
      { value: "none", label: "정의 없음", score: 0 },
      { value: "partial", label: "일부 시스템만", score: 1 },
      { value: "core", label: "핵심 업무 모두", score: 2 },
      { value: "sla", label: "등급별 SLA로 명문화", score: 3 },
    ],
  },
  {
    id: "sl_rpo",
    section: "service_level",
    label: "업무별 RPO 정의 수준은?",
    options: [
      { value: "none", label: "정의 없음", score: 0 },
      { value: "partial", label: "일부 시스템만", score: 1 },
      { value: "core", label: "핵심 업무 모두", score: 2 },
      { value: "sla", label: "등급별 SLA로 명문화", score: 3 },
    ],
  },
  {
    id: "sl_escalation",
    section: "service_level",
    label: "RTO/RPO 위반 시 escalation 절차는?",
    options: [
      { value: "none", label: "절차 없음", score: 0 },
      { value: "informal", label: "비공식", score: 1 },
      { value: "defined", label: "절차 정의", score: 2 },
      { value: "automated", label: "자동 알림+책임자 명시", score: 3 },
    ],
  },

  // ── 6. DR / 페일오버 (3) ──
  {
    id: "dr_site",
    section: "disaster_recovery",
    label: "DR 사이트·클라우드 페일오버 운영은?",
    options: [
      { value: "none", label: "없음", score: 0 },
      { value: "cold", label: "콜드 (수기 복구)", score: 1 },
      { value: "warm", label: "웜 (부분 자동)", score: 2 },
      { value: "hot", label: "핫 / 지속 복제", score: 3 },
    ],
  },
  {
    id: "dr_drill",
    section: "disaster_recovery",
    label: "DR 훈련 주기는?",
    options: [
      { value: "none", label: "안 함", score: 0 },
      { value: "yearly", label: "연 1회", score: 1 },
      { value: "biannual", label: "반기 1회", score: 2 },
      { value: "quarterly", label: "분기 1회 + 자동 검증", score: 3 },
    ],
  },
  {
    id: "dr_lag",
    section: "disaster_recovery",
    label: "DR 사이트 데이터 동기화 지연은?",
    options: [
      { value: "unknown", label: "알 수 없음", score: 0 },
      { value: "daily", label: "일 단위", score: 1 },
      { value: "hourly", label: "시간 단위", score: 2 },
      { value: "minute", label: "분 단위", score: 3 },
    ],
  },

  // ── 7. 백업 보안 (3) ──
  {
    id: "sec_encryption",
    section: "security_access",
    label: "백업 데이터 암호화 수준은?",
    options: [
      { value: "plain", label: "평문", score: 0 },
      { value: "at_rest", label: "저장 시만", score: 1 },
      { value: "at_rest_transit", label: "저장+전송", score: 2 },
      { value: "kms", label: "저장+전송+키관리(KMS)", score: 3 },
    ],
  },
  {
    id: "sec_mfa",
    section: "security_access",
    label: "백업 콘솔 MFA 적용은?",
    options: [
      { value: "none", label: "없음", score: 0 },
      { value: "partial_admin", label: "일부 관리자만", score: 1 },
      { value: "all_admin", label: "모든 관리자", score: 2 },
      { value: "sod", label: "MFA + 권한 분리(SoD)", score: 3 },
    ],
  },
  {
    id: "sec_audit",
    section: "security_access",
    label: "백업 시스템 접근 로그·감사는?",
    options: [
      { value: "none", label: "없음", score: 0 },
      { value: "partial", label: "일부", score: 1 },
      { value: "centralized", label: "통합 로깅", score: 2 },
      { value: "anomaly", label: "통합+이상행위 알림", score: 3 },
    ],
  },
];

export type BackupReadinessAnswers = Record<string, string>;

export function getOptionScore(question: Question, value: string | undefined): number {
  if (!value) return 0;
  const opt = question.options.find((o) => o.value === value);
  return opt ? opt.score : 0;
}

export function getQuestionsBySection(section: SectionId): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}
