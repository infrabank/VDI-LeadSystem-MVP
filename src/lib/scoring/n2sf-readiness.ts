// =====================================================================
// N²SF Readiness — 룰 기반 스코어링 엔진
// 입력: { [questionId]: optionValue }
// 출력: N2sfReadinessOutput (점수/등급/리스크/우선과제/로드맵)
// =====================================================================

import {
  QUESTIONS,
  SECTIONS,
  getOptionScore,
  type N2sfReadinessAnswers,
  type SectionId,
} from "@/lib/tools/n2sf-readiness/questions";

export type N2sfLevel = 1 | 2 | 3 | 4 | 5;

export const LEVEL_NAMES: Record<N2sfLevel, string> = {
  1: "기존 망분리 의존형",
  2: "부분 개선 필요형",
  3: "전환 준비 초기형",
  4: "단계적 전환 가능형",
  5: "고도화 준비형",
};

export const LEVEL_DESCRIPTIONS: Record<N2sfLevel, string> = {
  1: "기존 망분리에 강하게 의존. C/S/O 등급분류·인증 체계 등 N²SF 기본 통제 미수립. 즉시 진단·문서화부터 시작해야 합니다.",
  2: "일부 통제는 도입되어 있으나 전체 일관성이 부족합니다. 보안정책 문서화와 등급분류 PoC가 필요합니다.",
  3: "기본 등급분류·인증 통제 일부를 갖춰 N²SF PoC 진입 가능 단계입니다. SI 컨소시엄 합류를 검토하세요.",
  4: "C/S/O 분류·MFA·로그 체계가 일정 수준 갖춰져 단계적 전환 실행이 가능합니다. 도입 지원사업 수행 자격이 있습니다.",
  5: "운영 체계·증적·자동화까지 갖춰져 고도화·확산 단계로 이행할 수 있습니다.",
};

export interface SectionScores {
  network_separation: number;
  data_classification: number;
  authentication: number;
  cloud_saas: number;
  operations: number;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  goals: string[];
}

export interface N2sfReadinessOutput {
  version: "v1";
  tool: "n2sf_readiness";
  score: number; // 0~100
  level: N2sfLevel;
  level_name: string;
  level_description: string;
  section_scores: SectionScores; // 각 섹션 0~100
  summary: string;
  top_risks: string[];
  priority_actions: string[];
  vdi_strategy_hint: string;
  roadmap: RoadmapPhase[];
  next_steps: string[];
  // 역호환
  risk_messages: string[];
}

function clampPct(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function scoreToLevel(score: number): N2sfLevel {
  if (score >= 81) return 5;
  if (score >= 66) return 4;
  if (score >= 51) return 3;
  if (score >= 31) return 2;
  return 1;
}

// ── 섹션별 raw 점수 합산(섹션 내 옵션 score 합 / max) ──
function calcSectionScores(answers: N2sfReadinessAnswers): SectionScores {
  const result: Partial<Record<SectionId, number>> = {};
  for (const sec of SECTIONS) {
    const sectionQs = QUESTIONS.filter((q) => q.section === sec.id);
    let raw = 0;
    let max = 0;
    for (const q of sectionQs) {
      const score = getOptionScore(q, answers[q.id]);
      raw += score;
      max += 5;
    }
    result[sec.id] = clampPct(raw, max);
  }
  return result as SectionScores;
}

// ── 종합 점수: 섹션 가중 평균 ──
function calcOverallScore(sections: SectionScores): number {
  let weighted = 0;
  for (const sec of SECTIONS) {
    weighted += sections[sec.id] * sec.weight;
  }
  return Math.round(weighted);
}

// ── 핵심 리스크 도출 (가장 낮은 섹션 + 특정 답변 패턴) ──
interface RiskRule {
  trigger: (a: N2sfReadinessAnswers) => boolean;
  text: string;
}

const RISK_RULES: RiskRule[] = [
  {
    trigger: (a) => a.dc_cso_status === "none" || a.dc_cso_status === "discussion",
    text: "C/S/O 등급분류 미수립 — 2026-05 N²SF 시행 후 신규 발주 자격에서 후순위로 밀릴 위험.",
  },
  {
    trigger: (a) => a.auth_mfa === "none" || a.auth_mfa === "admin-only",
    text: "MFA 미적용/제한적 적용 — 개정 지침에서 MFA가 의무화되어 즉시 시정 필요.",
  },
  {
    trigger: (a) => a.op_logging_audit === "fragmented" || a.op_logging_audit === "manual",
    text: "로그·감사 분산/수동 — 보안성 검토와 정기 감사 증적 확보 어려움.",
  },
  {
    trigger: (a) => a.auth_privileged === "shared",
    text: "특권 계정이 공용으로 운영 — 침해 시 추적 불가, 감사 지적 1순위.",
  },
  {
    trigger: (a) => a.cs_genai === "no-policy",
    text: "생성형 AI 활용 정책 부재 — S등급 정보 유출 위험. 가이드라인 수립 필요.",
  },
  {
    trigger: (a) => a.ns_link_dependency === "very-high",
    text: "망연계 의존도 매우 높음 — 단계적 전환 시 단절 위험. CDS·DLP 우회 경로 사전 설계 필요.",
  },
  {
    trigger: (a) => a.dc_security_policy_docs === "none" || a.dc_security_policy_docs === "outdated",
    text: "보안정책 문서화 부족 — N²SF 수립 시 자체 보안대책서 작성 능력 미흡.",
  },
  {
    trigger: (a) => a.op_budget_org === "none" || a.op_budget_org === "discussion",
    text: "전환 예산·전담 조직 미확보 — 2026 KISA 도입 지원사업 컨소시엄 진입 어려움.",
  },
  {
    trigger: (a) => a.auth_remote_access === "vpn-only",
    text: "단순 VPN만 사용 — N²SF 원격접속 통제 기준(세션 암호화·위치통제·로그) 미충족.",
  },
];

function generateTopRisks(answers: N2sfReadinessAnswers, sections: SectionScores): string[] {
  const fired = RISK_RULES.filter((r) => r.trigger(answers)).map((r) => r.text);

  // 섹션 점수가 가장 낮은 영역에 대한 일반 리스크 추가
  const sortedSections = SECTIONS
    .map((s) => ({ id: s.id, title: s.title, score: sections[s.id] }))
    .sort((a, b) => a.score - b.score);
  const weakest = sortedSections[0];
  if (weakest && weakest.score < 50 && fired.length < 3) {
    fired.push(`${weakest.title} 영역 점수 ${weakest.score}점으로 가장 취약. 이 영역의 통제 수립을 우선순위로 설정해야 합니다.`);
  }

  return fired.slice(0, 3);
}

// ── 우선 개선 과제 5개 ──
interface ActionRule {
  trigger: (a: N2sfReadinessAnswers) => boolean;
  text: string;
}

const ACTION_RULES: ActionRule[] = [
  {
    trigger: (a) => a.dc_cso_status === "none" || a.dc_cso_status === "discussion" || a.dc_cso_status === "partial",
    text: "전사 정보자산 인벤토리 작성 후 C/S/O 등급분류 PoC 1개 부서 실시",
  },
  {
    trigger: (a) => a.auth_mfa !== "all-internal" && a.auth_mfa !== "all-external",
    text: "MFA 전 직원 적용 (관리자 → 내부 → 외부 협력 순)",
  },
  {
    trigger: (a) => a.auth_privileged === "shared" || a.auth_privileged === "named",
    text: "특권계정관리(PAM) 도입: 승인·세션녹화·정기감사",
  },
  {
    trigger: (a) => a.op_logging_audit === "fragmented" || a.op_logging_audit === "manual" || a.op_logging_audit === "siem-pilot",
    text: "SIEM 통합 + 월간 보안 리포트 자동화",
  },
  {
    trigger: (a) => a.cs_saas_usage === "none" || a.cs_saas_usage === "limited-vdi",
    text: "CSAP 인증 SaaS 1~2종 도입을 통한 O등급 업무 분리",
  },
  {
    trigger: (a) => a.cs_genai === "blocked" || a.cs_genai === "no-policy",
    text: "생성형 AI 활용 가이드라인 수립 + 내부 전용 AI 도구 PoC",
  },
  {
    trigger: (a) => a.auth_remote_access === "vpn-only" || a.auth_remote_access === "vpn-mfa",
    text: "ZTNA/SDP PoC: 1개 부서·1개 시스템 대상으로 ID 중심 원격접속 전환",
  },
  {
    trigger: (a) => a.op_endpoint_security === "av-only" || a.op_endpoint_security === "av-dlp",
    text: "EDR 전사 적용 및 DLP 정책 등급별 분리",
  },
  {
    trigger: (a) => a.dc_security_policy_docs === "none" || a.dc_security_policy_docs === "outdated" || a.dc_security_policy_docs === "basic",
    text: "N²SF 자체 보안대책서 템플릿 작성 + 보안 요구사항 매트릭스 정비",
  },
  {
    trigger: (a) => a.op_budget_org === "none" || a.op_budget_org === "discussion" || a.op_budget_org === "tf",
    text: "보안 예산 15% / 인력 10% 의무 기준 충족 계획 수립 및 임원 보고",
  },
];

function generatePriorityActions(answers: N2sfReadinessAnswers): string[] {
  const fired = ACTION_RULES.filter((r) => r.trigger(answers)).map((r) => r.text);
  // 항상 5개 보장하기 위해 fallback
  const fallback = [
    "기관 업무·정보시스템·위치 식별 작업 착수",
    "외부 컨설팅 또는 KISA 도입 지원사업 컨소시엄 합류 검토",
    "SI 영업대표·솔루션 파트너와 N²SF 통합 컨소시엄 사전 협의",
    "정보보호 거버넌스 위원회 구성 및 분기별 점검 체계 도입",
    "운영팀 N²SF·제로트러스트 사내 교육 진행",
  ];
  const result = [...fired];
  let fi = 0;
  while (result.length < 5 && fi < fallback.length) {
    if (!result.includes(fallback[fi])) result.push(fallback[fi]);
    fi++;
  }
  return result.slice(0, 5);
}

// ── VDI 전략 힌트 ──
function generateVdiStrategyHint(answers: N2sfReadinessAnswers): string {
  const internetVdi = answers.ns_separation_type === "logical" || answers.ns_separation_type === "mixed";
  const linkDep = answers.ns_link_dependency;
  const saasPotential = answers.cs_saas_usage;

  if (linkDep === "very-high" || linkDep === "high") {
    return "현재 망연계 의존도가 높아 VDI를 ‘유지·고도화’하면서 단계적 ZTNA·DRM 보완을 병행하는 것이 적합합니다. VDI 즉시 축소는 위험합니다.";
  }
  if (saasPotential === "broad" || saasPotential === "csap") {
    return "이미 SaaS 활용 수준이 높아 O등급 업무를 우선 SaaS·DaaS로 분리하고, VDI는 S/C등급 중심으로 ‘점진적 축소’가 가능합니다.";
  }
  if (internetVdi && (saasPotential === "approved-list" || saasPotential === "limited-vdi")) {
    return "인터넷망 VDI 의존도가 높습니다. 인터넷 업무는 RBI/SaaS로 분리하고, 업무망 VDI는 인증·권한 통제와 결합한 ‘제로트러스트 보완형’ 전환을 권합니다.";
  }
  return "‘재설계’가 적합한 후보입니다. 업무 재분류 후 VDI 잔존 영역을 명확히 한 다음, 점진적 전환 로드맵을 설계하세요. 별도 ‘VDI 역할 재정의 진단’도 함께 받아보시길 권합니다.";
}

// ── 종합 요약 ──
function generateSummary(score: number, level: N2sfLevel, sections: SectionScores): string {
  const weakest = SECTIONS
    .map((s) => ({ title: s.title, score: sections[s.id] }))
    .sort((a, b) => a.score - b.score)[0];
  const strongest = SECTIONS
    .map((s) => ({ title: s.title, score: sections[s.id] }))
    .sort((a, b) => b.score - a.score)[0];
  return `귀 기관의 N²SF 전환 준비도는 종합 ${score}점, **Level ${level} (${LEVEL_NAMES[level]})**로 평가됩니다. 강점 영역은 "${strongest.title}"(${strongest.score}점)이며, 가장 취약한 영역은 "${weakest.title}"(${weakest.score}점)입니다. ${LEVEL_DESCRIPTIONS[level]}`;
}

// ── 3단계 로드맵 ──
function generateRoadmap(level: N2sfLevel, answers: N2sfReadinessAnswers): RoadmapPhase[] {
  const phase1: string[] = [];
  const phase2: string[] = [];
  const phase3: string[] = [];

  // Phase 1 (3개월): 진단·문서화·기본 통제
  phase1.push("정보자산 인벤토리 + C/S/O 등급분류 PoC(1개 부서)");
  if (answers.auth_mfa === "none" || answers.auth_mfa === "admin-only") {
    phase1.push("관리자 MFA 즉시 전면 적용");
  }
  if (answers.dc_security_policy_docs === "none" || answers.dc_security_policy_docs === "outdated") {
    phase1.push("보안정책 문서 정비 + N²SF 자체 보안대책서 초안 작성");
  } else {
    phase1.push("기존 보안정책 N²SF 정합 점검 및 갱신");
  }
  phase1.push("취약 영역 외부 진단 + KISA 도입 지원사업 정보 수집");

  // Phase 2 (6개월): PoC·통제 도입
  phase2.push("ZTNA/SDP PoC: 1개 시스템·1개 부서로 ID 중심 접근통제 시범");
  phase2.push("PAM(특권계정관리) 도입 또는 강화");
  phase2.push("SIEM 통합 + 보안 운영 리포트 자동화");
  if (answers.cs_genai === "blocked" || answers.cs_genai === "no-policy") {
    phase2.push("생성형 AI 활용 가이드 수립 및 내부 전용 도구 PoC");
  }

  // Phase 3 (12개월+): 확산·운영체계
  phase3.push("등급분류 전사 확산 및 시스템별 보안대책 수립");
  phase3.push("VDI 영역 재배치(유지/축소/재설계) 의사결정 및 갱신 사업 발주");
  phase3.push("정기 보안성 점검 + 분기 감사 체계 정착");
  phase3.push("KISA 도입 지원사업 또는 시범사업 컨소시엄 합류");

  return [
    { phase: "1단계: 진단·문서화·기본 통제", duration: "0~3개월", goals: phase1.slice(0, 4) },
    { phase: "2단계: PoC·핵심 통제 도입", duration: "3~9개월", goals: phase2.slice(0, 4) },
    { phase: "3단계: 확산·운영체계 정립", duration: "9~24개월", goals: phase3.slice(0, 4) },
  ];
}

// ── 다음 단계 추천 ──
function generateNextSteps(level: N2sfLevel): string[] {
  if (level <= 2) {
    return [
      "‘VDI 역할 재정의 진단’도 함께 수행하여 자산 활용 방향 결정",
      "공공기관 보안 전환 무료 상담 신청",
      "1개 부서를 대상으로 등급분류 PoC 수행",
      "보안정책 문서화 우선 착수",
    ];
  }
  if (level === 3) {
    return [
      "ZTNA/SDP PoC를 위한 부서·시스템 1건 선정",
      "KISA 2026 N²SF 도입 지원사업 공모 참여 검토",
      "SI 컨소시엄 합류를 위한 사전 미팅 일정 수립",
      "VDI 갱신 일정과 N²SF 시행 일정 매핑",
    ];
  }
  return [
    "전사 등급분류·전환 로드맵 수립",
    "공공기관 보안 전환 컨설팅 요청 (제안서/RFP 자문)",
    "운영 자동화·증적 체계 고도화",
    "기관 내 N²SF 거버넌스 위원회 정기 점검",
  ];
}

// ── Main Entry ──
export function runN2sfReadiness(answers: N2sfReadinessAnswers): N2sfReadinessOutput {
  const sectionScores = calcSectionScores(answers);
  const score = calcOverallScore(sectionScores);
  const level = scoreToLevel(score);

  const summary = generateSummary(score, level, sectionScores);
  const top_risks = generateTopRisks(answers, sectionScores);
  const priority_actions = generatePriorityActions(answers);
  const vdi_strategy_hint = generateVdiStrategyHint(answers);
  const roadmap = generateRoadmap(level, answers);
  const next_steps = generateNextSteps(level);

  return {
    version: "v1",
    tool: "n2sf_readiness",
    score,
    level,
    level_name: LEVEL_NAMES[level],
    level_description: LEVEL_DESCRIPTIONS[level],
    section_scores: sectionScores,
    summary,
    top_risks,
    priority_actions,
    vdi_strategy_hint,
    roadmap,
    next_steps,
    risk_messages: top_risks,
  };
}
