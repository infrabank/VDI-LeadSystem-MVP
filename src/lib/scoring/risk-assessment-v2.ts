export interface RiskAssessmentInput {
  platform: "citrix" | "vmware" | "xenserver" | "mixed";
  vm_count: number;
  network_separation: boolean;
  storage_migration: boolean;
  backup_exists: boolean;
  downtime_tolerance: "none" | "short" | "night";
  ops_staff_level?: "low" | "mid" | "high";
}

// ── Category Scores ──

interface CategoryScore {
  score: number;
  level: number; // 1~5
}

interface MaturityModel {
  migration: CategoryScore;
  dr: CategoryScore;
  operations: CategoryScore;
  automation: CategoryScore;
}

// ── Risk Detail ──

interface RiskDetail {
  title: string;
  impact_scope: string;
  potential_impact: string;
  trigger_condition: string;
  likelihood: "low" | "medium" | "high";
}

// ── Current State Projection ──

interface CurrentStateProjection {
  short_term_risk: string;
  mid_term_risk: string;
  large_scale_event_risk: string;
}

// ── Roadmap ──

interface RoadmapPhase {
  title: string;
  duration: string;
  actions: string[];
}

interface Roadmap {
  phase_1: RoadmapPhase;
  phase_2: RoadmapPhase;
  phase_3: RoadmapPhase;
}

// ── Output ──

export interface RiskAssessmentV2Output {
  version: "v2";
  score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  maturity_model: MaturityModel;
  benchmark_text: string;
  benchmark_comparison: string;
  risks: RiskDetail[];
  current_state_projection: CurrentStateProjection;
  roadmap: Roadmap;
  executive_summary: string;
  // Backward-compat: flat risk messages for legacy consumers
  risk_messages: string[];
  next_steps: string[];
}

// ── Benchmark Constants ──

const BENCHMARK_AVG: Record<string, number> = {
  small: 40,  // 50~200 VM
  medium: 55, // 200~500 VM
  large: 65,  // 500+ VM
};

function getBenchmarkTier(vmCount: number): { tier: string; avg: number; label: string } {
  if (vmCount >= 500) return { tier: "large", avg: BENCHMARK_AVG.large, label: "500+ VM 규모" };
  if (vmCount >= 200) return { tier: "medium", avg: BENCHMARK_AVG.medium, label: "200~500 VM 규모" };
  return { tier: "small", avg: BENCHMARK_AVG.small, label: "50~200 VM 규모" };
}

// ── Score-to-Level (5-point scale) ──

function scoreToLevel(score: number): number {
  if (score >= 23) return 5;
  if (score >= 18) return 4;
  if (score >= 11) return 3;
  if (score >= 6) return 2;
  return 1;
}

// ── Category Scoring ──

function calcMigrationReadiness(input: RiskAssessmentInput): number {
  let score = 25;

  if (input.storage_migration && input.downtime_tolerance === "none") score -= 8;
  else if (input.storage_migration) score -= 5;

  if (input.vm_count > 500) score -= 5;
  else if (input.vm_count > 200) score -= 3;

  if (input.network_separation) score -= 4;

  if (input.platform === "mixed") score -= 4;
  else if (input.platform === "xenserver") score -= 2;

  if (input.downtime_tolerance === "none") score -= 3;
  else if (input.downtime_tolerance === "short") score -= 1;

  return Math.max(0, score);
}

function calcDRBackup(input: RiskAssessmentInput): number {
  let score = 25;

  if (!input.backup_exists) score -= 10;
  if (input.downtime_tolerance === "none" && !input.backup_exists) score -= 5;
  if (input.downtime_tolerance === "none") score -= 3;
  if (input.storage_migration && !input.backup_exists) score -= 4;
  if (input.vm_count > 300 && !input.backup_exists) score -= 3;

  return Math.max(0, score);
}

function calcOperational(input: RiskAssessmentInput): number {
  let score = 25;

  if (input.ops_staff_level === "low") score -= 8;
  else if (input.ops_staff_level === "mid") score -= 3;

  if (input.platform === "mixed" && input.ops_staff_level !== "high") score -= 4;
  if (input.vm_count > 500 && input.ops_staff_level === "low") score -= 5;
  if (input.downtime_tolerance === "none" && input.ops_staff_level !== "high") score -= 3;

  return Math.max(0, score);
}

function calcAutomation(input: RiskAssessmentInput): number {
  let score = 25;

  if (input.vm_count > 200 && input.ops_staff_level !== "high") score -= 6;
  if (input.vm_count > 500) score -= 4;
  if (input.storage_migration && input.vm_count > 200) score -= 4;
  if (input.platform === "mixed") score -= 3;
  if (input.ops_staff_level === "low" && input.vm_count > 100) score -= 3;

  return Math.max(0, score);
}

// ── Risk Detail Generation ──

interface RiskRule {
  condition: (input: RiskAssessmentInput) => boolean;
  priority: number;
  detail: (input: RiskAssessmentInput) => RiskDetail;
}

const RISK_DETAIL_RULES: RiskRule[] = [
  {
    condition: (i) => i.storage_migration && i.downtime_tolerance === "none",
    priority: 10,
    detail: () => ({
      title: "무중단 스토리지 이관 리스크",
      impact_scope: "전체 VDI 서비스 가용성",
      potential_impact: "이관 중 I/O 병목으로 전체 사용자 세션 중단 가능. 데이터 정합성 검증 실패 시 롤백 필요.",
      trigger_condition: "스토리지 이관 + 다운타임 미허용 조건이 동시 충족",
      likelihood: "high",
    }),
  },
  {
    condition: (i) => !i.backup_exists,
    priority: 9,
    detail: () => ({
      title: "백업 체계 부재에 따른 데이터 유실 리스크",
      impact_scope: "전체 VM 및 사용자 데이터",
      potential_impact: "이관 실패 또는 장애 발생 시 복구 불가. 비즈니스 연속성 심각한 위협.",
      trigger_condition: "백업/DR 체계 미구축 상태에서 이관 또는 장애 발생",
      likelihood: "high",
    }),
  },
  {
    condition: (i) => i.vm_count >= 500,
    priority: 8,
    detail: (i) => ({
      title: "대규모 VM 환경의 복잡성 리스크",
      impact_scope: `${i.vm_count}대 VM 전체 이관 프로세스`,
      potential_impact: "단계별 배치 전략 없이 일괄 이관 시 일정 지연 및 서비스 장애 가능성 높음.",
      trigger_condition: "VM 500대 이상 환경에서 자동화 없이 수동 이관 시도",
      likelihood: "high",
    }),
  },
  {
    condition: (i) => i.network_separation,
    priority: 7,
    detail: () => ({
      title: "네트워크 분리 환경의 이관 복잡도",
      impact_scope: "네트워크 아키텍처 및 보안 정책",
      potential_impact: "방화벽/라우팅 변경 과정에서 서비스 단절. 보안 정책 불일치로 접속 장애 발생.",
      trigger_condition: "분리된 네트워크 존 간 VM 이동 시 사전 정책 미수립",
      likelihood: "medium",
    }),
  },
  {
    condition: (i) => i.ops_staff_level === "low",
    priority: 7,
    detail: () => ({
      title: "운영 역량 부족으로 인한 대응 지연 리스크",
      impact_scope: "이관 실행 및 장애 대응 전반",
      potential_impact: "이관 중 예상치 못한 이슈에 대한 즉각 대응 불가. 장애 복구 시간(MTTR) 증가.",
      trigger_condition: "운영 인력 수준 '낮음' 상태에서 복잡 이관 수행",
      likelihood: "high",
    }),
  },
  {
    condition: (i) => i.platform === "mixed",
    priority: 6,
    detail: () => ({
      title: "혼합 플랫폼 호환성 리스크",
      impact_scope: "플랫폼 간 VM 이관 및 통합 관리",
      potential_impact: "플랫폼별 포맷 차이로 변환 실패, 성능 저하, 라이선스 충돌 가능.",
      trigger_condition: "서로 다른 하이퍼바이저 간 직접 마이그레이션 시도",
      likelihood: "medium",
    }),
  },
  {
    condition: (i) => i.downtime_tolerance === "none",
    priority: 6,
    detail: () => ({
      title: "무중단 요구사항으로 인한 이관 난이도 상승",
      impact_scope: "이관 전략 및 일정 전반",
      potential_impact: "라이브 마이그레이션, 이중 운영 등 고비용 전략 필수. 실패 시 서비스 전면 중단.",
      trigger_condition: "다운타임 불허 상태에서 이관 실행",
      likelihood: "medium",
    }),
  },
  {
    condition: (i) => i.storage_migration,
    priority: 5,
    detail: () => ({
      title: "스토리지 이관 시 데이터 정합성 리스크",
      impact_scope: "스토리지 데이터 및 VM 디스크 이미지",
      potential_impact: "대용량 데이터 이관 중 체크섬 불일치, 전송 중단으로 데이터 손상 가능.",
      trigger_condition: "스토리지 이관 포함된 마이그레이션 실행",
      likelihood: "medium",
    }),
  },
  {
    condition: (i) => i.vm_count >= 200 && i.vm_count < 500 && i.ops_staff_level !== "high",
    priority: 4,
    detail: (i) => ({
      title: "중규모 환경의 자동화 부재 리스크",
      impact_scope: `${i.vm_count}대 VM 이관 효율성`,
      potential_impact: "수동 작업 의존으로 휴먼 에러 발생률 증가. 이관 일정 2~3배 지연 가능.",
      trigger_condition: "200대 이상 VM을 자동화 도구 없이 이관",
      likelihood: "medium",
    }),
  },
  {
    condition: (i) => i.platform === "xenserver",
    priority: 3,
    detail: () => ({
      title: "XenServer 플랫폼 지원 축소 리스크",
      impact_scope: "장기 운영 안정성 및 벤더 지원",
      potential_impact: "Citrix 라이선스 정책 변경으로 지원 범위 축소. 대안 플랫폼 전환 필요성 증가.",
      trigger_condition: "XenServer 기반 운영 환경에서 장기 계획 수립",
      likelihood: "low",
    }),
  },
];

function generateRiskDetails(input: RiskAssessmentInput): RiskDetail[] {
  return RISK_DETAIL_RULES
    .filter((rule) => rule.condition(input))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5)
    .map((rule) => rule.detail(input));
}

// ── Current State Projection ──

function generateProjection(input: RiskAssessmentInput, totalScore: number): CurrentStateProjection {
  const short_term_risk =
    totalScore >= 70
      ? "향후 3개월 내 이관 또는 운영 중 중대 장애 발생 가능성이 높습니다. 즉시 리스크 완화 조치가 필요합니다."
      : totalScore >= 50
        ? "향후 3개월 내 일부 구간에서 서비스 중단이 발생할 수 있습니다. 사전 점검을 권장합니다."
        : "단기적으로 안정적이나, 이관 시 기본적인 리스크 관리 절차가 필요합니다.";

  let mid_term_risk: string;
  if (!input.backup_exists && totalScore >= 50) {
    mid_term_risk = "6~12개월 내 백업 부재로 인한 데이터 유실 사고 발생 확률이 높습니다. DR 체계 미구축 시 비즈니스 연속성에 심각한 위협이 됩니다.";
  } else if (totalScore >= 50) {
    mid_term_risk = "6~12개월 내 운영 복잡도 증가에 따른 관리 비용 상승과 간헐적 서비스 영향이 예상됩니다.";
  } else {
    mid_term_risk = "중기적으로 안정적이나, 인프라 노후화에 대비한 계획 수립이 권장됩니다.";
  }

  let large_scale_event_risk: string;
  if (input.vm_count >= 500 && !input.backup_exists) {
    large_scale_event_risk = `대규모 장애 발생 시 ${input.vm_count}대 VM에 대한 복구 수단이 없어, 전사 업무 마비가 수 일 이상 지속될 수 있습니다. 재해 복구 비용만 수억 원 이상 예상됩니다.`;
  } else if (input.vm_count >= 300) {
    large_scale_event_risk = `대규모 장애 시 ${input.vm_count}대 VM 복구에 상당한 시간이 소요되며, 업무 중단에 따른 생산성 손실이 발생합니다.`;
  } else {
    large_scale_event_risk = "대규모 장애 발생 시 복구 시간에 따라 업무 영향이 있을 수 있으나, 규모가 관리 가능한 수준입니다.";
  }

  return { short_term_risk, mid_term_risk, large_scale_event_risk };
}

// ── Roadmap ──

function generateRoadmap(input: RiskAssessmentInput, totalScore: number): Roadmap {
  const phase1Actions: string[] = [];
  const phase2Actions: string[] = [];
  const phase3Actions: string[] = [];

  // Phase 1 (1~2주): 즉시 조치
  if (!input.backup_exists) {
    phase1Actions.push("전체 VM 및 데이터에 대한 긴급 백업 체계 구축");
  }
  if (totalScore >= 50) {
    phase1Actions.push("리스크 항목별 우선순위 매트릭스 작성 및 담당자 지정");
  }
  phase1Actions.push("현재 인프라 구성 문서화 및 이관 대상 VM 목록 확정");
  phase1Actions.push("이관 프로젝트 킥오프 및 이해관계자 역할/책임 정의");
  if (input.ops_staff_level === "low") {
    phase1Actions.push("외부 전문가 투입 검토 및 기술 지원 계약 확보");
  }

  // Phase 2 (1개월): 기반 구축
  if (input.storage_migration) {
    phase2Actions.push("스토리지 이관 PoC 환경 구축 및 데이터 정합성 검증 테스트");
  }
  if (input.downtime_tolerance === "none") {
    phase2Actions.push("무중단 이관을 위한 단계적 컷오버 전략 수립 및 리허설 실시");
  }
  if (input.network_separation) {
    phase2Actions.push("네트워크 분리 구간의 방화벽/라우팅 변경 계획 수립 및 사전 테스트");
  }
  phase2Actions.push("이관 자동화 스크립트 개발 및 테스트 환경 검증");
  phase2Actions.push("이관 대상 VM별 의존성 매핑 및 서비스 영향도 분석");
  if (input.vm_count >= 200) {
    phase2Actions.push("배치 단위 이관 일정 수립 (부서/서비스별 우선순위)");
  }

  // Phase 3 (3개월): 실행 및 안정화
  phase3Actions.push("단계별 본 이관 실행 (배치 1차 → 2차 → 최종)");
  phase3Actions.push("이관 후 성능 모니터링 체계 구축 및 안정화 기간 운영");
  if (totalScore >= 50) {
    phase3Actions.push("DR 테스트 실시 및 재해 복구 계획(DRP) 문서화");
  }
  phase3Actions.push("운영 팀 교육 및 표준 운영 절차(SOP) 수립");

  return {
    phase_1: { title: "즉시 조치", duration: "1~2주", actions: phase1Actions.slice(0, 3) },
    phase_2: { title: "기반 구축", duration: "1개월", actions: phase2Actions.slice(0, 3) },
    phase_3: { title: "실행 및 안정화", duration: "3개월", actions: phase3Actions.slice(0, 3) },
  };
}

// ── Executive Summary ──

function generateExecutiveSummary(
  input: RiskAssessmentInput,
  totalScore: number,
  riskLevel: string,
  benchmarkComparison: string,
): string {
  const vmLabel = input.vm_count >= 500 ? "대규모" : input.vm_count >= 200 ? "중규모" : "소규모";
  const levelKo: Record<string, string> = { low: "낮음", medium: "보통", high: "높음", critical: "매우 높음" };

  return `${input.platform.toUpperCase()} 기반 ${vmLabel}(${input.vm_count}대) VDI 환경에 대한 리스크 진단 결과, 종합 리스크 점수는 ${totalScore}점(${levelKo[riskLevel]})으로 평가되었습니다. ${benchmarkComparison} 주요 리스크 요인을 기반으로 단계별 개선 로드맵을 수립하였으며, 즉시 조치 항목부터 순차적으로 이행할 것을 권장합니다.`;
}

// ── Next Steps (backward compat) ──

function generateNextSteps(riskLevel: string, input: RiskAssessmentInput): string[] {
  const steps: string[] = [];

  if (riskLevel === "critical" || riskLevel === "high") {
    steps.push("전문 컨설턴트와 함께 상세 리스크 평가를 진행하세요");
    steps.push("이관 전 PoC(Proof of Concept) 환경 구축을 권장합니다");
  }

  if (!input.backup_exists) steps.push("이관 전 전체 백업 체계를 우선 구축하세요");
  if (input.storage_migration) steps.push("스토리지 이관 전 데이터 정합성 검증 절차를 수립하세요");
  if (input.downtime_tolerance === "none") steps.push("무중단 이관을 위한 단계적 컷오버 계획을 수립하세요");

  if (riskLevel === "medium" || riskLevel === "low") {
    steps.push("표준 이관 체크리스트를 기반으로 계획을 수립하세요");
  }

  steps.push("이관 일정과 롤백 시나리오를 문서화하세요");
  return steps.slice(0, 5);
}

// ── Main Entry ──

export function runRiskAssessmentV2(input: RiskAssessmentInput): RiskAssessmentV2Output {
  // 1) Category scores
  const migrationScore = calcMigrationReadiness(input);
  const drScore = calcDRBackup(input);
  const opsScore = calcOperational(input);
  const autoScore = calcAutomation(input);

  const totalScore = migrationScore + drScore + opsScore + autoScore;
  // Invert: high category = good, but total risk score = 100 - total readiness
  // Actually the spec says total = sum of 4 categories (0~100), and the categories START at 25 and DEDUCT.
  // So high total = good (low risk), low total = bad (high risk).
  // But the existing v1 uses high score = high risk. Let me re-read the spec.
  // "총점 = 4개 합산 (0~100)" and "리스크 등급" mapping...
  // The spec says category scores deduct from 25, so max readiness = 100.
  // But the risk_level mapping should be: low readiness score → high risk.
  // The v1 accumulates risk points (high = more risky).
  // For v2, we need to invert: riskScore = 100 - totalReadiness
  const riskScore = 100 - totalScore;

  // Risk level (based on risk score, not readiness)
  let risk_level: RiskAssessmentV2Output["risk_level"];
  if (riskScore >= 70) risk_level = "critical";
  else if (riskScore >= 50) risk_level = "high";
  else if (riskScore >= 30) risk_level = "medium";
  else risk_level = "low";

  // 2) Maturity model
  const maturity_model: MaturityModel = {
    migration: { score: migrationScore, level: scoreToLevel(migrationScore) },
    dr: { score: drScore, level: scoreToLevel(drScore) },
    operations: { score: opsScore, level: scoreToLevel(opsScore) },
    automation: { score: autoScore, level: scoreToLevel(autoScore) },
  };

  // 3) Benchmark
  const bench = getBenchmarkTier(input.vm_count);
  let benchmark_comparison: string;
  if (riskScore > bench.avg + 10) {
    benchmark_comparison = `${bench.label} 평균(${bench.avg}점) 대비 리스크가 ${riskScore - bench.avg}점 높습니다. 즉각적인 개선 조치가 필요합니다.`;
  } else if (riskScore < bench.avg - 10) {
    benchmark_comparison = `${bench.label} 평균(${bench.avg}점) 대비 ${bench.avg - riskScore}점 낮은 안정적 수준입니다.`;
  } else {
    benchmark_comparison = `${bench.label} 평균(${bench.avg}점)과 유사한 수준입니다. 추가 개선 여지가 있습니다.`;
  }
  const benchmark_text = `※ 내부 분석 기준에 따른 ${bench.label} 비교값`;

  // 4) Risk details
  const risks = generateRiskDetails(input);
  const risk_messages = risks.map((r) => r.title + ": " + r.potential_impact);

  // 5) Projection
  const current_state_projection = generateProjection(input, riskScore);

  // 6) Roadmap
  const roadmap = generateRoadmap(input, riskScore);

  // 7) Executive summary
  const executive_summary = generateExecutiveSummary(input, riskScore, risk_level, benchmark_comparison);

  // 8) Next steps
  const next_steps = generateNextSteps(risk_level, input);

  return {
    version: "v2",
    score: riskScore,
    risk_level,
    maturity_model,
    benchmark_text,
    benchmark_comparison,
    risks,
    current_state_projection,
    roadmap,
    executive_summary,
    risk_messages,
    next_steps,
  };
}
