// ── Risk Assessment v4 — N²SF Primary-Source Aligned Scoring Engine ──
//
// Builds on v3 (`risk-assessment-v3.ts`) and adds:
//   1. resolveGrade() — 사용자 선언 등급 + 혼재 정보 자동 상위 승계 (가이드라인 표 2-9)
//   2. N²SF 통제 매핑 룰 (matched / gap / recommended)
//   3. 등급별 가중치 (C 1.5 / S 1.2 / O 1.0)
//   4. appropriateness_label (≥70 ready / ≥40 partial / <40 early)
//
// v3 출력의 risk_messages, next_steps, risks, maturity_model, benchmark_text,
// current_state_projection, roadmap, executive_summary 는 모두 그대로 유지한다.
//
// SKIPPED RULES (v3 입력 필드 부재 — v5 입력 확장 시 재도입 후보):
//   - RULE-RA-01:    session_timeout_min      (없음)
//   - RULE-IN-01:    patch_management         (없음)
//   - RULE-AC-02/03: monitoring / siem level  (없음)
//   - RULE-DU-01:    backup_encrypted         (없음)
//   - DLP / encryption_at_rest / audit_log / encryption_key / identity_provider 룰

import { runRiskAssessmentV3, type RiskAssessmentV3Output } from "./risk-assessment-v3";
import type { RiskAssessmentV3Input } from "@/lib/tools/risk-assessment/questions.v3";
import type { RiskAssessmentV4Input } from "@/lib/tools/risk-assessment/questions.v4";
import { byId } from "@/lib/n2sf/controls.index";
import modelsData from "@/lib/n2sf/models.json";

// ── Output schema ──

export type ApplicabilityLabel = "ready" | "partial" | "early";

export type N2sfCompliance = {
  matched_controls: string[];
  gap_controls: string[];
  recommended_controls: string[];
  coverage_pct: number;
};

export interface RiskAssessmentV4Output extends Omit<RiskAssessmentV3Output, "version"> {
  version: "v4";
  resolved_grade: "C" | "S" | "O";
  service_model: "model3_saas_collab" | "model8_doc_mgmt" | "model10_wireless" | "other";
  n2sf_compliance: N2sfCompliance;
  appropriateness_label: ApplicabilityLabel;
}

// ── Grade resolution (가이드라인 표 2-9) ──

const GRADE_ORDER: Record<"C" | "S" | "O", number> = { O: 0, S: 1, C: 2 };

export function resolveGrade(input: RiskAssessmentV4Input): "C" | "S" | "O" {
  const declared = input.data_grade;
  const mixed = input.mixed_grade ?? [];
  let derived: "C" | "S" | "O" = "O";
  if (
    mixed.includes("personal_info") ||
    mixed.includes("trade_secret") ||
    mixed.includes("system_log")
  ) {
    derived = "S";
  }
  // 상위 등급 우선 승계
  return GRADE_ORDER[declared] >= GRADE_ORDER[derived] ? declared : derived;
}

// ── N²SF mapping rules ──

type Grade = "C" | "S" | "O";

type RuleContext = {
  input: RiskAssessmentV4Input;
  grade: Grade;
};

type DeltaScore = number | Partial<Record<Grade, number>>;

type Rule = {
  id: string;
  description: string;
  when: (ctx: RuleContext) => boolean;
  awards?: string[];
  gaps?: string[];
  deltaScore?: DeltaScore;
};

// helpers
const accessIncludes = (input: RiskAssessmentV4Input, value: string): boolean =>
  Array.isArray(input.access_method) && input.access_method.includes(value);

const accessOnlyDirect = (input: RiskAssessmentV4Input): boolean => {
  const am = input.access_method ?? [];
  // direct가 포함되고 vpn/zero-trust/gateway 보호장치가 없는 경우
  return (
    am.includes("direct") &&
    !am.includes("vpn") &&
    !am.includes("zero-trust") &&
    !am.includes("gateway")
  );
};

const RULES: Rule[] = [
  // ── 인증 (MFA / Access Method) ──
  {
    id: "RULE-MFA-01",
    description: "MFA 전체 적용 → MA-1, MA-2, AM-9 충족",
    when: ({ input }) => input.mfa_enabled === "yes",
    awards: ["N2SF-MA-1", "N2SF-MA-2", "N2SF-AM-9"],
    deltaScore: 5,
  },
  {
    id: "RULE-MFA-02",
    description: "MFA 미적용/모름 → MA-1, MA-2 미흡 (등급별 차등 감점)",
    when: ({ input }) => input.mfa_enabled === "no" || input.mfa_enabled === "unknown",
    gaps: ["N2SF-MA-1", "N2SF-MA-2"],
    deltaScore: { C: -12, S: -8, O: -3 },
  },
  {
    id: "RULE-MFA-03",
    description: "MFA 부분 적용 → MA-1 일부 충족 + MA-2 미흡",
    when: ({ input }) => input.mfa_enabled === "partial",
    awards: ["N2SF-MA-1"],
    gaps: ["N2SF-MA-2"],
    deltaScore: { C: -4, S: -2, O: 0 },
  },
  {
    id: "RULE-AM-01",
    description: "제로 트러스트 접속 → AM-2, AM-9, MA-2 강화",
    when: ({ input }) => accessIncludes(input, "zero-trust"),
    awards: ["N2SF-AM-2", "N2SF-AM-9", "N2SF-MA-2"],
    deltaScore: 3,
  },

  // ── 단말 인증 / VDI 핵심 ──
  {
    id: "RULE-DA-01",
    description: "제로 트러스트 → 단말 인증(DA-3, DA-4) 충족",
    when: ({ input }) => accessIncludes(input, "zero-trust"),
    awards: ["N2SF-DA-3", "N2SF-DA-4"],
    deltaScore: 6,
  },
  {
    id: "RULE-DA-02",
    description: "VPN 단독 접속 → 원격세션 암호화(RA-2)는 충족하나 단말 인증(DA-3, DA-4) 미흡",
    when: ({ input }) => accessIncludes(input, "vpn") && !accessIncludes(input, "zero-trust"),
    awards: ["N2SF-RA-2"],
    gaps: ["N2SF-DA-3", "N2SF-DA-4"],
    deltaScore: -4,
  },
  {
    id: "RULE-DA-03",
    description: "직접 접속(보호장치 없음) → DA-3/4, RA-2, EB-5 모두 미흡",
    when: ({ input }) => accessOnlyDirect(input),
    gaps: ["N2SF-DA-3", "N2SF-DA-4", "N2SF-RA-2", "N2SF-EB-5"],
    deltaScore: { C: -15, S: -10, O: -5 },
  },
  {
    id: "RULE-DA-04",
    description: "게이트웨이/포탈 접속 → RA-2, EB-3 부분 충족",
    when: ({ input }) => accessIncludes(input, "gateway"),
    awards: ["N2SF-RA-2", "N2SF-EB-3"],
    deltaScore: 2,
  },
  {
    id: "RULE-RA-06-01",
    description: "장애 대응 고도화 + 표준 운영 → RA-6 (자동 종료) 일부 충족",
    when: ({ input }) =>
      input.incident_response_maturity === "advanced" ||
      input.incident_response_maturity === "standard",
    awards: ["N2SF-RA-6"],
    deltaScore: 2,
  },

  // ── 분리/격리 ──
  {
    id: "RULE-SG-01",
    description: "네트워크 분리(망분리) 적용 → SG-4, SG-5, IS-4 충족",
    when: ({ input }) => input.network_separation === true,
    awards: ["N2SF-SG-4", "N2SF-SG-5", "N2SF-IS-4"],
    deltaScore: 5,
  },
  {
    id: "RULE-SG-02",
    description: "네트워크 분리 부재 → SG-4, SG-5, IS-4 미흡 (등급별 차등 감점)",
    when: ({ input }) => input.network_separation === false,
    gaps: ["N2SF-SG-4", "N2SF-SG-5", "N2SF-IS-4"],
    deltaScore: { C: -12, S: -7, O: -2 },
  },
  {
    id: "RULE-EB-01",
    description: "보호된 접속 경로(VPN/제로트러스트/게이트웨이) → EB-3, EB-5 충족",
    when: ({ input }) =>
      accessIncludes(input, "zero-trust") ||
      accessIncludes(input, "vpn") ||
      accessIncludes(input, "gateway"),
    awards: ["N2SF-EB-3", "N2SF-EB-5"],
    deltaScore: 3,
  },
  {
    id: "RULE-EB-02",
    description: "직접 접속(보호장치 없음) → EB-1, EB-3, EB-5 미흡",
    when: ({ input }) => accessOnlyDirect(input),
    gaps: ["N2SF-EB-1", "N2SF-EB-3", "N2SF-EB-5"],
    deltaScore: -5,
  },

  // ── 운영·모니터링 (가용 입력 기준) ──
  {
    id: "RULE-AC-01",
    description: "장애 대응 표준 이상 + 변경 관리 표준 이상 → AC-1(2), AC-3, AC-3(2) 충족",
    when: ({ input }) =>
      (input.incident_response_maturity === "standard" ||
        input.incident_response_maturity === "advanced") &&
      (input.change_management === "standard" || input.change_management === "strict"),
    awards: ["N2SF-AC-1(2)", "N2SF-AC-3", "N2SF-AC-3(2)"],
    deltaScore: 4,
  },
  {
    id: "RULE-AC-02",
    description: "장애 대응 비정형 + 변경 관리 없음 → AC-1(2), AC-3 미흡",
    when: ({ input }) =>
      input.incident_response_maturity === "ad-hoc" || input.change_management === "none",
    gaps: ["N2SF-AC-1(2)", "N2SF-AC-3"],
    deltaScore: -3,
  },
  {
    id: "RULE-IN-01",
    description: "자동화 표준/높음 → IN-1(1), IN-5, IN-6 (구성요소 관리) 충족",
    when: ({ input }) =>
      input.automation_level === "standard" || input.automation_level === "high",
    awards: ["N2SF-IN-1(1)", "N2SF-IN-5", "N2SF-IN-6"],
    deltaScore: 4,
  },
  {
    id: "RULE-IN-02",
    description: "자동화 없음/일부 → IN-5, IN-6 미흡",
    when: ({ input }) =>
      input.automation_level === "none" || input.automation_level === "some",
    gaps: ["N2SF-IN-5", "N2SF-IN-6"],
    deltaScore: -2,
  },

  // ── 백업/암호 / 데이터 흐름 ──
  {
    id: "RULE-DU-01",
    description: "백업 보유 + 일/주 단위 → DU-2 (백업 관리) 충족",
    when: ({ input }) =>
      input.backup_exists === "yes" &&
      (input.backup_frequency === "daily" || input.backup_frequency === "weekly"),
    awards: ["N2SF-DU-2"],
    deltaScore: 2,
  },
  {
    id: "RULE-DU-02",
    description: "백업 미보유 → DU-2 미흡",
    when: ({ input }) => input.backup_exists === "no",
    gaps: ["N2SF-DU-2"],
    deltaScore: -3,
  },
  {
    id: "RULE-DT-01",
    description: "원격 보호 경로 사용 → DT-1, RA-2 (전송 데이터 보호) 충족",
    when: ({ input }) =>
      !accessOnlyDirect(input) &&
      (accessIncludes(input, "zero-trust") ||
        accessIncludes(input, "vpn") ||
        accessIncludes(input, "gateway")),
    awards: ["N2SF-DT-1", "N2SF-RA-2"],
    deltaScore: 2,
  },

  // ── 모델별 조건부 룰 ──
  {
    id: "RULE-MODEL3-01",
    description: "모델 3 (SaaS) + O 등급 → IF-14, EB-14 충족 (적합 매칭)",
    when: ({ input, grade }) =>
      input.service_model === "model3_saas_collab" && grade === "O",
    awards: ["N2SF-IF-14", "N2SF-EB-14"],
    deltaScore: 3,
  },
  {
    id: "RULE-MODEL3-02",
    description: "모델 3 (SaaS) + C/S 등급 → IF-14 등급 부적합 (SaaS는 O 한정)",
    when: ({ input, grade }) =>
      input.service_model === "model3_saas_collab" && (grade === "C" || grade === "S"),
    gaps: ["N2SF-IF-14"],
    deltaScore: -8,
  },
  {
    id: "RULE-MODEL3-03",
    description: "모델 3 → emphasis_controls 권고",
    when: ({ input }) => input.service_model === "model3_saas_collab",
    // recommended는 모델 emphasis 합산 단계에서 처리됨 (점수 영향 없음)
    deltaScore: 0,
  },
  {
    id: "RULE-MODEL8-01",
    description: "모델 8 (통합문서) → CD-1/2, DU-3/4 정보 제공 (S+O 혼재 시 필수 검토)",
    when: ({ input }) => input.service_model === "model8_doc_mgmt",
    gaps: ["N2SF-CD-1", "N2SF-CD-2", "N2SF-DU-3", "N2SF-DU-4"],
    deltaScore: 0, // 정보 제공 — 직접 감점 없음
  },
  {
    id: "RULE-MODEL8-02",
    description: "모델 8 + C 등급 → IF-14 부적합 (통합문서는 S+O 혼재 한정)",
    when: ({ input, grade }) => input.service_model === "model8_doc_mgmt" && grade === "C",
    gaps: ["N2SF-IF-14"],
    deltaScore: -10,
  },
  {
    id: "RULE-MODEL8-03",
    description: "모델 8 → emphasis_controls 권고",
    when: ({ input }) => input.service_model === "model8_doc_mgmt",
    deltaScore: 0,
  },
  {
    id: "RULE-MODEL10-01",
    description: "모델 10 (무선) → WA-1, WA-4 정보 제공 (무선 인증·암호화 필수 점검)",
    when: ({ input }) => input.service_model === "model10_wireless",
    gaps: ["N2SF-WA-1", "N2SF-WA-4"],
    deltaScore: 0, // 정보 제공
  },
  {
    id: "RULE-MODEL10-02",
    description: "모델 10 → emphasis_controls 권고",
    when: ({ input }) => input.service_model === "model10_wireless",
    deltaScore: 0,
  },
];

// ── Rule application ──

const GRADE_WEIGHT: Record<Grade, number> = { C: 1.5, S: 1.2, O: 1.0 };

function applyDelta(delta: DeltaScore | undefined, grade: Grade): number {
  if (delta === undefined) return 0;
  if (typeof delta === "number") return delta;
  return delta[grade] ?? 0;
}

// Validate that an N2SF ID exists in controls.json. Skip silently when not found
// to avoid producing invalid IDs in the output (per 가드레일).
function validId(id: string): boolean {
  return byId.has(id);
}

function pushUnique(target: Set<string>, ids: string[] | undefined): void {
  if (!ids) return;
  for (const id of ids) {
    if (validId(id)) target.add(id);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Look up a service model entry from models.json
type ModelEntry = {
  key: string;
  emphasis_controls?: string[];
};
const MODELS = modelsData as ModelEntry[];
const modelByKey = new Map(MODELS.map((m) => [m.key, m]));

// ── Main entry ──

export function calculateRiskAssessmentV4(input: RiskAssessmentV4Input): RiskAssessmentV4Output {
  // 1) Resolve grade (declared vs derived)
  const resolved_grade = resolveGrade(input);
  // TODO(Day-7): wrap with `if (process.env.N2SF_V4_LOG === "true")` for production verbosity control
  console.log("[v4][grade-resolve]", { declared: input.data_grade, mixed: input.mixed_grade, resolved: resolved_grade });

  // 2) Run v3 baseline (cast away v4-only fields — v3 ignores extras)
  const v3Input: RiskAssessmentV3Input = input;
  const v3Output = runRiskAssessmentV3(v3Input);

  // 3) Iterate rules and collect matched / gap / delta
  const matched = new Set<string>();
  const gaps = new Set<string>();
  const recommended = new Set<string>();
  let scoreDelta = 0;

  const ctx: RuleContext = { input, grade: resolved_grade };
  for (const rule of RULES) {
    if (!rule.when(ctx)) continue;
    pushUnique(matched, rule.awards);
    pushUnique(gaps, rule.gaps);
    scoreDelta += applyDelta(rule.deltaScore, resolved_grade);
  }

  // TODO(Day-7): wrap with `if (process.env.N2SF_V4_LOG === "true")` for production verbosity control
  console.log("[v4][model-match]", { service_model: input.service_model, matched: matched.size, gap: gaps.size, coverage_pct: matched.size + gaps.size === 0 ? 0 : Math.round((matched.size / (matched.size + gaps.size)) * 100) });

  // 4) Merge model emphasis_controls into recommended (skip already matched)
  const modelEntry = modelByKey.get(input.service_model);
  if (modelEntry?.emphasis_controls) {
    for (const id of modelEntry.emphasis_controls) {
      if (!validId(id)) continue;
      if (matched.has(id)) continue;
      recommended.add(id);
    }
  }

  // Note on score semantics:
  //   v3.score is the RISK score (higher = more risk). For v4 we keep the same
  //   "risk score" semantics so that the grade-weighted "risk score" stays consistent
  //   with the rest of v3-derived output (risk_level thresholds, etc.).
  //
  //   Rule deltaScore is in "readiness" units (positive = better posture). To preserve
  //   v3's risk-score semantics we subtract scoreDelta from the risk score.
  //
  //   Then we apply the grade weight to the resulting risk score so that higher grades
  //   (C, S) end up with higher final risk numbers for the same posture.

  const baseRiskScore = v3Output.score;
  const adjustedRisk = baseRiskScore - scoreDelta;
  const scoreBeforeWeight = adjustedRisk;
  const weighted = Math.round(scoreBeforeWeight * GRADE_WEIGHT[resolved_grade]);
  const finalScore = clamp(weighted, 0, 100);

  // TODO(Day-7): wrap with `if (process.env.N2SF_V4_LOG === "true")` for production verbosity control
  // readiness = 100 - risk score; mirrors appropriateness_label thresholds below
  const _readinessForLog = 100 - finalScore;
  const _labelForLog: ApplicabilityLabel = _readinessForLog >= 70 ? "ready" : _readinessForLog >= 40 ? "partial" : "early";
  console.log("[v4][score]", { resolved_grade, base_before_weight: scoreBeforeWeight, final: finalScore, label: _labelForLog });

  // 5) Compute coverage % and appropriateness label.
  // appropriateness_label is a "준비도" (readiness) label, derived from a readiness view of the score.
  // readiness = 100 - risk score.
  const readiness = 100 - finalScore;
  let appropriateness_label: ApplicabilityLabel;
  if (readiness >= 70) appropriateness_label = "ready";
  else if (readiness >= 40) appropriateness_label = "partial";
  else appropriateness_label = "early";

  const matchedCount = matched.size;
  const gapCount = gaps.size;
  const denom = matchedCount + gapCount;
  const coverage_pct = denom === 0 ? 0 : Math.round((matchedCount / denom) * 100);

  // 6) Risk level recompute based on final (weighted) risk score so it stays consistent.
  let risk_level: RiskAssessmentV4Output["risk_level"];
  if (finalScore >= 76) risk_level = "critical";
  else if (finalScore >= 51) risk_level = "high";
  else if (finalScore >= 26) risk_level = "medium";
  else risk_level = "low";

  return {
    ...v3Output,
    version: "v4",
    score: finalScore,
    risk_level,
    resolved_grade,
    service_model: input.service_model,
    n2sf_compliance: {
      matched_controls: Array.from(matched).sort(),
      gap_controls: Array.from(gaps).sort(),
      recommended_controls: Array.from(recommended).sort(),
      coverage_pct,
    },
    appropriateness_label,
  };
}
