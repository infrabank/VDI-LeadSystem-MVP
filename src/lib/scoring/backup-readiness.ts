// =====================================================================
// Backup & Cyber Resilience Readiness — 룰 기반 스코어링 엔진
// 입력: { [questionId]: optionValue }
// 출력: BackupReadinessOutput
// =====================================================================

import {
  QUESTIONS,
  SECTIONS,
  getOptionScore,
  type BackupReadinessAnswers,
  type SectionId,
} from "@/lib/tools/backup-readiness/questions";

export type BackupLevel = 1 | 2 | 3 | 4 | 5;

export const LEVEL_NAMES: Record<BackupLevel, string> = {
  1: "Initial",
  2: "Reactive",
  3: "Defined",
  4: "Managed",
  5: "Optimized",
};

export const LEVEL_DESCRIPTIONS: Record<BackupLevel, string> = {
  1: "백업 정책이 부재하거나 미흡합니다. 사고 시 데이터 손실 위험이 매우 높습니다. 기초 백업 도입을 즉시 시작해야 합니다.",
  2: "핵심 시스템 위주의 백업만 운영되고 있습니다. 검증·DR·랜섬웨어 보호가 미흡해 사고 발생 시 복구 지연이 가능합니다.",
  3: "정책·범위가 명문화되어 있고 정기 백업이 운영됩니다. 검증·DR이 미성숙하고 랜섬웨어 대응이 부분적입니다.",
  4: "자동화·검증·DR이 운영되며 RTO/RPO SLA가 정의되어 있습니다. 랜섬웨어 immutable 보호가 가능한 상태입니다.",
  5: "사이버복원력 표준을 충족합니다. AI 기반 탐지·자동화·24x7 검증이 운영되어 컴플라이언스 대응이 가능합니다.",
};

export interface SectionScore {
  id: SectionId;
  title: string;
  score: number; // 0~100
  weight: number; // 0~1
}

export interface Recommendation {
  area: SectionId;
  areaTitle: string;
  headline: string;
  acronisMatch: string;
}

export interface BackupReadinessOutput {
  version: "v1";
  tool: "backup_readiness";
  score: number; // 0~100
  level: BackupLevel;
  level_name: string;
  level_description: string;
  sections: SectionScore[];
  summary: string;
  top_recommendations: Recommendation[];
  next_steps: string[];
}

// ── Helpers ──
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreToLevel(score: number): BackupLevel {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

// ── 섹션별 점수 ──
function calcSectionScores(answers: BackupReadinessAnswers): SectionScore[] {
  return SECTIONS.map((sec) => {
    const sectionQs = QUESTIONS.filter((q) => q.section === sec.id);
    let raw = 0;
    let max = 0;
    for (const q of sectionQs) {
      raw += getOptionScore(q, answers[q.id]);
      max += 3; // 각 문항 max 3점
    }
    const score = max === 0 ? 0 : Math.round((raw / max) * 100);
    return {
      id: sec.id,
      title: sec.title,
      score: clamp(score, 0, 100),
      weight: sec.weight,
    };
  });
}

// ── 종합 점수 ──
function calcOverallScore(sections: SectionScore[]): number {
  const weighted = sections.reduce((acc, s) => acc + s.score * s.weight, 0);
  return clamp(Math.round(weighted), 0, 100);
}

// ── Acronis 매칭 권고 (영역 점수 < 60% 시 발동) ──
const RECOMMENDATIONS: Record<SectionId, { headline: string; acronisMatch: string }> = {
  scope: {
    headline: "백업 적용 범위 확대 — 엔드포인트·SaaS 통합",
    acronisMatch: "Acronis Cyber Protect Cloud — 서버·VM·EP·SaaS(M365/Google) 단일 콘솔 통합 보호",
  },
  policy: {
    headline: "3-2-1 규칙 도입 + 보관 정책 단계화",
    acronisMatch: "Acronis Storage Tiering — 단계별 자동 보관, 오프사이트 사본 자동화",
  },
  ransomware: {
    headline: "Immutable 백업 + 안티-멀웨어 통합 운영",
    acronisMatch: "Acronis Active Protection — AI 행위 기반 랜섬웨어 차단·자동 롤백",
  },
  recovery_validation: {
    headline: "자동 복구 테스트·무결성 검증 도입",
    acronisMatch: "Acronis Recovery Verification — 정기 자동 부팅 검증·리포트화",
  },
  service_level: {
    headline: "등급별 RTO/RPO SLA 명문화",
    acronisMatch: "Myloket SLA 워크샵 — 업무 등급별 목표 수립 + 운영 절차서",
  },
  disaster_recovery: {
    headline: "DR 사이트·클라우드 페일오버 도입",
    acronisMatch: "Acronis Cyber Disaster Recovery — 클라우드 핫 페일오버(분 단위 RTO)",
  },
  security_access: {
    headline: "키관리·MFA·SoD 강화",
    acronisMatch: "Acronis MSP MFA + Audit Logging — 백업 콘솔 접근 통제·감사 자동화",
  },
};

function generateRecommendations(sections: SectionScore[]): Recommendation[] {
  const weak = sections.filter((s) => s.score < 60).sort((a, b) => a.score - b.score);
  return weak.slice(0, 3).map((s) => ({
    area: s.id,
    areaTitle: s.title,
    headline: RECOMMENDATIONS[s.id].headline,
    acronisMatch: RECOMMENDATIONS[s.id].acronisMatch,
  }));
}

// ── 종합 요약 ──
function generateSummary(score: number, level: BackupLevel, sections: SectionScore[]): string {
  const weakest = [...sections].sort((a, b) => a.score - b.score)[0];
  const strongest = [...sections].sort((a, b) => b.score - a.score)[0];
  return `귀 기관의 백업·사이버복원력은 종합 ${score}점, **Level ${level} (${LEVEL_NAMES[level]})**로 평가됩니다. 강점 영역은 "${strongest.title}"(${strongest.score}점)이며, 가장 취약한 영역은 "${weakest.title}"(${weakest.score}점)입니다. ${LEVEL_DESCRIPTIONS[level]}`;
}

// ── 다음 단계 ──
function generateNextSteps(level: BackupLevel): string[] {
  if (level <= 2) {
    return [
      "전사 백업 인벤토리 작성 (대상 시스템·데이터·현 정책 식별)",
      "3-2-1 규칙 기반 백업 정책 표준안 수립",
      "Acronis Cyber Protect 도입 PoC를 위한 무료 상담 신청",
      "랜섬웨어 사고 대응 시나리오 초안 문서화",
    ];
  }
  if (level === 3) {
    return [
      "취약 영역 1순위(권고 헤드라인 참조) 우선 개선 착수",
      "Immutable 백업·자동 복구 검증 도입 검토",
      "DR 사이트 또는 클라우드 페일오버 PoC",
      "백업 운영 SLA 문서화 + 분기 점검 체계 수립",
    ];
  }
  return [
    "AI 기반 이상 탐지·24x7 모니터링 도입 검토",
    "분기 단위 자동 DR 훈련 + 결과 리포트화",
    "전사 키관리(KMS)·SoD 권한 분리 정착",
    "사이버복원력 컴플라이언스 정기 감사 체계 운영",
  ];
}

// ── Main Entry ──
export function runBackupReadiness(answers: BackupReadinessAnswers): BackupReadinessOutput {
  const sections = calcSectionScores(answers);
  const score = calcOverallScore(sections);
  const level = scoreToLevel(score);

  return {
    version: "v1",
    tool: "backup_readiness",
    score,
    level,
    level_name: LEVEL_NAMES[level],
    level_description: LEVEL_DESCRIPTIONS[level],
    sections,
    summary: generateSummary(score, level, sections),
    top_recommendations: generateRecommendations(sections),
    next_steps: generateNextSteps(level),
  };
}
