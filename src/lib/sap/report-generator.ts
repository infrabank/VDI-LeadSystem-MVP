import type {
  ReviewRequest,
  ReviewScore,
  ReportContent,
  ReportSection,
  ScoreDomain,
} from "@/lib/types/sap";
import { DOMAIN_LABELS, VENDOR_LABELS } from "@/lib/types/sap";
import { selectTemplates, type TemplateContext } from "@/lib/sap/templates";

// ---------- 위험도 계산 ----------

function computeRiskLevel(
  scores: ReviewScore[]
): "low" | "medium" | "high" | "critical" {
  if (scores.length === 0) return "high";
  const avg = scores.reduce((s, sc) => s + sc.score, 0) / scores.length;
  if (avg >= 80) return "low";
  if (avg >= 60) return "medium";
  if (avg >= 40) return "high";
  return "critical";
}

// ---------- 유틸: 하위 도메인 아이템 추출 ----------

export function extractTopItems(
  scores: ReviewScore[],
  field: "risks" | "recommendations",
  count: number
): string[] {
  const all: Array<{ item: string; score: number }> = [];
  for (const sc of scores) {
    const items = (sc[field] as string[]) ?? [];
    for (const item of items) {
      all.push({ item, score: sc.score });
    }
  }
  // 낮은 점수 도메인의 항목을 우선 노출
  all.sort((a, b) => a.score - b.score);
  return all.slice(0, count).map((x) => x.item);
}

// ---------- 위험도 한국어 변환 ----------

function riskLevelKr(level: string): string {
  switch (level) {
    case "low":
      return "낮음";
    case "medium":
      return "보통";
    case "high":
      return "높음";
    case "critical":
      return "심각";
    default:
      return level;
  }
}

// ---------- Executive Summary (상세 버전) ----------

function generateExecutiveSummary(
  request: ReviewRequest,
  scores: ReviewScore[],
  riskLevel: "low" | "medium" | "high" | "critical"
): string {
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length)
      : 0;

  const vendorName = VENDOR_LABELS[request.vendor_track] ?? request.vendor_track;
  const riskKr = riskLevelKr(riskLevel);
  const projectOrCustomer = request.customer_name ?? request.project_name;

  // 취약 도메인 식별 (65점 미만)
  const weakDomains = scores
    .filter((sc) => sc.score < 65)
    .sort((a, b) => a.score - b.score)
    .map((sc) => `${DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain}(${sc.score}점)`);

  // 치명적 도메인 (50점 미만)
  const criticalDomains = scores
    .filter((sc) => sc.score < 50)
    .sort((a, b) => a.score - b.score)
    .map((sc) => `${DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain}(${sc.score}점)`);

  const lines: string[] = [
    `본 리포트는 ${projectOrCustomer} 프로젝트의 VDI 구축 제안에 대한 VDI 전문가 그룹의 기술 검증(Sales Assurance Program) 결과물입니다.`,
    ``,
    `▶ 벤더 트랙: ${vendorName}`,
    `▶ 사용자 수: ${request.user_count.toLocaleString("ko-KR")}명 | 사이트 수: ${request.site_count}개`,
    `▶ 종합 기술 적합성 점수: ${avgScore}/100`,
    `▶ 위험도 등급: ${riskKr.toUpperCase()} (${riskKr})`,
    ``,
    `총 ${scores.length}개 도메인(컴퓨트·스토리지·네트워크·HA/DR·백업·라이선스)에 대한 심층 평가를 완료하였습니다.`,
  ];

  if (criticalDomains.length > 0) {
    lines.push(``);
    lines.push(
      `⚠️ 치명적 위험 도메인(50점 미만): ${criticalDomains.join(", ")} — 즉각적인 기술 보완 및 제안서 수정이 필요합니다. 해당 도메인은 수주 경쟁에서 직접적인 탈락 요인이 될 수 있습니다.`
    );
  }

  if (weakDomains.length > 0 && weakDomains.length !== criticalDomains.length) {
    const nonCriticalWeak = scores
      .filter((sc) => sc.score >= 50 && sc.score < 65)
      .sort((a, b) => a.score - b.score)
      .map((sc) => `${DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain}(${sc.score}점)`);
    if (nonCriticalWeak.length > 0) {
      lines.push(``);
      lines.push(
        `⚡ 주의 도메인(50~65점): ${nonCriticalWeak.join(", ")} — 경쟁사 대비 열위 가능성이 있으며, 고객 Q&A 시 집중 질의 대상이 될 수 있습니다.`
      );
    }
  }

  lines.push(``);
  lines.push(
    `아래 섹션에서 도메인별 세부 분석, 핵심 취약점, 개선 권고사항, 제안서 보완 문구 및 예상 Q&A를 종합적으로 제공합니다.`
  );

  return lines.join("\n");
}

// ---------- Section 1: 종합 리스크 레벨 ----------

function buildSection1RiskOverview(
  scores: ReviewScore[],
  riskLevel: "low" | "medium" | "high" | "critical"
): ReportSection {
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length)
      : 0;

  const riskKr = riskLevelKr(riskLevel);
  const domainOrder: ScoreDomain[] = [
    "compute",
    "storage",
    "network",
    "ha_dr",
    "backup",
    "license",
  ];
  const scoreMap = new Map<ScoreDomain, ReviewScore>();
  for (const sc of scores) {
    scoreMap.set(sc.domain as ScoreDomain, sc);
  }

  const lines: string[] = [
    `【 종합 위험도 】 ${riskKr} (평균 점수: ${avgScore}/100)`,
    ``,
    `도메인별 점수 현황:`,
  ];

  for (const domain of domainOrder) {
    const sc = scoreMap.get(domain);
    if (!sc) continue;
    const label = DOMAIN_LABELS[domain];
    let badge = "";
    if (sc.score < 50) {
      badge = " ← 치명적 리스크 가능성";
    } else if (sc.score < 65) {
      badge = " ← 주의 필요";
    }
    lines.push(`  • ${label}: ${sc.score}/100${badge}`);
  }

  lines.push(``);

  // 치명적 도메인 심층 서술
  const criticalScores = scores.filter((sc) => sc.score < 50);
  for (const sc of criticalScores) {
    const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
    lines.push(`▶ [치명적] ${label} (${sc.score}점)`);
    lines.push(
      `   현재 점수는 업계 최소 기준(50점)에 미달합니다. 다음 조치를 즉각 이행하십시오:`
    );
    const recs = (sc.recommendations as string[]) ?? [];
    const mitigations =
      recs.length > 0
        ? recs.slice(0, 3)
        : [
            `${label} 영역 전담 기술 전문가 투입 및 설계 재검토`,
            `경쟁 솔루션 동등 수준 이상의 기술 자료 추가 제출`,
            `고객사 기술 팀과의 별도 기술 협의 세션 주선`,
          ];
    for (const m of mitigations) {
      lines.push(`     - ${m}`);
    }
    lines.push(``);
  }

  // 주의 도메인 서술
  const warningScores = scores.filter(
    (sc) => sc.score >= 50 && sc.score < 65
  );
  for (const sc of warningScores) {
    const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
    lines.push(`▶ [주의] ${label} (${sc.score}점)`);
    lines.push(
      `   경쟁사 대비 열위 가능성이 있습니다. 고객 기술 평가 전 해당 영역 보완 자료를 준비하십시오.`
    );
    lines.push(``);
  }

  return {
    title: "종합 리스크 레벨",
    body: lines.join("\n"),
  };
}

// ---------- Section 2: 핵심 취약점 Top 3 ----------

function buildSection2TopWeaknesses(scores: ReviewScore[]): ReportSection {
  const sorted = [...scores].sort((a, b) => a.score - b.score);
  const top3 = sorted.slice(0, 3);

  const lines: string[] = [
    `현재 제안의 핵심 취약 도메인 상위 3개를 식별하였습니다. 수주 경쟁 시 경쟁사의 공략 포인트가 될 수 있으므로 우선 보완이 필요합니다.`,
    ``,
  ];

  top3.forEach((sc, idx) => {
    const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
    const risks = (sc.risks as string[]) ?? [];
    lines.push(`[${idx + 1}위] ${label} — ${sc.score}/100점`);
    if (risks.length > 0) {
      lines.push(`  주요 리스크:`);
      for (const r of risks.slice(0, 3)) {
        lines.push(`    - ${r}`);
      }
    } else {
      lines.push(`  주요 리스크: ${label} 영역에서 기술적 보완이 필요합니다.`);
    }
    if (sc.rationale) {
      lines.push(`  평가 근거: ${sc.rationale}`);
    }
    lines.push(``);
  });

  return {
    title: "핵심 취약점 Top 3",
    body: lines.join("\n"),
  };
}

// ---------- Section 3: 개선 권고사항 ----------

function buildSection3Recommendations(scores: ReviewScore[]): ReportSection {
  // 낮은 점수 도메인 우선으로 권고사항 수집
  const sorted = [...scores].sort((a, b) => a.score - b.score);

  const collected: Array<{ domain: string; score: number; rec: string }> = [];
  for (const sc of sorted) {
    const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
    const recs = (sc.recommendations as string[]) ?? [];
    for (const rec of recs) {
      collected.push({ domain: label, score: sc.score, rec });
    }
  }

  const top5 = collected.slice(0, 5);

  const lines: string[] = [
    `점수가 낮은 도메인부터 우선순위를 부여하여 핵심 개선 권고사항 5가지를 제시합니다.`,
    ``,
  ];

  if (top5.length === 0) {
    lines.push("현재 모든 도메인의 점수가 양호하며 즉각적인 권고사항이 없습니다.");
  } else {
    top5.forEach((item, idx) => {
      lines.push(`[권고 ${idx + 1}] [${item.domain} · ${item.score}점]`);
      lines.push(`  ${item.rec}`);
      lines.push(``);
    });
  }

  return {
    title: "개선 권고사항",
    body: lines.join("\n"),
  };
}

// ---------- Section 4: 도메인별 세부 분석 ----------

function buildSection4DomainAnalysis(
  scores: ReviewScore[],
  riskParagraphs: string[]
): ReportSection {
  const domainOrder: ScoreDomain[] = [
    "compute",
    "storage",
    "network",
    "ha_dr",
    "backup",
    "license",
  ];
  const scoreMap = new Map<ScoreDomain, ReviewScore>();
  for (const sc of scores) {
    scoreMap.set(sc.domain as ScoreDomain, sc);
  }

  const lines: string[] = [];

  for (const domain of domainOrder) {
    const sc = scoreMap.get(domain);
    if (!sc) continue;

    const label = DOMAIN_LABELS[domain];
    const risks = (sc.risks as string[]) ?? [];
    const recs = (sc.recommendations as string[]) ?? [];

    lines.push(`━━━ ${label} ━━━`);
    lines.push(`점수: ${sc.score}/100`);
    lines.push(``);

    if (sc.rationale) {
      lines.push(`평가 근거:`);
      lines.push(`  ${sc.rationale}`);
      lines.push(``);
    }

    if (risks.length > 0) {
      lines.push(`위험 요소:`);
      for (const r of risks) {
        lines.push(`  - ${r}`);
      }
      lines.push(``);
    }

    if (recs.length > 0) {
      lines.push(`권고 사항:`);
      for (const r of recs) {
        lines.push(`  - ${r}`);
      }
      lines.push(``);
    }

    // 벤더 특화 리스크 코멘트 (selectTemplates에서 반환된 문구)
    const domainRiskParas = riskParagraphs.filter((p) =>
      p.startsWith(`[${label}]`)
    );
    if (domainRiskParas.length > 0) {
      lines.push(`전문가 코멘트:`);
      for (const para of domainRiskParas) {
        lines.push(`  ${para}`);
      }
      lines.push(``);
    }
  }

  return {
    title: "도메인별 세부 분석",
    body: lines.join("\n").trimEnd(),
  };
}

// ---------- Section 5: 제안서 삽입 문구 모음 ----------

function buildSection5ProposalSnippets(
  proposalSnippets: string[]
): ReportSection {
  const lines: string[] = [
    `제안서 작성 시 활용할 수 있는 벤더/네트워크 특화 문구입니다. 고객 RFP 평가 기준에 맞게 선별하여 활용하십시오.`,
    ``,
  ];

  proposalSnippets.forEach((snippet, idx) => {
    lines.push(`[문구 ${idx + 1}]`);
    lines.push(`  ${snippet}`);
    lines.push(``);
  });

  return {
    title: "제안서 삽입 문구 모음",
    body: lines.join("\n").trimEnd(),
  };
}

// ---------- Section 6: 결론 및 수주 영향도 분석 ----------

function buildConclusion(
  request: ReviewRequest,
  scores: ReviewScore[],
  riskLevel: "low" | "medium" | "high" | "critical"
): string {
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length)
      : 0;

  const vendorName = VENDOR_LABELS[request.vendor_track] ?? request.vendor_track;
  const projectOrCustomer = request.customer_name ?? request.project_name;

  const winProbabilityMap: Record<string, string> = {
    low: "높음 (70~85%)",
    medium: "보통 (45~65%)",
    high: "낮음 (20~40%)",
    critical: "매우 낮음 (10% 미만)",
  };

  const winProbability = winProbabilityMap[riskLevel] ?? "산출 불가";

  const criticalDomains = scores.filter((sc) => sc.score < 50);
  const weakDomains = scores.filter(
    (sc) => sc.score >= 50 && sc.score < 65
  );
  const strongDomains = scores.filter((sc) => sc.score >= 80);

  const lines: string[] = [
    `【 수주 가능성 분석 】`,
    ``,
    `프로젝트: ${projectOrCustomer} | 벤더: ${vendorName}`,
    `종합 점수: ${avgScore}/100 | 위험도: ${riskLevelKr(riskLevel)}`,
    `추정 수주 가능성: ${winProbability}`,
    ``,
  ];

  // 위험도별 종합 평가
  if (riskLevel === "low") {
    lines.push(
      `현재 제안은 기술적으로 우수한 수준(${avgScore}점)을 유지하고 있습니다. 경쟁사 대비 기술 우위를 바탕으로 가격 및 이행 계획 차별화에 집중하면 수주 가능성이 높습니다.`
    );
  } else if (riskLevel === "medium") {
    lines.push(
      `현재 제안은 기술적으로 평균 수준(${avgScore}점)입니다. 일부 취약 도메인에 대한 보완이 이루어진다면 경쟁력 있는 제안이 될 수 있습니다. 고객 기술 평가 전 집중 보완이 필요합니다.`
    );
  } else if (riskLevel === "high") {
    lines.push(
      `현재 제안은 다수의 기술적 취약점을 보유하고 있어(${avgScore}점) 경쟁사 대비 열위에 있을 가능성이 높습니다. 즉각적이고 광범위한 제안 보완 없이는 기술 평가 통과가 어려울 수 있습니다.`
    );
  } else {
    lines.push(
      `현재 제안은 심각한 기술적 결함을 다수 포함하고 있어(${avgScore}점) 기술 평가 탈락 위험이 매우 높습니다. 근본적인 아키텍처 재설계 및 제안서 전면 재작성을 강력히 권고합니다.`
    );
  }

  lines.push(``);

  if (criticalDomains.length > 0) {
    lines.push(`【 즉각 조치 필요 — 치명적 도메인 】`);
    for (const sc of criticalDomains) {
      const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
      lines.push(`  • ${label} (${sc.score}점): 전담 전문가 투입 및 설계 재검토 즉시 착수`);
    }
    lines.push(``);
  }

  if (weakDomains.length > 0) {
    lines.push(`【 기술 평가 전 보완 권고 — 주의 도메인 】`);
    for (const sc of weakDomains) {
      const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
      lines.push(
        `  • ${label} (${sc.score}점): 경쟁사 동등 수준 기술 자료 보강 및 Q&A 사전 준비`
      );
    }
    lines.push(``);
  }

  if (strongDomains.length > 0) {
    const strongNames = strongDomains.map(
      (sc) =>
        `${DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain}(${sc.score}점)`
    );
    lines.push(`【 강점 도메인 — 적극 어필 권장 】`);
    lines.push(`  ${strongNames.join(", ")}`);
    lines.push(
      `  위 도메인은 경쟁사 대비 우위를 점할 가능성이 높습니다. 제안 발표 및 기술 시연 시 집중 부각하십시오.`
    );
    lines.push(``);
  }

  lines.push(`【 영업팀 액션 아이템 】`);
  lines.push(
    `  1. 치명적/주의 도메인 담당 기술 전문가와 즉시 협의 세션 소집`
  );
  lines.push(
    `  2. 고객 RFP 기술 평가 기준과 본 리포트의 취약 도메인 연결 분석`
  );
  lines.push(
    `  3. 경쟁사 제안 정보 수집 및 차별화 포인트 재정의`
  );
  lines.push(
    `  4. 고객 기술 담당자와의 비공식 협의를 통해 평가 우선순위 파악`
  );
  lines.push(
    `  5. POC 제안 적극 추진 — 기술 열위를 실증으로 만회할 최후 수단`
  );

  return lines.join("\n");
}

// ---------- 리스크 플래그 생성 ----------

function buildRiskFlags(
  request: ReviewRequest,
  scores: ReviewScore[]
): string[] {
  const flags: string[] = [];
  const scoreMap = new Map<ScoreDomain, number>();
  for (const sc of scores) {
    scoreMap.set(sc.domain as ScoreDomain, sc.score);
  }

  const get = (d: ScoreDomain) => scoreMap.get(d) ?? 100;

  if (get("ha_dr") < 50) flags.push("HA/DR 점수 50 미만 — 수주 탈락 위험");
  if (get("backup") < 50) flags.push("백업 점수 50 미만 — 데이터 보호 결함");
  if (get("compute") < 50) flags.push("컴퓨트 점수 50 미만 — 사이징 재검토 필요");
  if (get("storage") < 50) flags.push("스토리지 점수 50 미만 — I/O 성능 위험");
  if (get("network") < 50) flags.push("네트워크 점수 50 미만 — 대역폭/QoS 미흡");
  if (get("license") < 50) flags.push("라이선스 점수 50 미만 — 비용 구조 재검토 필요");

  if (request.ha_required && get("ha_dr") < 70)
    flags.push("HA 요구사항 명시됐으나 HA/DR 점수 70 미만");
  if (request.dr_required && get("ha_dr") < 70)
    flags.push("DR 요구사항 명시됐으나 HA/DR 점수 70 미만");
  if (request.backup_required && get("backup") < 70)
    flags.push("백업 요구사항 명시됐으나 백업 점수 70 미만");
  if (!request.backup_required)
    flags.push("백업 미설정 — 데이터 손실 리스크 존재");
  if (request.user_count > 500 && get("compute") < 70)
    flags.push(
      `대규모 사용자(${request.user_count}명) 환경에서 컴퓨트 점수 70 미만`
    );
  if (request.site_count > 2 && get("network") < 70)
    flags.push(
      `다중 사이트(${request.site_count}개) 환경에서 네트워크 점수 70 미만`
    );
  if (request.network_type === "multi_cloud" && get("network") < 75)
    flags.push(
      "멀티클라우드 환경에서 네트워크 점수 75 미만 — 클라우드 간 연동 리스크"
    );

  return flags;
}

// ---------- 메인 생성 함수 ----------

export function generateDraftReport(
  request: ReviewRequest,
  scores: ReviewScore[]
): ReportContent {
  const riskLevel = computeRiskLevel(scores);

  // TemplateContext 구성
  const domainScores: Record<ScoreDomain, number> = {
    compute: 100,
    storage: 100,
    network: 100,
    ha_dr: 100,
    backup: 100,
    license: 100,
  };
  for (const sc of scores) {
    domainScores[sc.domain as ScoreDomain] = sc.score;
  }

  const templateCtx: TemplateContext = {
    vendor_track: request.vendor_track,
    network_type: request.network_type,
    user_count: request.user_count,
    site_count: request.site_count,
    ha_required: request.ha_required,
    dr_required: request.dr_required,
    backup_required: request.backup_required,
    backup_retention_months: request.backup_retention_months,
    security_flags: request.security_flags ?? {},
    domainScores,
    riskLevel,
  };

  const { proposalSnippets, qaItems, riskParagraphs } =
    selectTemplates(templateCtx);

  // Executive Summary
  const executiveSummary = generateExecutiveSummary(
    request,
    scores,
    riskLevel
  );

  // Top Issues & Recommendations
  const topIssues = extractTopItems(scores, "risks", 3);
  const topRecommendations = extractTopItems(scores, "recommendations", 5);

  // 8개 섹션 구성 (sections 배열에는 Section 1~5)
  const sections: ReportSection[] = [
    buildSection1RiskOverview(scores, riskLevel),
    buildSection2TopWeaknesses(scores),
    buildSection3Recommendations(scores),
    buildSection4DomainAnalysis(scores, riskParagraphs),
    buildSection5ProposalSnippets(proposalSnippets),
  ];

  // Section 6: Q&A → qa_items 필드
  // Section 7: 결론 → conclusion 필드
  const conclusion = buildConclusion(request, scores, riskLevel);

  // Risk flags
  const riskFlags = buildRiskFlags(request, scores);

  return {
    executive_summary: executiveSummary,
    risk_level: riskLevel,
    top_issues: topIssues,
    top_recommendations: topRecommendations,
    sections,
    qa_items: qaItems,
    proposal_snippets: proposalSnippets,
    conclusion,
    risk_flags: riskFlags,
  };
}
