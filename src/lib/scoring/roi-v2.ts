// ROI Downtime Calculator v2 - Decision Grade
// 서버 전용: 클라이언트에 공식/룰 노출 금지

export interface ROIV2Input {
  total_users: number;
  avg_hourly_cost: number;
  avg_downtime_hours: number;
  incidents_per_year: number;
  current_backup: boolean;
  recovery_time_improvement_percent: number;
  impact_rate_percent: number;
  major_incident_hours: number;
}

export interface ROIV2Output {
  version: "v2";
  // 핵심 수치
  annual_downtime: number;
  annual_loss: number;
  improved_downtime: number;
  improved_annual_loss: number;
  annual_saving: number;
  // 3년 누적
  loss_3y: number;
  saving_3y: number;
  // 대형 장애
  major_incident_loss: number;
  // 투자비 범위
  investment_low: number;
  investment_high: number;
  // 회수기간 범위
  payback_low_years: number | null;
  payback_high_years: number | null;
  // 등급/벤치마크
  grade: "critical" | "high" | "medium" | "low";
  benchmark_text: string;
  benchmark_comparison: string;
  // 경고 문구
  warnings: string[];
  // 다음 단계
  next_steps: string[];
  // 위험 요약
  risk_summary: string[];
  // 개선 효과
  improvement_effects: string[];
  // 가정값
  assumptions: {
    impact_rate_percent: number;
    recovery_time_improvement_percent: number;
    major_incident_hours: number;
    investment_model: string;
    base_cost_low: number;
    base_cost_high: number;
    per_user_low: number;
    per_user_high: number;
  };
  // 포맷된 값
  formatted: {
    annual_loss: string;
    annual_saving: string;
    improved_annual_loss: string;
    loss_3y: string;
    saving_3y: string;
    major_incident_loss: string;
    investment_low: string;
    investment_high: string;
    investment_range: string;
    payback_range: string;
  };
}

function formatKRW(amount: number): string {
  if (amount >= 100_000_000) {
    const billions = Math.round(amount / 100_000_000 * 10) / 10;
    return `${billions}억원`;
  }
  if (amount >= 10_000_000) {
    const millions = Math.round(amount / 10_000_000 * 10) / 10;
    return `${millions}천만원`;
  }
  return new Intl.NumberFormat("ko-KR").format(Math.round(amount)) + "원";
}

function formatKRWFull(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(amount)) + "원";
}

// 투자비 가정값
function getInvestmentParams(currentBackup: boolean) {
  if (currentBackup) {
    return {
      base_cost_low: 20_000_000,
      base_cost_high: 40_000_000,
      per_user_low: 150_000,
      per_user_high: 300_000,
    };
  }
  return {
    base_cost_low: 30_000_000,
    base_cost_high: 60_000_000,
    per_user_low: 200_000,
    per_user_high: 400_000,
  };
}

// 벤치마크 기준
function getBenchmark(totalUsers: number, annualLoss: number): { text: string; comparison: string } {
  let segmentLabel: string;
  let avgLoss: number;

  if (totalUsers >= 500) {
    segmentLabel = "대규모(500+ 사용자)";
    avgLoss = 400_000_000;
  } else if (totalUsers >= 200) {
    segmentLabel = "동일 규모(200~500 사용자)";
    avgLoss = 150_000_000;
  } else {
    segmentLabel = "동일 규모(50~200 사용자)";
    avgLoss = 50_000_000;
  }

  let comparison: string;
  if (annualLoss >= avgLoss * 1.3) {
    comparison = "평균 대비 높음";
  } else if (annualLoss <= avgLoss * 0.7) {
    comparison = "평균 대비 낮음";
  } else {
    comparison = "평균 수준";
  }

  return {
    text: `${segmentLabel} 기준 내부 벤치마크 대비`,
    comparison,
  };
}

export function calculateROIV2(input: ROIV2Input): ROIV2Output {
  const impactRate = input.impact_rate_percent / 100;

  // 1) 연간 총 다운타임
  const annual_downtime = input.avg_downtime_hours * input.incidents_per_year;

  // 2) 연간 손실 (impact_rate 반영)
  const annual_loss = input.total_users * input.avg_hourly_cost * annual_downtime * impactRate;

  // 3) 개선 후 다운타임
  const improved_downtime = annual_downtime * (1 - input.recovery_time_improvement_percent / 100);

  // 4) 개선 후 손실
  const improved_annual_loss = input.total_users * input.avg_hourly_cost * improved_downtime * impactRate;

  // 5) 연간 절감액
  const annual_saving = Math.max(0, annual_loss - improved_annual_loss);

  // 6) 3년 누적
  const loss_3y = annual_loss * 3;
  const saving_3y = annual_saving * 3;

  // 7) 대형 장애 1회 손실
  const major_incident_loss = input.total_users * input.avg_hourly_cost * input.major_incident_hours * impactRate;

  // 8) 투자비 범위
  const investParams = getInvestmentParams(input.current_backup);
  const investment_low = investParams.base_cost_low + (input.total_users * investParams.per_user_low);
  const investment_high = investParams.base_cost_high + (input.total_users * investParams.per_user_high);

  // 9) 회수기간 범위
  const payback_low_years = annual_saving > 0
    ? Math.round((investment_low / annual_saving) * 10) / 10
    : null;
  const payback_high_years = annual_saving > 0
    ? Math.round((investment_high / annual_saving) * 10) / 10
    : null;

  // 10) 등급
  let grade: ROIV2Output["grade"];
  if (annual_loss >= 500_000_000) grade = "critical";
  else if (annual_loss >= 100_000_000) grade = "high";
  else if (annual_loss >= 30_000_000) grade = "medium";
  else grade = "low";

  // 11) 벤치마크
  const benchmark = getBenchmark(input.total_users, annual_loss);

  // 12) 경고 문구
  const warnings = [
    `현 구조 유지 시 3년 누적 손실 추정: ${formatKRW(loss_3y)}`,
    `대형 장애 1회 발생 시 추정 손실: ${formatKRW(major_incident_loss)}`,
    "본 수치는 업무 특성에 따라 변동 가능(추정치)",
  ];

  // 13) 위험 요약
  const risk_summary = generateRiskSummary(input, annual_loss, annual_downtime, impactRate);

  // 14) 개선 효과
  const improvement_effects = generateImprovementEffects(input, annual_saving, improved_downtime, saving_3y);

  // 15) 다음 단계
  const next_steps = [
    "현재 환경의 실제 복구 시간(RTO)을 측정하세요",
    "백업/DR 구조의 적정성을 점검하세요",
    "마이그레이션 또는 인프라 구조 개선 컨설팅을 검토하세요",
  ];

  // 16) 포맷
  const paybackRange = payback_low_years !== null && payback_high_years !== null
    ? `${payback_low_years}~${payback_high_years}년`
    : "산정 불가 (절감액 0)";

  return {
    version: "v2",
    annual_downtime,
    annual_loss,
    improved_downtime,
    improved_annual_loss,
    annual_saving,
    loss_3y,
    saving_3y,
    major_incident_loss,
    investment_low,
    investment_high,
    payback_low_years,
    payback_high_years,
    grade,
    benchmark_text: benchmark.text,
    benchmark_comparison: benchmark.comparison,
    warnings,
    next_steps,
    risk_summary,
    improvement_effects,
    assumptions: {
      impact_rate_percent: input.impact_rate_percent,
      recovery_time_improvement_percent: input.recovery_time_improvement_percent,
      major_incident_hours: input.major_incident_hours,
      investment_model: input.current_backup
        ? "백업/DR 보유: 경량 개선 모델"
        : "백업/DR 미보유: 전면 구축 모델",
      ...investParams,
    },
    formatted: {
      annual_loss: formatKRW(annual_loss),
      annual_saving: formatKRW(annual_saving),
      improved_annual_loss: formatKRW(improved_annual_loss),
      loss_3y: formatKRW(loss_3y),
      saving_3y: formatKRW(saving_3y),
      major_incident_loss: formatKRW(major_incident_loss),
      investment_low: formatKRW(investment_low),
      investment_high: formatKRW(investment_high),
      investment_range: `${formatKRW(investment_low)} ~ ${formatKRW(investment_high)}`,
      payback_range: paybackRange,
    },
  };
}

function generateRiskSummary(
  input: ROIV2Input,
  annualLoss: number,
  annualDowntime: number,
  impactRate: number
): string[] {
  const lines: string[] = [];

  lines.push(
    `연간 ${annualDowntime.toFixed(1)}시간의 다운타임 × 영향률 ${(impactRate * 100).toFixed(0)}% 적용 시, 생산성 손실이 ${formatKRW(annualLoss)}에 달합니다.`
  );

  if (!input.current_backup) {
    lines.push(
      "백업/DR 체계가 없어 장애 발생 시 복구 시간이 길어지고, 데이터 유실 위험이 높습니다."
    );
  } else {
    lines.push(
      "백업 체계는 갖추고 있으나, 복구 시간 단축을 위한 자동화 및 정기 테스트가 필요합니다."
    );
  }

  if (input.incidents_per_year >= 12) {
    lines.push(
      "월 1회 이상 장애가 발생하고 있어 근본 원인 분석(RCA)과 재발 방지 대책이 시급합니다."
    );
  } else if (input.incidents_per_year >= 4) {
    lines.push(
      "분기별 1회 이상 장애가 발생하고 있으며, 모니터링 강화와 예방 보전이 필요합니다."
    );
  } else {
    lines.push(
      "장애 빈도는 낮은 편이나, 단일 장애의 영향 범위를 줄이는 구조 개선을 검토하세요."
    );
  }

  return lines;
}

function generateImprovementEffects(
  input: ROIV2Input,
  annualSaving: number,
  improvedDowntime: number,
  saving3y: number
): string[] {
  const lines: string[] = [];

  lines.push(
    `복구 시간을 ${input.recovery_time_improvement_percent}% 단축하면 연간 다운타임이 ${improvedDowntime.toFixed(1)}시간으로 줄어듭니다.`
  );

  lines.push(
    `이를 통해 연간 약 ${formatKRW(annualSaving)}, 3년간 약 ${formatKRW(saving3y)}의 비용을 절감할 수 있습니다.`
  );

  if (!input.current_backup) {
    lines.push(
      "백업/DR 체계 구축 시 추가적인 복구 시간 단축과 데이터 보호 효과를 기대할 수 있습니다."
    );
  } else {
    lines.push(
      "기존 백업 체계의 자동화와 정기 복구 테스트를 통해 실제 RTO를 더욱 단축할 수 있습니다."
    );
  }

  return lines;
}

// 추천 recovery_time_improvement_percent 값
export function getRecommendedRecoveryPercent(currentBackup: boolean): number {
  return currentBackup ? 30 : 60;
}
