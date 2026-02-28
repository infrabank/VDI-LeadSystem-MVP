import type {
  ReviewRequest,
  ReviewScore,
  WinImpact,
  ScoreDomain,
} from "@/lib/types/sap";
import { DOMAIN_LABELS } from "@/lib/types/sap";

// ---------- 도메인 기본 가중치 ----------

const BASE_WEIGHTS: Record<ScoreDomain, number> = {
  compute: 15,
  storage: 20,
  network: 15,
  ha_dr: 20,
  backup: 20,
  license: 10,
};

// ---------- 가중치 조정 및 정규화 ----------

function buildAdjustedWeights(request: ReviewRequest): Record<ScoreDomain, number> {
  const w = { ...BASE_WEIGHTS };

  // compliance_level=high: backup+5, network+5, compute-5, license-5
  if (request.compliance_level === "high") {
    w.backup += 5;
    w.network += 5;
    w.compute -= 5;
    w.license -= 5;
  }

  // dr_required=true: ha_dr+5
  if (request.dr_required) {
    w.ha_dr += 5;
  }

  // network_type=cloud or multi_cloud: network+5
  if (request.network_type === "cloud" || request.network_type === "multi_cloud") {
    w.network += 5;
  }

  // 정규화: 합계가 100이 되도록 스케일
  const total = (Object.values(w) as number[]).reduce((a, b) => a + b, 0);
  const domains: ScoreDomain[] = ["compute", "storage", "network", "ha_dr", "backup", "license"];
  const normalized = { ...w };
  for (const d of domains) {
    normalized[d] = (w[d] / total) * 100;
  }

  return normalized;
}

// ---------- 점수 맵 헬퍼 ----------

function buildScoreMap(scores: ReviewScore[]): Map<ScoreDomain, ReviewScore> {
  const map = new Map<ScoreDomain, ReviewScore>();
  for (const sc of scores) {
    map.set(sc.domain as ScoreDomain, sc);
  }
  return map;
}

function getDomainScore(map: Map<ScoreDomain, ReviewScore>, domain: ScoreDomain): number {
  return map.get(domain)?.score ?? 50;
}

// ---------- 등급 매핑 ----------

function scoreToGrade(score: number): WinImpact["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

// ---------- drivers 생성 ----------

function buildDrivers(
  request: ReviewRequest,
  scoreMap: Map<ScoreDomain, ReviewScore>
): string[] {
  const drivers: string[] = [];
  const domains: ScoreDomain[] = ["compute", "storage", "network", "ha_dr", "backup", "license"];

  // 취약 도메인 (65점 미만) — 평가위원 관점 설명
  const weakDomains = domains
    .map((d) => ({ domain: d, score: getDomainScore(scoreMap, d) }))
    .filter((x) => x.score < 65)
    .sort((a, b) => a.score - b.score);

  for (const { domain, score } of weakDomains) {
    const label = DOMAIN_LABELS[domain];
    if (domain === "ha_dr") {
      drivers.push(
        `${label} 영역(${score}점)은 고가용성·장애복구 설계 완성도가 낮아 평가위원의 집중 질의 대상이 될 수 있습니다. 페일오버 시나리오와 RTO/RPO 목표값 부재 시 평가 영향도가 큽니다.`
      );
    } else if (domain === "backup") {
      drivers.push(
        `${label} 영역(${score}점)은 데이터 보호 전략의 구체성이 부족하여 평가위원이 운영 안정성을 의심할 수 있습니다. 백업 주기·검증 절차·복구 시간 목표 명시가 필요합니다.`
      );
    } else if (domain === "network") {
      drivers.push(
        `${label} 영역(${score}점)은 대역폭·QoS·이중화 설계가 불충분하여 대규모 사용자 환경에서의 방어 수준이 낮습니다. 평가위원은 피크 트래픽 및 WAN 최적화 계획을 중점 확인합니다.`
      );
    } else if (domain === "storage") {
      drivers.push(
        `${label} 영역(${score}점)은 I/O 성능·용량 산정 근거가 미흡하여 제안 신뢰성에 영향을 줄 수 있습니다. 스토리지 티어링 및 증설 계획의 구체화가 방어 수준 향상에 직결됩니다.`
      );
    } else if (domain === "compute") {
      drivers.push(
        `${label} 영역(${score}점)은 사이징 근거와 리소스 예비율 설계가 불명확하여 평가위원의 기술 신뢰성 검증 시 취약점으로 지적될 수 있습니다.`
      );
    } else if (domain === "license") {
      drivers.push(
        `${label} 영역(${score}점)은 총 소유 비용(TCO) 및 라이선스 구조의 투명성이 부족하여 가격 평가 영향도뿐 아니라 기술 평가에서도 감점 요인이 될 수 있습니다.`
      );
    }
    if (drivers.length >= 6) break;
  }

  // DR 요구사항 gap
  if (request.dr_required && getDomainScore(scoreMap, "ha_dr") < 70) {
    const existing = drivers.some((d) => d.includes("HA/DR"));
    if (!existing) {
      drivers.push(
        `DR 요구사항이 명시되어 있으나 HA/DR 점수(${getDomainScore(scoreMap, "ha_dr")}점)가 기준치(70점)에 미달합니다. RTO/RPO 미정의 또는 DR 사이트 아키텍처 부재는 평가위원이 제안 탈락 근거로 삼을 수 있습니다.`
      );
    }
  }

  // backup_required이지만 immutable/WORM 미언급 확인
  if (request.backup_required) {
    const backupSc = scoreMap.get("backup");
    const allRecs = backupSc?.recommendations ?? [];
    const hasImmutable = allRecs.some(
      (r) =>
        /immutable|worm|불변|변경불가/i.test(r)
    );
    if (!hasImmutable && drivers.length < 6) {
      drivers.push(
        `백업 요구사항이 포함된 제안임에도 불변 스토리지(Immutable/WORM) 관련 언급이 권고사항에 없습니다. 랜섬웨어 대응 관점에서 평가위원이 이를 지적할 영향도가 높습니다.`
      );
    }
  }

  // 최소 3개, 최대 6개 보장
  if (drivers.length < 3) {
    const avg = [...scoreMap.values()].reduce((s, sc) => s + sc.score, 0) / (scoreMap.size || 1);
    if (avg < 80 && drivers.length < 3) {
      drivers.push(
        `종합 기술 점수(평균 ${Math.round(avg)}점)가 경쟁사 대비 열위 가능성을 시사합니다. 각 도메인 보완 조치 이행 여부가 최종 수주 영향도를 결정합니다.`
      );
    }
  }

  return drivers.slice(0, 6);
}

// ---------- mitigation 생성 ----------

function buildMitigation(
  request: ReviewRequest,
  scoreMap: Map<ScoreDomain, ReviewScore>,
  drivers: string[]
): string[] {
  const mitigations: string[] = [];

  // driver 기반 대응 조치 생성
  for (const driver of drivers) {
    if (driver.includes("HA/DR") || driver.includes("RTO") || driver.includes("DR 요구")) {
      mitigations.push(
        "HA/DR 설계 문서에 RTO/RPO 목표값(숫자)을 명시하고, 페일오버 절차 및 DR 사이트 구성도를 제안서에 추가하십시오."
      );
    } else if (driver.includes("백업") || driver.includes("Immutable") || driver.includes("WORM")) {
      mitigations.push(
        "백업 정책 섹션에 불변 스토리지(Immutable/WORM) 적용 방안과 복구 테스트 계획(연 1회 이상)을 문구 보강하십시오."
      );
    } else if (driver.includes("네트워크") || driver.includes("QoS") || driver.includes("대역폭")) {
      mitigations.push(
        "네트워크 섹션에 피크 시간대 대역폭 산정 근거와 QoS 정책 설계 수정을 반영하고, WAN 최적화 도구 스펙을 추가하십시오."
      );
    } else if (driver.includes("스토리지") || driver.includes("I/O")) {
      mitigations.push(
        "스토리지 용량 산정 근거 표(사용자 수 × 프로파일 크기)와 IOP 요구사항 매핑 테이블을 제안서에 설계 수정하여 첨부하십시오."
      );
    } else if (driver.includes("컴퓨트") || driver.includes("사이징")) {
      mitigations.push(
        "컴퓨트 리소스 산정 근거(사용자당 vCPU/RAM)와 20% 예비율 적용 기준을 설계 수정하여 명시하십시오."
      );
    } else if (driver.includes("라이선스") || driver.includes("TCO")) {
      mitigations.push(
        "라이선스 비용 구조 표(항목별 단가·수량·총액)를 작성하고, 3년 TCO 비교 시나리오를 제안서 문구 보강으로 추가하십시오."
      );
    } else {
      mitigations.push(
        "해당 도메인의 취약점에 대한 전담 기술 전문가 검토와 제안서 해당 섹션 재작성을 즉시 착수하십시오."
      );
    }
    if (mitigations.length >= 6) break;
  }

  // DR 전용 추가 조치
  if (request.dr_required && mitigations.length < 6) {
    const hasDR = mitigations.some((m) => m.includes("RTO") || m.includes("DR"));
    if (!hasDR) {
      mitigations.push(
        "DR 시나리오 테스트 계획(반기 1회 이상 훈련 일정)을 제안서에 테스트 계획 추가로 보강하십시오."
      );
    }
  }

  // compliance_level=high 추가 조치
  if (request.compliance_level === "high" && mitigations.length < 6) {
    mitigations.push(
      "컴플라이언스 강도(High) 환경에 맞게 보안 감사 로그·접근통제 정책 문서를 설계 수정하여 제안서 보안 섹션에 추가하십시오."
    );
  }

  // 최소 3개 보장
  if (mitigations.length < 3) {
    mitigations.push(
      "전 도메인 권고사항을 기반으로 제안서 기술 섹션 전반의 문구 보강 및 근거 자료 추가를 권장합니다."
    );
  }

  return mitigations.slice(0, 6);
}

// ---------- assumptions 생성 ----------

function buildAssumptions(
  request: ReviewRequest,
  weights: Record<ScoreDomain, number>
): string[] {
  const assumptions: string[] = [];

  assumptions.push(
    `기술평가 비중: ${request.eval_weight_tech}%, 가격평가 비중: ${request.eval_weight_price}%`
  );
  assumptions.push(
    `보안/감사 강도: ${request.compliance_level}`
  );
  assumptions.push(
    `네트워크 유형: ${request.network_type}`
  );

  if (request.dr_required) {
    assumptions.push("DR 요구사항 포함");
  }

  // 도메인 가중치 조정 적용 여부
  const adjustments: string[] = [];
  if (request.compliance_level === "high") {
    adjustments.push("컴플라이언스 High → 백업·네트워크 가중치 상향");
  }
  if (request.dr_required) {
    adjustments.push("DR 필수 → HA/DR 가중치 상향");
  }
  if (request.network_type === "cloud" || request.network_type === "multi_cloud") {
    adjustments.push("클라우드/멀티클라우드 → 네트워크 가중치 상향");
  }

  if (adjustments.length > 0) {
    assumptions.push(`도메인 가중치 조정 적용: ${adjustments.join("; ")}`);
  }

  // 가중치 현황 (정수 반올림 표시)
  const weightSummary = (["compute", "storage", "network", "ha_dr", "backup", "license"] as ScoreDomain[])
    .map((d) => `${DOMAIN_LABELS[d]} ${Math.round(weights[d])}`)
    .join(", ");
  assumptions.push(`실효 도메인 가중치(합계≈100): ${weightSummary}`);

  return assumptions.slice(0, 5);
}

// ---------- 메인 함수 ----------

export function computeWinImpact(
  request: ReviewRequest,
  scores: ReviewScore[]
): WinImpact {
  const scoreMap = buildScoreMap(scores);
  const weights = buildAdjustedWeights(request);
  const domains: ScoreDomain[] = ["compute", "storage", "network", "ha_dr", "backup", "license"];

  // 1) baseScore 계산
  let baseScore = 0;
  for (const d of domains) {
    const domainScore = getDomainScore(scoreMap, d);
    baseScore += (domainScore * weights[d]) / 100;
  }

  // 2) 리스크 패널티
  let penaltyLow = 0;    // domainScore < 65: -5/domain, cap -20
  let penaltyCrit = 0;   // domainScore < 50: additional -10/domain, cap -20
  let penaltyExtra = 0;  // dr/compliance 특수 패널티, cap combined

  for (const d of domains) {
    const s = getDomainScore(scoreMap, d);
    if (s < 65) {
      penaltyLow = Math.min(penaltyLow + 5, 20);
    }
    if (s < 50) {
      penaltyCrit = Math.min(penaltyCrit + 10, 20);
    }
  }

  if (request.dr_required && getDomainScore(scoreMap, "ha_dr") < 60) {
    penaltyExtra += 10;
  }
  if (request.compliance_level === "high" && getDomainScore(scoreMap, "backup") < 60) {
    penaltyExtra += 10;
  }

  const totalPenalty = penaltyLow + penaltyCrit + penaltyExtra;

  // 3) 레버리지 보너스
  let bonus = 0;

  // top 3 risk items에 대응하는 recommendations 존재 여부 확인
  const weakSorted = [...scores].sort((a, b) => a.score - b.score);
  const top3Risks: string[] = [];
  for (const sc of weakSorted.slice(0, 3)) {
    for (const r of (sc.risks ?? []).slice(0, 1)) {
      top3Risks.push(r);
    }
  }
  const allRecs: string[] = scores.flatMap((sc) => sc.recommendations ?? []);
  // 대응: risk 항목 중 recommendations에 키워드 매칭되는 것이 있으면 즉시 개선 가능
  let matchCount = 0;
  for (const risk of top3Risks) {
    const riskWords = risk
      .split(/[\s,·()[\]]+/)
      .filter((w) => w.length >= 2)
      .slice(0, 3);
    const hasMatch = allRecs.some((rec) =>
      riskWords.some((word) => rec.includes(word))
    );
    if (hasMatch) matchCount++;
  }
  if (matchCount === top3Risks.length && top3Risks.length > 0) {
    bonus += 5; // 즉시 개선 가능
  }

  // license score >= 85
  if (getDomainScore(scoreMap, "license") >= 85) {
    bonus += 3;
  }

  // 4) 최종 점수
  const rawScore = baseScore + bonus - totalPenalty;
  const finalScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // 5) 등급
  const grade = scoreToGrade(finalScore);

  // 6) drivers
  const drivers = buildDrivers(request, scoreMap);

  // 7) mitigation
  const mitigation = buildMitigation(request, scoreMap, drivers);

  // 8) assumptions
  const assumptions = buildAssumptions(request, weights);

  // 9) estimated_improvement
  // 실행 가능한 mitigation 항목 수 기반
  const actionableCount = mitigation.filter((m) =>
    /설계 수정|문구 보강|테스트 계획|재작성|추가|명시|반영/.test(m)
  ).length;
  const estimatedImprovement = Math.min(15, actionableCount * 3);

  return {
    score: finalScore,
    grade,
    drivers,
    mitigation,
    assumptions,
    estimated_improvement: estimatedImprovement,
  };
}
