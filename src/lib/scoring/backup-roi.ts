// =====================================================================
// Backup ROI Calculator — 룰 기반 계산 엔진
// 입력: 5개 단순 필드 (users, hourly_loss_kw, data_tb, annual_backup_cost_kw, annual_downtime_hours)
// 출력: BackupRoiOutput — 5년 TCO 비교, 회피 비용, ROI%, Payback, 시나리오 3종
//
// 단위: KW = 만원 (10000 KRW). 모든 금액 KW로 통일.
// 설계: docs/01-plan/features/backup-roi.plan.md
// =====================================================================

export interface BackupRoiInputs {
  users: number;
  hourly_loss_kw: number;
  data_tb: number;
  annual_backup_cost_kw: number;
  annual_downtime_hours: number;
}

export interface CostBreakdown {
  total: number;
  breakdown: Record<string, number>;
}

export interface ScenarioResult {
  avoided_5yr: number; // KW
  roi_pct: number;
  payback_months: number;
}

export interface BackupRoiOutput {
  version: "v1";
  tool: "backup_roi";
  inputs: BackupRoiInputs;
  current_5yr: CostBreakdown;
  acronis_5yr: CostBreakdown;
  scenarios: {
    best: ScenarioResult;
    expected: ScenarioResult;
    worst: ScenarioResult;
  };
  summary: string;
  recommendations: string[];
  score: number; // display용 0~100
}

// ── 디폴트 단가 (KW) ──
const RANSOMWARE_PER_USER_YR = 1.2; // 만원/명/년 — 업계 평균 사고 영향 추정
const MANUAL_RECOVERY_PER_USER = 0.3; // 만원/명/사고
const ACRONIS_LICENSE_PER_USER_YR = 12; // EP+서버 통합 라이선스 추정
const ACRONIS_STORAGE_PER_TB_YR = 18; // 클라우드 백업 스토리지
const IMPLEMENTATION_ONETIME = 1500;
const MANAGED_SERVICE_YR = 600;
const RANSOM_INCIDENTS_PER_YEAR = 0.5; // 사고 빈도 가정

// 효과 계수 (Expected 시나리오)
const RISK_REDUCTION_EXPECTED = 0.85; // 85% 감소
const DOWNTIME_REDUCTION_EXPECTED = 0.70; // 70% 감소

// 시나리오 변동
const SCENARIO_FACTORS = {
  best: { risk: 0.50, downtime: 0.20, acronis_savings: 1.10 }, // 사고 영향 잔존 50%, 다운타임 잔존 20%, Acronis 비용 -10%
  expected: { risk: 1 - RISK_REDUCTION_EXPECTED, downtime: 1 - DOWNTIME_REDUCTION_EXPECTED, acronis_savings: 1.0 },
  worst: { risk: 0.80, downtime: 0.60, acronis_savings: 0.90 },
} as const;

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function safeDivide(num: number, denom: number): number {
  return denom === 0 ? 0 : num / denom;
}

// ── 현 환경 5년 비용 ──
function calcCurrent5yr(inputs: BackupRoiInputs): CostBreakdown {
  const op_cost = inputs.annual_backup_cost_kw * 5;
  const ransomware = inputs.users * RANSOMWARE_PER_USER_YR * 5;
  const downtime = inputs.annual_downtime_hours * inputs.hourly_loss_kw * 5;
  const recovery = inputs.users * MANUAL_RECOVERY_PER_USER * RANSOM_INCIDENTS_PER_YEAR * 5;

  return {
    total: Math.round(op_cost + ransomware + downtime + recovery),
    breakdown: {
      "운영비": Math.round(op_cost),
      "랜섬웨어 사고 영향": Math.round(ransomware),
      "다운타임 손실": Math.round(downtime),
      "수기 복구 인건비": Math.round(recovery),
    },
  };
}

// ── Acronis 도입 5년 비용 (Expected 기준) ──
function calcAcronis5yr(inputs: BackupRoiInputs, savingsFactor = 1): CostBreakdown {
  const license = inputs.users * ACRONIS_LICENSE_PER_USER_YR * 5;
  const storage = inputs.data_tb * ACRONIS_STORAGE_PER_TB_YR * 5;
  const implementation = IMPLEMENTATION_ONETIME;
  const managed = MANAGED_SERVICE_YR * 5;

  // 잔존 위험 (Expected)
  const residualRansom = inputs.users * RANSOMWARE_PER_USER_YR * 5 * (1 - RISK_REDUCTION_EXPECTED);
  const residualDown = inputs.annual_downtime_hours * inputs.hourly_loss_kw * 5 * (1 - DOWNTIME_REDUCTION_EXPECTED);

  const subtotal = (license + storage + implementation + managed) / savingsFactor;
  return {
    total: Math.round(subtotal + residualRansom + residualDown),
    breakdown: {
      "Acronis 라이선스": Math.round(license / savingsFactor),
      "클라우드 스토리지": Math.round(storage / savingsFactor),
      "초기 도입": Math.round(implementation / savingsFactor),
      "MSP 운영 (옵션)": Math.round(managed / savingsFactor),
      "잔존 사고 위험": Math.round(residualRansom),
      "잔존 다운타임": Math.round(residualDown),
    },
  };
}

// ── 시나리오 계산 ──
function calcScenario(
  inputs: BackupRoiInputs,
  factor: { risk: number; downtime: number; acronis_savings: number }
): ScenarioResult {
  const ransomware_risk = inputs.users * RANSOMWARE_PER_USER_YR * 5;
  const downtime_cost = inputs.annual_downtime_hours * inputs.hourly_loss_kw * 5;
  const op_cost = inputs.annual_backup_cost_kw * 5;
  const recovery = inputs.users * MANUAL_RECOVERY_PER_USER * RANSOM_INCIDENTS_PER_YEAR * 5;

  const current_5yr = op_cost + ransomware_risk + downtime_cost + recovery;

  const license = inputs.users * ACRONIS_LICENSE_PER_USER_YR * 5;
  const storage = inputs.data_tb * ACRONIS_STORAGE_PER_TB_YR * 5;
  const implementation = IMPLEMENTATION_ONETIME;
  const managed = MANAGED_SERVICE_YR * 5;
  const acronis_invest = (license + storage + implementation + managed) / factor.acronis_savings;
  const residualRansom = ransomware_risk * factor.risk;
  const residualDown = downtime_cost * factor.downtime;
  const acronis_5yr = acronis_invest + residualRansom + residualDown;

  const avoided_5yr = current_5yr - acronis_5yr;
  const annual_avoided = safeDivide(avoided_5yr, 5);
  const roi_pct = clamp(safeDivide(avoided_5yr, acronis_invest) * 100, -100, 999);
  // Payback: 회피되는 연간 비용으로 도입 비용 회수
  const payback_months =
    annual_avoided > 0 ? clamp(safeDivide(implementation * 12, annual_avoided), 1, 120) : 120;

  return {
    avoided_5yr: Math.round(avoided_5yr),
    roi_pct: Math.round(roi_pct * 10) / 10, // 1 decimal
    payback_months: Math.round(payback_months * 10) / 10,
  };
}

// ── 권고 ──
function generateRecommendations(inputs: BackupRoiInputs, expected: ScenarioResult): string[] {
  const recs: string[] = [];

  if (expected.roi_pct >= 100) {
    recs.push("ROI 100% 이상 — 5년 누적 회피액이 도입 비용을 초과합니다. 우선 도입 검토 권장.");
  } else if (expected.roi_pct >= 30) {
    recs.push("ROI 양호 — 단계별 도입(엔드포인트 우선 → 서버 → DR)으로 risk-adjusted 효과 확보 가능.");
  } else {
    recs.push("현 환경 비용이 낮은 편. Acronis는 사고 시 손실 회피·운영 자동화 가치를 우선 검토하세요.");
  }

  if (inputs.annual_downtime_hours >= 24) {
    recs.push("다운타임 비중이 높습니다 — Acronis Cyber Disaster Recovery 클라우드 페일오버 우선 도입 권장.");
  }

  if (inputs.data_tb >= 20) {
    recs.push("데이터 규모 ≥ 20TB — 단계별 보관(Storage Tiering)으로 스토리지 비용 30%+ 절감 가능.");
  }

  if (inputs.users >= 200) {
    recs.push("규모 ≥ 200명 — MSP 운영 옵션으로 내부 인력 부담을 분산하는 것이 일반적입니다.");
  }

  if (recs.length < 3) {
    recs.push("백업·EDR·패치 관리 통합으로 운영 인건비 추가 절감 효과를 검토하세요.");
  }

  return recs.slice(0, 4);
}

// ── 요약 ──
function generateSummary(out: Omit<BackupRoiOutput, "summary" | "recommendations" | "score">): string {
  const exp = out.scenarios.expected;
  const sign = exp.avoided_5yr >= 0 ? "절감" : "추가 비용";
  const absVal = Math.abs(exp.avoided_5yr);
  return `Expected 시나리오에서 5년간 ${absVal.toLocaleString()}만원 ${sign} 가능, ROI ${exp.roi_pct}%, Payback ${exp.payback_months}개월. 현 환경 5년 누적 ${out.current_5yr.total.toLocaleString()}만원 vs Acronis 도입 ${out.acronis_5yr.total.toLocaleString()}만원.`;
}

// ── Display 점수 (0~100) ──
function calcDisplayScore(roi_pct: number): number {
  // ROI 0%=50점, 100%=80점, 200%+=100점, -50%=0점 (대략)
  if (roi_pct >= 200) return 100;
  if (roi_pct >= 0) return Math.round(50 + (roi_pct / 200) * 50);
  return Math.max(0, Math.round(50 + roi_pct / 2));
}

// ── Main ──
export function runBackupRoi(inputs: BackupRoiInputs): BackupRoiOutput {
  // 입력 정제
  const cleanInputs: BackupRoiInputs = {
    users: Math.max(1, Math.round(inputs.users || 0)),
    hourly_loss_kw: Math.max(0, inputs.hourly_loss_kw || 0),
    data_tb: Math.max(0.1, inputs.data_tb || 0),
    annual_backup_cost_kw: Math.max(0, inputs.annual_backup_cost_kw || 0),
    annual_downtime_hours: Math.max(0, inputs.annual_downtime_hours || 0),
  };

  const current_5yr = calcCurrent5yr(cleanInputs);
  const acronis_5yr = calcAcronis5yr(cleanInputs);

  const scenarios = {
    best: calcScenario(cleanInputs, SCENARIO_FACTORS.best),
    expected: calcScenario(cleanInputs, SCENARIO_FACTORS.expected),
    worst: calcScenario(cleanInputs, SCENARIO_FACTORS.worst),
  };

  const partial = {
    version: "v1" as const,
    tool: "backup_roi" as const,
    inputs: cleanInputs,
    current_5yr,
    acronis_5yr,
    scenarios,
  };

  return {
    ...partial,
    summary: generateSummary(partial),
    recommendations: generateRecommendations(cleanInputs, scenarios.expected),
    score: calcDisplayScore(scenarios.expected.roi_pct),
  };
}
