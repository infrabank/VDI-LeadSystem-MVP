import type { RiskAssessmentV3Input } from "@/lib/tools/risk-assessment/questions.v3";

// ── Shared Types (compatible with v2 structure) ──

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

interface RiskDetail {
  title: string;
  impact_scope: string;
  potential_impact: string;
  trigger_condition: string;
  likelihood: "low" | "medium" | "high";
  category: "migration" | "dr" | "operations" | "automation" | "security";
}

interface CurrentStateProjection {
  short_term_risk: string;
  mid_term_risk: string;
  large_scale_event_risk: string;
}

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

export interface RiskAssessmentV3Output {
  version: "v3";
  score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  maturity_model: MaturityModel;
  benchmark_text: string;
  benchmark_comparison: string;
  risks: RiskDetail[];
  current_state_projection: CurrentStateProjection;
  roadmap: Roadmap;
  executive_summary: string;
  // Backward-compat
  risk_messages: string[];
  next_steps: string[];
}

// ── Benchmark Constants ──

const BENCHMARK_AVG: Record<string, number> = {
  small: 38,
  medium: 52,
  large: 64,
};

function getBenchmarkTier(vmCount: number): { tier: string; avg: number; label: string } {
  if (vmCount >= 500) return { tier: "large", avg: BENCHMARK_AVG.large, label: "500+ VM 규모" };
  if (vmCount >= 200) return { tier: "medium", avg: BENCHMARK_AVG.medium, label: "200~500 VM 규모" };
  return { tier: "small", avg: BENCHMARK_AVG.small, label: "50~200 VM 규모" };
}

// ── Score-to-Level (5-point maturity) ──

function scoreToLevel(score: number): number {
  if (score >= 23) return 5;
  if (score >= 18) return 4;
  if (score >= 11) return 3;
  if (score >= 6) return 2;
  return 1;
}

// ── Category Scoring (each 0~25, start at 25 and deduct) ──

function calcMigration(input: RiskAssessmentV3Input): number {
  let s = 25;
  if (input.storage_migration) s -= 6;
  if (input.network_separation) s -= 3;
  if (input.migration_rehearsal === "none") s -= 8;
  else if (input.migration_rehearsal === "partial") s -= 4;
  if (input.change_management === "none") s -= 3;
  if (input.documentation_level === "none") s -= 3;
  if (input.vm_count >= 500) s -= 3;
  if (input.multipath_configured === "no") s -= 2;
  else if (input.multipath_configured === "unknown") s -= 1;
  return Math.max(0, Math.min(25, s));
}

function calcDR(input: RiskAssessmentV3Input): number {
  let s = 25;
  if (input.backup_exists === "no") s -= 10;
  else if (input.backup_exists === "unknown") s -= 5;
  if (input.dr_site === "none") s -= 8;
  else if (input.dr_site === "cold") s -= 5;
  else if (input.dr_site === "warm") s -= 3;
  else if (input.dr_site === "unknown") s -= 4;
  if (input.rpo_target === "unknown") s -= 2;
  else if (input.rpo_target === ">24h") s -= 3;
  if (input.rto_target === "unknown") s -= 2;
  else if (input.rto_target === ">24h") s -= 3;
  const freq = input.backup_frequency || "unknown";
  if (freq === "ad-hoc" || freq === "unknown") s -= 2;
  return Math.max(0, Math.min(25, s));
}

function calcOperations(input: RiskAssessmentV3Input): number {
  let s = 25;
  if (input.ops_staff_level === "low") s -= 6;
  else if (input.ops_staff_level === "mid") s -= 3;
  if (input.incident_response_maturity === "ad-hoc") s -= 6;
  else if (input.incident_response_maturity === "basic") s -= 3;
  if (input.change_management === "none") s -= 6;
  else if (input.change_management === "basic") s -= 3;
  if (input.documentation_level === "none") s -= 6;
  else if (input.documentation_level === "partial") s -= 3;
  return Math.max(0, Math.min(25, s));
}

function calcAutomation(input: RiskAssessmentV3Input): number {
  let s = 25;
  if (input.automation_level === "none") s -= 8;
  else if (input.automation_level === "some") s -= 5;
  else if (input.automation_level === "standard") s -= 2;
  const prov = input.provisioning_time || "unknown";
  if (prov === ">30m") s -= 3;
  else if (prov === "unknown") s -= 2;
  if (input.vm_count >= 200 && (input.automation_level === "none" || input.automation_level === "some")) s -= 3;
  if (input.host_count >= 10 && input.ops_staff_level !== "high") s -= 2;
  return Math.max(0, Math.min(25, s));
}

// ── Risk Detail Generation ──

interface RiskRule {
  condition: (input: RiskAssessmentV3Input) => boolean;
  priority: number;
  detail: (input: RiskAssessmentV3Input) => RiskDetail;
}

const RISK_RULES: RiskRule[] = [
  {
    condition: (i) => i.storage_migration,
    priority: 10,
    detail: () => ({
      title: "스토리지 이관 병목 및 데이터 정합성 리스크",
      impact_scope: "전체 VDI 서비스 및 사용자 데이터",
      potential_impact: "대용량 데이터 이관 중 I/O 병목, 체크섬 불일치로 데이터 손상 가능. 롤백 실패 시 전체 서비스 중단.",
      trigger_condition: "스토리지 이관 포함 마이그레이션 실행 시",
      likelihood: "high",
      category: "migration",
    }),
  },
  {
    condition: (i) => i.migration_rehearsal === "none",
    priority: 9,
    detail: () => ({
      title: "사전 리허설 부재로 컷오버 실패 리스크",
      impact_scope: "마이그레이션 전체 일정 및 서비스 안정성",
      potential_impact: "예상치 못한 호환성 이슈, 성능 저하, 데이터 누락 발생. 실전 이관 시 롤백 판단 지연.",
      trigger_condition: "이관 리허설 미수행 상태에서 본 이관 시도",
      likelihood: "high",
      category: "migration",
    }),
  },
  {
    condition: (i) => i.dr_site === "none",
    priority: 9,
    detail: () => ({
      title: "DR 부재로 재해 복구 불가 리스크",
      impact_scope: "전사 VDI 서비스 연속성",
      potential_impact: "자연재해, 시설 장애 시 서비스 복구 불가. 전사 업무 마비 장기화.",
      trigger_condition: "DR 사이트 미구축 상태에서 재해 발생",
      likelihood: "medium",
      category: "dr",
    }),
  },
  {
    condition: (i) => i.backup_exists === "no",
    priority: 9,
    detail: () => ({
      title: "백업 부재로 데이터 복구 불가 리스크",
      impact_scope: "전체 VM 및 사용자 데이터",
      potential_impact: "랜섬웨어 감염, 오삭제, 하드웨어 장애 시 데이터 영구 손실. 비즈니스 연속성 위협.",
      trigger_condition: "백업 체계 미보유 상태에서 데이터 손실 이벤트 발생",
      likelihood: "high",
      category: "dr",
    }),
  },
  {
    condition: (i) => i.change_management === "none",
    priority: 8,
    detail: () => ({
      title: "변경 관리 부재로 장애 재발 리스크",
      impact_scope: "인프라 변경 전반 및 장애 원인 추적",
      potential_impact: "비인가 변경으로 예기치 않은 장애 발생. 원인 추적 불가로 재발 방지 실패.",
      trigger_condition: "변경 관리 절차 없이 인프라 수정 수행",
      likelihood: "high",
      category: "operations",
    }),
  },
  {
    condition: (i) => i.vm_count >= 200 && (i.automation_level === "none" || i.automation_level === "some"),
    priority: 8,
    detail: (i) => ({
      title: "대규모 운영 자동화 부족 리스크",
      impact_scope: `${i.vm_count}대 VM 운영 효율성`,
      potential_impact: "수동 작업 의존으로 휴먼 에러 증가. 이관/패치 일정 2~3배 지연 가능. 운영 비용 증가.",
      trigger_condition: "200대 이상 VM을 자동화 도구 없이 운영",
      likelihood: "high",
      category: "automation",
    }),
  },
  {
    condition: (i) => i.mfa_enabled === "no",
    priority: 7,
    detail: () => ({
      title: "계정 탈취 기반 침해 리스크",
      impact_scope: "사용자 계정 및 VDI 세션 보안",
      potential_impact: "피싱, 크리덴셜 스터핑으로 계정 탈취 후 내부 시스템 접근. 정보 유출 및 랜섬웨어 감염.",
      trigger_condition: "MFA 미적용 상태에서 외부 공격 발생",
      likelihood: "high",
      category: "security",
    }),
  },
  {
    condition: (i) => i.access_method.includes("direct") && !i.access_method.includes("vpn") && !i.access_method.includes("zero-trust"),
    priority: 7,
    detail: () => ({
      title: "원격 직접접속 노출 리스크",
      impact_scope: "VDI 접속 경로 및 네트워크 보안",
      potential_impact: "VPN/게이트웨이 없이 직접 접속 시 네트워크 공격 표면 확대. 포트 스캐닝, 브루트포스 공격 노출.",
      trigger_condition: "직접 접속 방식 사용 + VPN/제로트러스트 미적용",
      likelihood: "medium",
      category: "security",
    }),
  },
  {
    condition: (i) => i.ops_staff_level === "low",
    priority: 7,
    detail: () => ({
      title: "운영 역량 부족으로 인한 대응 지연 리스크",
      impact_scope: "장애 대응 및 이관 실행 전반",
      potential_impact: "이관 중 예상치 못한 이슈에 즉각 대응 불가. 장애 복구 시간(MTTR) 증가.",
      trigger_condition: "운영 인력 수준 '낮음' 상태에서 복잡 이관 수행",
      likelihood: "high",
      category: "operations",
    }),
  },
  {
    condition: (i) => i.ha_enabled === "no" || i.ha_enabled === "unknown",
    priority: 6,
    detail: () => ({
      title: "HA 미구성으로 호스트 장애 시 서비스 중단",
      impact_scope: "호스트 장애 시 해당 VM 전체",
      potential_impact: "물리 서버 장애 발생 시 해당 서버의 모든 VM 즉시 중단. 수동 복구까지 장시간 소요.",
      trigger_condition: "HA 미구성 호스트에서 하드웨어 장애 발생",
      likelihood: "medium",
      category: "dr",
    }),
  },
  {
    condition: (i) => i.network_separation,
    priority: 6,
    detail: () => ({
      title: "네트워크 분리 환경의 이관 복잡도",
      impact_scope: "네트워크 아키텍처 및 보안 정책",
      potential_impact: "방화벽/라우팅 변경 과정에서 서비스 단절. 보안 정책 불일치로 접속 장애 발생.",
      trigger_condition: "분리된 네트워크 존 간 VM 이동 시 사전 정책 미수립",
      likelihood: "medium",
      category: "migration",
    }),
  },
  {
    condition: (i) => i.documentation_level === "none",
    priority: 6,
    detail: () => ({
      title: "문서화 부재로 지식 단절 리스크",
      impact_scope: "운영 절차 및 인수인계 전반",
      potential_impact: "담당자 부재 시 운영/복구 절차 파악 불가. 이관 시 현행 구성 확인에 과다 시간 소요.",
      trigger_condition: "문서화 없이 인력 교체 또는 이관 착수",
      likelihood: "medium",
      category: "operations",
    }),
  },
  {
    condition: (i) => i.incident_response_maturity === "ad-hoc",
    priority: 5,
    detail: () => ({
      title: "비정형 장애 대응으로 복구 지연 리스크",
      impact_scope: "장애 복구 프로세스 전반",
      potential_impact: "장애 감지 지연, 에스컬레이션 체계 부재로 MTTR 증가. 동일 장애 반복 발생.",
      trigger_condition: "표준 장애 대응 절차 없이 장애 발생",
      likelihood: "medium",
      category: "operations",
    }),
  },
  {
    condition: (i) => i.platform === "mixed",
    priority: 5,
    detail: () => ({
      title: "혼합 플랫폼 호환성 리스크",
      impact_scope: "플랫폼 간 VM 이관 및 통합 관리",
      potential_impact: "플랫폼별 포맷 차이로 변환 실패, 성능 저하, 라이선스 충돌 가능.",
      trigger_condition: "서로 다른 하이퍼바이저 간 직접 마이그레이션 시도",
      likelihood: "medium",
      category: "migration",
    }),
  },
  {
    condition: (i) => i.vm_count >= 500,
    priority: 5,
    detail: (i) => ({
      title: "대규모 VM 환경의 관리 복잡성",
      impact_scope: `${i.vm_count}대 VM 전체 이관/운영`,
      potential_impact: "단계별 배치 전략 없이 일괄 이관 시 일정 지연 및 서비스 장애 가능성 높음.",
      trigger_condition: "VM 500대 이상 환경에서 단계적 계획 없이 진행",
      likelihood: "medium",
      category: "automation",
    }),
  },
];

function generateRiskDetails(input: RiskAssessmentV3Input): RiskDetail[] {
  const matched = RISK_RULES
    .filter((rule) => rule.condition(input))
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => rule.detail(input));

  // Ensure at least 5 by adding generic risks if needed
  const generic: RiskDetail[] = [
    {
      title: "이관 일정 지연 리스크",
      impact_scope: "프로젝트 일정 및 비용",
      potential_impact: "사전 준비 부족 시 이관 일정이 지연되어 추가 비용 발생 및 서비스 영향 확대.",
      trigger_condition: "이관 계획 대비 준비 미흡 시",
      likelihood: "medium",
      category: "migration",
    },
    {
      title: "운영 인수인계 리스크",
      impact_scope: "이관 후 운영 안정성",
      potential_impact: "이관 후 신규 환경에 대한 운영 역량 부족으로 초기 장애 대응 지연.",
      trigger_condition: "이관 완료 후 운영 전환 시점",
      likelihood: "low",
      category: "operations",
    },
    {
      title: "라이선스 및 호환성 검증 리스크",
      impact_scope: "플랫폼 라이선스 및 소프트웨어 호환성",
      potential_impact: "이관 후 라이선스 초과, 드라이버 비호환 등으로 서비스 장애 또는 추가 비용 발생.",
      trigger_condition: "이관 대상 플랫폼의 라이선스/호환성 사전 검증 미수행",
      likelihood: "low",
      category: "migration",
    },
    {
      title: "사용자 영향 최소화 계획 미흡 리스크",
      impact_scope: "최종 사용자 업무 연속성",
      potential_impact: "이관 중 사용자 공지/교육 부재로 혼란 발생. 헬프데스크 부하 급증.",
      trigger_condition: "이관 일정 중 사용자 커뮤니케이션 부재",
      likelihood: "low",
      category: "operations",
    },
    {
      title: "이관 후 성능 저하 리스크",
      impact_scope: "VDI 세션 성능 및 사용자 체감 품질",
      potential_impact: "신규 환경 튜닝 미흡으로 부팅 지연, 앱 응답 저하 등 사용자 불만 발생.",
      trigger_condition: "이관 후 성능 기준선 미수립 상태에서 운영 전환",
      likelihood: "low",
      category: "automation",
    },
  ];

  const result = [...matched];
  let gi = 0;
  while (result.length < 5 && gi < generic.length) {
    result.push(generic[gi++]);
  }

  return result.slice(0, 8);
}

// ── Current State Projection ──

function generateProjection(input: RiskAssessmentV3Input, riskScore: number, drScore: number, opsScore: number): CurrentStateProjection {
  // short_term: migration_rehearsal weak → emphasize
  let short_term_risk: string;
  if (input.migration_rehearsal === "none" && riskScore >= 50) {
    short_term_risk = "향후 1~3개월 내 이관 리허설 없이 본 이관 진행 시, 예상치 못한 호환성/성능 이슈로 서비스 중단이 발생할 가능성이 높습니다. 즉시 파일럿 이관을 수행하세요.";
  } else if (riskScore >= 70) {
    short_term_risk = "향후 1~3개월 내 이관 또는 운영 중 중대 장애 발생 가능성이 높습니다. 즉시 리스크 완화 조치가 필요합니다.";
  } else if (riskScore >= 50) {
    short_term_risk = "향후 1~3개월 내 일부 구간에서 서비스 중단이 발생할 수 있습니다. 사전 점검과 리허설을 권장합니다.";
  } else {
    short_term_risk = "단기적으로 안정적이나, 이관 시 기본적인 리스크 관리 절차가 필요합니다.";
  }

  // mid_term: change/doc weak → emphasize
  let mid_term_risk: string;
  if (opsScore <= 10) {
    mid_term_risk = "6~12개월 내 운영 체계 미비(변경관리/문서화 부재)로 인한 반복 장애, 관리 비용 급증이 예상됩니다. 운영 표준화가 시급합니다.";
  } else if (input.backup_exists === "no" && riskScore >= 50) {
    mid_term_risk = "6~12개월 내 백업 부재로 인한 데이터 유실 사고 발생 확률이 높습니다. DR 체계 미구축 시 비즈니스 연속성에 심각한 위협이 됩니다.";
  } else if (riskScore >= 50) {
    mid_term_risk = "6~12개월 내 운영 복잡도 증가에 따른 관리 비용 상승과 간헐적 서비스 영향이 예상됩니다.";
  } else {
    mid_term_risk = "중기적으로 안정적이나, 인프라 노후화에 대비한 계획 수립이 권장됩니다.";
  }

  // large_scale: DR/backup weak → emphasize
  let large_scale_event_risk: string;
  if (drScore <= 8) {
    large_scale_event_risk = `대규모 재해/침해 발생 시 DR 및 백업 체계 부재로 ${input.vm_count}대 VM에 대한 복구 수단이 없어, 전사 업무 마비가 수 일~수 주 지속될 수 있습니다. 재해 복구 비용만 수억 원 이상 예상됩니다.`;
  } else if (input.vm_count >= 500 && input.backup_exists === "no") {
    large_scale_event_risk = `대규모 장애 발생 시 ${input.vm_count}대 VM에 대한 복구 수단이 없어, 전사 업무 마비가 수 일 이상 지속될 수 있습니다.`;
  } else if (input.vm_count >= 300) {
    large_scale_event_risk = `대규모 장애 시 ${input.vm_count}대 VM 복구에 상당한 시간이 소요되며, 업무 중단에 따른 생산성 손실이 발생합니다.`;
  } else {
    large_scale_event_risk = "대규모 장애 발생 시 복구 시간에 따라 업무 영향이 있을 수 있으나, 규모가 관리 가능한 수준입니다.";
  }

  return { short_term_risk, mid_term_risk, large_scale_event_risk };
}

// ── Roadmap ──

function generateRoadmap(input: RiskAssessmentV3Input, riskScore: number, migScore: number, drScore: number, opsScore: number, autoScore: number): Roadmap {
  const p1: string[] = [];
  const p2: string[] = [];
  const p3: string[] = [];

  // Phase 1 (1~2주): 문서화/체크리스트/롤백/측정
  if (input.backup_exists === "no") p1.push("전체 VM 및 데이터에 대한 긴급 백업 체계 구축");
  if (riskScore >= 50) p1.push("리스크 항목별 우선순위 매트릭스 작성 및 담당자 지정");
  if (input.documentation_level === "none" || input.documentation_level === "partial") p1.push("현재 인프라 구성 문서화 및 이관 대상 VM 목록 확정");
  p1.push("이관 프로젝트 킥오프 및 이해관계자 역할/책임 정의");
  p1.push("이관 대상 VM 목록 확정 및 롤백 시나리오 문서화");
  if (input.ops_staff_level === "low") p1.push("외부 전문가 투입 검토 및 기술 지원 계약 확보");
  if (input.change_management === "none") p1.push("기본 변경 관리 프로세스(승인/기록) 수립");

  // Phase 2 (1개월): 파일럿/리허설/자동화 도입
  if (input.migration_rehearsal === "none") p2.push("파일럿 VM 그룹 선정 및 이관 리허설 실시");
  if (input.storage_migration) p2.push("스토리지 이관 PoC 환경 구축 및 데이터 정합성 검증 테스트");
  if (input.network_separation) p2.push("네트워크 분리 구간의 방화벽/라우팅 변경 계획 수립 및 사전 테스트");
  if (autoScore <= 15) p2.push("이관 자동화 스크립트 개발 및 테스트 환경 검증");
  p2.push("이관 대상 VM별 의존성 매핑 및 서비스 영향도 분석");
  p2.push("이관 전 성능 기준선(Baseline) 측정 및 검증 기준 수립");
  if (input.vm_count >= 200) p2.push("배치 단위 이관 일정 수립 (부서/서비스별 우선순위)");
  if (input.mfa_enabled === "no") p2.push("MFA(다중인증) 도입 계획 수립 및 적용");

  // Phase 3 (3개월): DR 시뮬레이션/운영 표준화/정기점검
  p3.push("단계별 본 이관 실행 (배치 1차 → 2차 → 최종)");
  p3.push("이관 후 성능 모니터링 체계 구축 및 안정화 기간 운영");
  if (drScore <= 15) p3.push("DR 시뮬레이션 실시 및 재해 복구 계획(DRP) 문서화");
  if (opsScore <= 15) p3.push("운영 표준화: SOP 수립, 정기 점검 체계 도입");
  p3.push("운영 팀 교육 및 표준 운영 절차(SOP) 수립");
  if (migScore <= 10) p3.push("이관 완료 후 아키텍처 리뷰 및 최적화 점검");

  return {
    phase_1: { title: "즉시 조치", duration: "1~2주", actions: p1.slice(0, 4) },
    phase_2: { title: "파일럿/기반 구축", duration: "1개월", actions: p2.slice(0, 4) },
    phase_3: { title: "실행 및 안정화", duration: "3개월", actions: p3.slice(0, 4) },
  };
}

// ── Executive Summary ──

function generateExecutiveSummary(
  input: RiskAssessmentV3Input,
  riskScore: number,
  riskLevel: string,
  benchmarkComparison: string,
): string {
  const vmLabel = input.vm_count >= 500 ? "대규모" : input.vm_count >= 200 ? "중규모" : "소규모";
  const levelKo: Record<string, string> = { low: "낮음", medium: "보통", high: "높음", critical: "매우 높음" };
  const hostInfo = input.host_count ? `, 호스트 ${input.host_count}대` : "";

  return `${input.platform.toUpperCase()} 기반 ${vmLabel}(VM ${input.vm_count}대${hostInfo}) VDI 환경에 대한 25개 항목 심층 진단 결과, 종합 리스크 점수는 ${riskScore}점(${levelKo[riskLevel]})으로 평가되었습니다. ${benchmarkComparison} 6개 영역(규모, 아키텍처, 가용성, 운영, 자동화, 보안)에 대한 분석을 기반으로 단계별 개선 로드맵을 수립하였으며, 즉시 조치 항목부터 순차적으로 이행할 것을 권장합니다.`;
}

// ── Next Steps ──

function generateNextSteps(riskLevel: string, input: RiskAssessmentV3Input): string[] {
  const steps: string[] = [];

  if (riskLevel === "critical" || riskLevel === "high") {
    steps.push("전문 컨설턴트와 함께 상세 리스크 평가를 진행하세요");
    steps.push("이관 전 PoC(Proof of Concept) 환경 구축을 권장합니다");
  }
  if (input.backup_exists === "no") steps.push("이관 전 전체 백업 체계를 우선 구축하세요");
  if (input.storage_migration) steps.push("스토리지 이관 전 데이터 정합성 검증 절차를 수립하세요");
  if (input.migration_rehearsal === "none") steps.push("본 이관 전 최소 1회 이상 파일럿 리허설을 수행하세요");
  if (input.mfa_enabled === "no") steps.push("MFA(다중인증)를 도입하여 계정 보안을 강화하세요");
  if (riskLevel === "medium" || riskLevel === "low") {
    steps.push("표준 이관 체크리스트를 기반으로 계획을 수립하세요");
  }
  steps.push("이관 일정과 롤백 시나리오를 문서화하세요");

  return steps.slice(0, 6);
}

// ── Main Entry ──

export function runRiskAssessmentV3(input: RiskAssessmentV3Input): RiskAssessmentV3Output {
  const migrationScore = calcMigration(input);
  const drScore = calcDR(input);
  const opsScore = calcOperations(input);
  const autoScore = calcAutomation(input);

  const totalReadiness = migrationScore + drScore + opsScore + autoScore;
  const riskScore = 100 - totalReadiness;

  let risk_level: RiskAssessmentV3Output["risk_level"];
  if (riskScore >= 76) risk_level = "critical";
  else if (riskScore >= 51) risk_level = "high";
  else if (riskScore >= 26) risk_level = "medium";
  else risk_level = "low";

  const maturity_model: MaturityModel = {
    migration: { score: migrationScore, level: scoreToLevel(migrationScore) },
    dr: { score: drScore, level: scoreToLevel(drScore) },
    operations: { score: opsScore, level: scoreToLevel(opsScore) },
    automation: { score: autoScore, level: scoreToLevel(autoScore) },
  };

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

  const risks = generateRiskDetails(input);
  const risk_messages = risks.map((r) => r.title + ": " + r.potential_impact);
  const current_state_projection = generateProjection(input, riskScore, drScore, opsScore);
  const roadmap = generateRoadmap(input, riskScore, migrationScore, drScore, opsScore, autoScore);
  const executive_summary = generateExecutiveSummary(input, riskScore, risk_level, benchmark_comparison);
  const next_steps = generateNextSteps(risk_level, input);

  return {
    version: "v3",
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
