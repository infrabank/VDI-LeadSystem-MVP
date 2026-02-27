export interface RiskAssessmentInput {
  platform: "citrix" | "vmware" | "xenserver" | "mixed";
  vm_count: number;
  network_separation: boolean;
  storage_migration: boolean;
  backup_exists: boolean;
  downtime_tolerance: "none" | "short" | "night";
  ops_staff_level?: "low" | "mid" | "high";
}

interface RiskRule {
  condition: (input: RiskAssessmentInput) => boolean;
  score: number;
  message: string;
}

const RISK_RULES: RiskRule[] = [
  {
    condition: (i) => i.vm_count >= 500,
    score: 15,
    message:
      "VM 수가 500대 이상으로 이관 계획 수립 시 단계별 배치 전략과 병렬 처리가 필수",
  },
  {
    condition: (i) => i.storage_migration,
    score: 20,
    message:
      "스토리지 이관은 병목/검증/롤백 설계 없으면 일정/품질 리스크 급증",
  },
  {
    condition: (i) => i.downtime_tolerance === "none",
    score: 20,
    message:
      "다운타임 허용이 없어 사전 리허설 및 단계적 컷오버 설계가 필수",
  },
  {
    condition: (i) => !i.backup_exists,
    score: 15,
    message:
      "백업 체계 부재 시 이관 중 데이터 유실 리스크가 매우 높음",
  },
  {
    condition: (i) => i.network_separation,
    score: 10,
    message:
      "네트워크 분리 환경에서의 이관은 방화벽/라우팅 변경 계획이 추가로 필요",
  },
  {
    condition: (i) => i.ops_staff_level === "low",
    score: 10,
    message:
      "운영 인력 수준이 낮아 외부 전문가 투입 또는 충분한 교육 기간 확보 필요",
  },
  {
    condition: (i) => i.platform === "mixed",
    score: 10,
    message:
      "혼합 플랫폼 환경은 플랫폼별 호환성 검증과 개별 이관 전략 수립이 필요",
  },
  {
    condition: (i) => i.downtime_tolerance === "short",
    score: 10,
    message:
      "짧은 다운타임 허용 시 사전 테스트와 롤백 시나리오 준비가 중요",
  },
  {
    condition: (i) => i.vm_count >= 200 && i.vm_count < 500,
    score: 8,
    message:
      "VM 200~500대 규모는 자동화 도구 도입과 일괄 이관 스크립트 검증이 권장됨",
  },
  {
    condition: (i) => i.platform === "xenserver",
    score: 5,
    message:
      "XenServer 환경은 Citrix 라이선스 변경 이력 확인 및 대안 플랫폼 검토 권장",
  },
];

export interface RiskAssessmentOutput {
  score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  risks: string[];
  next_steps: string[];
}

export function runRiskAssessment(
  input: RiskAssessmentInput
): RiskAssessmentOutput {
  const matched = RISK_RULES.filter((rule) => rule.condition(input));

  // Calculate total score (clamp 0~100)
  const rawScore = matched.reduce((sum, rule) => sum + rule.score, 0);
  const score = Math.min(100, Math.max(0, rawScore));

  // Risk level
  let risk_level: RiskAssessmentOutput["risk_level"];
  if (score >= 70) risk_level = "critical";
  else if (score >= 50) risk_level = "high";
  else if (score >= 30) risk_level = "medium";
  else risk_level = "low";

  // Top 5 risks sorted by score desc
  const risks = matched
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.message);

  // Next steps based on risk level
  const next_steps = generateNextSteps(risk_level, input);

  return { score, risk_level, risks, next_steps };
}

function generateNextSteps(
  risk_level: RiskAssessmentOutput["risk_level"],
  input: RiskAssessmentInput
): string[] {
  const steps: string[] = [];

  if (risk_level === "critical" || risk_level === "high") {
    steps.push("전문 컨설턴트와 함께 상세 리스크 평가를 진행하세요");
    steps.push("이관 전 PoC(Proof of Concept) 환경 구축을 권장합니다");
  }

  if (input.storage_migration) {
    steps.push("스토리지 이관 전 데이터 정합성 검증 절차를 수립하세요");
  }

  if (!input.backup_exists) {
    steps.push("이관 전 전체 백업 체계를 우선 구축하세요");
  }

  if (input.downtime_tolerance === "none") {
    steps.push("무중단 이관을 위한 단계적 컷오버 계획을 수립하세요");
  }

  if (risk_level === "medium" || risk_level === "low") {
    steps.push("표준 이관 체크리스트를 기반으로 계획을 수립하세요");
  }

  steps.push("이관 일정과 롤백 시나리오를 문서화하세요");

  return steps.slice(0, 5);
}
