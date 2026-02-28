import type {
  ReviewRequest,
  ReviewScore,
  ReportContent,
  ReportSection,
  QAItem,
  ScoreDomain,
} from "@/lib/types/sap";
import { DOMAIN_LABELS, VENDOR_LABELS } from "@/lib/types/sap";

// ---------- Risk level computation ----------

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

// ---------- Executive summary ----------

function generateExecutiveSummary(
  request: ReviewRequest,
  scores: ReviewScore[],
  riskLevel: string
): string {
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length)
      : 0;

  const vendorName = VENDOR_LABELS[request.vendor_track] ?? request.vendor_track;
  const riskKr =
    riskLevel === "low"
      ? "낮음"
      : riskLevel === "medium"
        ? "보통"
        : riskLevel === "high"
          ? "높음"
          : "심각";

  return [
    `본 리뷰는 ${request.customer_name ?? request.project_name} 프로젝트의 VDI 구축 제안에 대한 기술 검증 결과입니다.`,
    `벤더 트랙: ${vendorName} | 사용자 수: ${request.user_count}명 | 사이트 수: ${request.site_count}개`,
    ``,
    `종합 기술 적합성 점수: ${avgScore}/100 (위험도: ${riskKr})`,
    ``,
    `${scores.length}개 영역에 대한 평가가 완료되었으며, 아래에 주요 이슈와 권고사항을 정리하였습니다.`,
  ].join("\n");
}

// ---------- Top issues & recommendations ----------

function extractTopItems(
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
  // Prioritize items from lower-scored domains
  all.sort((a, b) => a.score - b.score);
  return all.slice(0, count).map((x) => x.item);
}

// ---------- Proposal sections ----------

function generateSections(
  request: ReviewRequest,
  scores: ReviewScore[]
): ReportSection[] {
  const sections: ReportSection[] = [];
  const scoreMap = new Map<ScoreDomain, ReviewScore>();
  for (const sc of scores) {
    scoreMap.set(sc.domain as ScoreDomain, sc);
  }

  // Per-domain sections
  const domains: ScoreDomain[] = [
    "compute",
    "storage",
    "network",
    "ha_dr",
    "backup",
    "license",
  ];

  for (const domain of domains) {
    const sc = scoreMap.get(domain);
    if (!sc) continue;

    const label = DOMAIN_LABELS[domain];
    const risks = (sc.risks as string[]) ?? [];
    const recs = (sc.recommendations as string[]) ?? [];

    let body = `${label} 영역 평가 점수: ${sc.score}/100\n\n`;
    if (sc.rationale) {
      body += `평가 근거: ${sc.rationale}\n\n`;
    }
    if (risks.length > 0) {
      body += `주요 위험 요소:\n${risks.map((r) => `  - ${r}`).join("\n")}\n\n`;
    }
    if (recs.length > 0) {
      body += `권고 사항:\n${recs.map((r) => `  - ${r}`).join("\n")}`;
    }

    sections.push({ title: `${label} 검토`, body });
  }

  // HA/DR/Backup specific section (if required)
  if (request.ha_required || request.dr_required || request.backup_required) {
    const flags: string[] = [];
    if (request.ha_required) flags.push("고가용성(HA)");
    if (request.dr_required) flags.push("재해복구(DR)");
    if (request.backup_required) flags.push("백업");

    const haSc = scoreMap.get("ha_dr");
    const bkSc = scoreMap.get("backup");

    let body = `고객 요구사항에 ${flags.join(", ")} 이(가) 포함되어 있습니다.\n\n`;

    if (haSc && haSc.score < 70) {
      body += `HA/DR 영역 점수가 ${haSc.score}점으로, 제안 보완이 필요합니다.\n`;
    }
    if (bkSc && bkSc.score < 70) {
      body += `백업 영역 점수가 ${bkSc.score}점으로, 백업 전략 재검토가 권장됩니다.\n`;
    }

    if (!sections.find((s) => s.title === "가용성 및 복구 종합")) {
      sections.push({ title: "가용성 및 복구 종합", body });
    }
  }

  // Security flags section
  const securityFlags = request.security_flags ?? {};
  const activeFlags = Object.entries(securityFlags).filter(([, v]) => v);
  if (activeFlags.length > 0) {
    const flagLabels: Record<string, string> = {
      endpoint_protection: "엔드포인트 보호",
      network_segmentation: "네트워크 분리",
      mfa: "다중 인증(MFA)",
      data_encryption: "데이터 암호화",
      dlp: "데이터 유출 방지(DLP)",
      compliance: "컴플라이언스 요구",
    };

    const items = activeFlags
      .map(([k]) => flagLabels[k] ?? k)
      .join(", ");

    sections.push({
      title: "보안 요구사항",
      body: `다음 보안 요구사항이 확인되었습니다: ${items}\n\n제안서에 해당 보안 요구사항에 대한 대응 방안이 포함되어야 합니다.`,
    });
  }

  return sections;
}

// ---------- Q&A generation ----------

function generateQAItems(
  request: ReviewRequest,
  scores: ReviewScore[]
): QAItem[] {
  const items: QAItem[] = [];
  const vendorName = VENDOR_LABELS[request.vendor_track] ?? request.vendor_track;

  // Standard questions
  items.push({
    question: `${vendorName} VDI 솔루션의 라이선스 구조는 어떻게 되나요?`,
    answer:
      "벤더별 라이선스 모델(동시 사용자, 지정 사용자, 디바이스 기반)을 확인하고, 실제 사용 패턴에 맞는 최적 모델을 선택해야 합니다.",
  });

  items.push({
    question: `사용자 ${request.user_count}명 규모에 적합한 서버 사이징은?`,
    answer:
      "사용자 프로파일(태스크 워커, 파워 유저, 개발자 등)별 리소스 요구량을 산정한 후, 오버커밋 비율과 성장률을 반영하여 산정해야 합니다.",
  });

  if (request.site_count > 1) {
    items.push({
      question: `${request.site_count}개 사이트 간 VDI 연동 방안은?`,
      answer:
        "사이트 간 네트워크 대역폭, 지연시간을 고려하여 로컬 호스팅 또는 중앙 호스팅 아키텍처를 선택해야 합니다.",
    });
  }

  if (request.ha_required) {
    items.push({
      question: "VDI 환경의 고가용성(HA) 구성 방안은?",
      answer:
        "Connection Broker, 하이퍼바이저, 스토리지 각 레이어별 이중화 구성이 필요합니다. RPO/RTO 목표에 맞는 HA 아키텍처를 설계해야 합니다.",
    });
  }

  if (request.dr_required) {
    items.push({
      question: "재해복구(DR) 시나리오 및 테스트 계획은?",
      answer:
        "DR 사이트 구성, 복제 방식(동기/비동기), 페일오버/페일백 절차를 포함한 DR 계획을 수립하고, 정기적인 DR 훈련을 실시해야 합니다.",
    });
  }

  if (request.backup_required) {
    items.push({
      question: "VDI 사용자 데이터 백업 전략은?",
      answer:
        "프로파일 데이터, 개인 드라이브, 애플리케이션 설정 등의 백업 범위와 주기, 보존 기간을 정의해야 합니다.",
    });
  }

  items.push({
    question: "네트워크 대역폭 요구사항은?",
    answer:
      "프로토콜별(ICA/HDX, PCoIP, Blast, RDP) 대역폭 특성을 분석하고, 사용자 수와 동시접속률을 반영한 네트워크 설계가 필요합니다.",
  });

  items.push({
    question: "GPU 가상화가 필요한 사용자 그룹이 있나요?",
    answer:
      "CAD, 영상 편집 등 GPU 집약적 워크로드가 있는 경우 vGPU 프로파일 선정 및 호환 하드웨어 검토가 필요합니다.",
  });

  items.push({
    question: "엔드포인트 디바이스 전략은?",
    answer:
      "씬 클라이언트, 제로 클라이언트, 기존 PC 재활용 등 엔드포인트 전략에 따라 필요한 주변기기 리다이렉션 및 멀티미디어 지원 수준이 달라집니다.",
  });

  items.push({
    question: "사용자 프로파일 관리 방안은?",
    answer:
      "FSLogix, UPM 등 프로파일 관리 솔루션을 통해 로그인 시간 단축 및 개인화 설정 유지가 가능합니다.",
  });

  items.push({
    question: "모니터링 및 성능 관리 도구는?",
    answer:
      "VDI 전용 모니터링 도구(ControlUp, Liquidware 등)를 통해 사용자 경험 지표(EUEM)를 측정하고 선제적 대응이 가능합니다.",
  });

  // Domain-specific Q&A from scores
  for (const sc of scores) {
    if (sc.score < 60) {
      const label = DOMAIN_LABELS[sc.domain as ScoreDomain] ?? sc.domain;
      items.push({
        question: `${label} 영역 점수가 낮은 이유와 개선 방안은?`,
        answer:
          sc.rationale ??
          `${label} 영역에서 기술적 보완이 필요합니다. 상세 내용은 해당 섹션을 참조하세요.`,
      });
    }
  }

  // Pad to at least 10 items
  const general: QAItem[] = [
    {
      question: "POC(Proof of Concept) 범위 및 성공 기준은?",
      answer:
        "핵심 사용 시나리오를 포함한 POC를 통해 성능, 호환성, 사용자 경험을 검증해야 합니다.",
    },
    {
      question: "마이그레이션 전략 및 일정은?",
      answer:
        "파일럿 그룹 → 부서별 단계 전환 → 전사 확대의 단계적 마이그레이션을 권장합니다.",
    },
    {
      question: "교육 및 변화관리 계획은?",
      answer:
        "사용자 교육, IT 관리자 기술 전수, 헬프데스크 체계 구축이 원활한 전환의 핵심입니다.",
    },
    {
      question: "TCO(총소유비용) 분석이 되었나요?",
      answer:
        "하드웨어, 소프트웨어, 운영, 전력, 공간 비용을 포함한 3~5년 TCO 비교가 필요합니다.",
    },
    {
      question: "SLA(서비스수준협약) 기준은?",
      answer:
        "가용률, 응답시간, 장애복구시간 등의 SLA 항목을 정의하고 모니터링 체계를 구축해야 합니다.",
    },
  ];

  while (items.length < 10 && general.length > 0) {
    items.push(general.shift()!);
  }

  return items.slice(0, 20);
}

// ---------- Main generator ----------

export function generateDraftReport(
  request: ReviewRequest,
  scores: ReviewScore[]
): ReportContent {
  const riskLevel = computeRiskLevel(scores);
  const topIssues = extractTopItems(scores, "risks", 3);
  const topRecommendations = extractTopItems(scores, "recommendations", 3);
  const executiveSummary = generateExecutiveSummary(request, scores, riskLevel);
  const sections = generateSections(request, scores);
  const qaItems = generateQAItems(request, scores);

  return {
    executive_summary: executiveSummary,
    risk_level: riskLevel,
    top_issues: topIssues,
    top_recommendations: topRecommendations,
    sections,
    qa_items: qaItems,
  };
}
