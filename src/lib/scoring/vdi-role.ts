// =====================================================================
// VDI Role Redefinition — 룰 기반 스코어링 엔진
// 입력: { [questionId]: optionValue }
// 출력: 4가지 결과 유형 중 최고 점수 유형 + 근거/권장 조치
// =====================================================================

import {
  VDI_ROLE_QUESTIONS,
  RESULT_LABELS,
  type ResultType,
  type VdiRoleAnswers,
  type WeightVector,
} from "@/lib/tools/vdi-role/questions";

export interface VdiDisposition {
  keep: string[];
  reduce: string[];
  redesign: string[];
}

export interface VdiRoleOutput {
  version: "v1";
  tool: "vdi_role";
  result_type: ResultType;
  result_name: string;
  type_scores: Record<ResultType, number>;
  rationale: string[];
  recommended_actions: string[];
  vdi_disposition: VdiDisposition;
  next_steps: string[];
}

const ZERO_VECTOR: WeightVector = { maintain: 0, complement: 0, reduce: 0, redesign: 0 };

// ── 점수 합산 ──
function calcTypeScores(answers: VdiRoleAnswers): WeightVector {
  const totals: WeightVector = { ...ZERO_VECTOR };

  for (const q of VDI_ROLE_QUESTIONS) {
    const ans = answers[q.id];
    const opt = q.options.find((o) => o.value === ans);
    if (!opt) continue;
    totals.maintain += opt.weights.maintain;
    totals.complement += opt.weights.complement;
    totals.reduce += opt.weights.reduce;
    totals.redesign += opt.weights.redesign;
  }
  return totals;
}

function pickWinner(scores: WeightVector): ResultType {
  const entries = Object.entries(scores) as [ResultType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// ── 결과 유형별 텍스트 ──
const TYPE_DESCRIPTIONS: Record<ResultType, string> = {
  maintain:
    "현재 VDI가 핵심 보안 통제 수단으로 잘 작동하고 있으며, 단기적으로 유지·고도화하는 것이 비용 대비 효과적입니다. 단, N²SF 시행 후 인증/권한 통제 강화 요구가 추가됩니다.",
  complement:
    "VDI를 ‘격리 수단’이 아닌 ‘인증/권한과 결합된 워크스페이스’로 재정의하는 것이 적합합니다. ZTNA/SDP·MFA·PAM 보완을 병행하면 N²SF S등급 영역에서 경쟁력을 확보할 수 있습니다.",
  reduce:
    "현재 VDI에서 처리하는 업무 중 상당 부분이 SaaS·브라우저·DaaS로 전환 가능합니다. VDI는 고위험 업무로 축소하고, 인터넷·협업 업무는 분리하는 것이 효율적입니다.",
  redesign:
    "현재 VDI 구조가 비효율적이거나 사용자 불만/장애가 누적된 상태입니다. 단순 갱신은 비용 낭비가 될 가능성이 높습니다. 업무 재분류 후 단계적으로 환경을 재설계하는 것이 적합합니다.",
};

// ── 근거(rationale) 생성: 답변 패턴에서 그 유형이 도출된 이유 ──
function generateRationale(answers: VdiRoleAnswers, type: ResultType): string[] {
  const rationale: string[] = [];

  if (type === "maintain") {
    if (answers.vr_primary_workload === "high-risk")
      rationale.push("주 업무가 고위험(개인정보·기밀)이라 강한 격리 환경이 필요합니다.");
    if (answers.vr_network_segment === "business")
      rationale.push("업무망 VDI 중심 운영이라 보안 통제 단순화 효과가 큽니다.");
    if (answers.vr_user_complaints === "rare" || answers.vr_user_complaints === "occasional")
      rationale.push("사용자 불만이 낮아 운영 안정성이 검증되었습니다.");
    if (answers.vr_incident_frequency === "stable" || answers.vr_incident_frequency === "minor")
      rationale.push("운영 장애가 적어 환경의 신뢰성이 높습니다.");
    if (answers.vr_link_dependency === "very-high" || answers.vr_link_dependency === "high")
      rationale.push("망연계 의존도가 높아 즉시 분리 시 운영 단절 위험이 있습니다.");
    if (answers.vr_cost_efficiency === "very-good" || answers.vr_cost_efficiency === "good")
      rationale.push("비용 대비 효과 인식이 긍정적입니다.");
  }

  if (type === "complement") {
    if (answers.vr_iam_integration === "isolated" || answers.vr_iam_integration === "basic-ad")
      rationale.push("IAM/PAM 통합이 약해 인증 체계 보완이 가장 큰 효과를 냅니다.");
    if (answers.vr_primary_workload === "remote")
      rationale.push("재택·외부 접속 비중이 높아 ZTNA·MFA 보완이 시급합니다.");
    if (answers.vr_link_dependency === "high" || answers.vr_link_dependency === "medium")
      rationale.push("망연계가 일정 수준 있어 단계적 보완 전환이 유리합니다.");
    if (answers.vr_renewal_timing === "12m" || answers.vr_renewal_timing === "12-24m")
      rationale.push("갱신 시점이 임박해 N²SF 사양 통합 발주를 준비할 시기입니다.");
  }

  if (type === "reduce") {
    if (answers.vr_saas_potential === "mid" || answers.vr_saas_potential === "high")
      rationale.push("SaaS/브라우저로 전환 가능한 업무 비중이 상당합니다.");
    if (answers.vr_network_segment === "internet")
      rationale.push("인터넷망 VDI 중심으로 운영되어 RBI·SaaS 대체 효과가 큽니다.");
    if (answers.vr_primary_workload === "internet-only")
      rationale.push("주 사용 목적이 인터넷 접속 전용입니다.");
    if (answers.vr_link_dependency === "low")
      rationale.push("망연계 의존도가 낮아 분리·축소가 비교적 용이합니다.");
  }

  if (type === "redesign") {
    if (answers.vr_user_complaints === "frequent" || answers.vr_user_complaints === "constant")
      rationale.push("사용자 불만이 누적되어 단순 갱신만으로 해결되기 어렵습니다.");
    if (answers.vr_incident_frequency === "regular" || answers.vr_incident_frequency === "severe")
      rationale.push("운영 장애가 잦아 아키텍처 차원의 재검토가 필요합니다.");
    if (answers.vr_cost_efficiency === "low" || answers.vr_cost_efficiency === "very-low")
      rationale.push("비용 대비 효과가 낮은 상태로 인식됩니다.");
    if (answers.vr_primary_workload === "mixed")
      rationale.push("VDI 사용 목적이 혼재되어 업무 재분류가 선행되어야 합니다.");
    if (answers.vr_iam_integration === "isolated")
      rationale.push("VDI가 IAM과 분리 운영되어 통합 재설계가 효율적입니다.");
  }

  // 최소 3개 보장
  while (rationale.length < 3) {
    rationale.push(`전반적 답변 패턴이 ‘${RESULT_LABELS[type]}’ 시나리오와 가장 부합합니다.`);
  }
  return rationale.slice(0, 5);
}

// ── 권장 조치 ──
function generateActions(type: ResultType, answers: VdiRoleAnswers): string[] {
  const actions: string[] = [];

  if (type === "maintain") {
    actions.push("VMware/Citrix 라이선스 갱신 시 N²SF 사양(C/S/O 분류) 사전 반영");
    actions.push("MFA 전 직원 적용 + PAM 도입");
    actions.push("기존 VDI 운영 안정성 보고서 정기 발행 (감사 증적 활용)");
    actions.push("Omnissa Horizon / 국산 VDI(틸론 등) 라이선스 비교 검토");
    if (answers.vr_renewal_timing === "12m" || answers.vr_renewal_timing === "12-24m") {
      actions.push("갱신 일정에 맞춰 N²SF 통합 컨소시엄 사업자와 사전 협의");
    }
  } else if (type === "complement") {
    actions.push("ZTNA/SDP PoC: VDI 게이트웨이를 ID 중심 접근 통제로 보강");
    actions.push("PAM 도입 또는 강화 (특권계정 승인·녹화·감사)");
    actions.push("MFA 전사 적용 + 외부 협력사 포함");
    actions.push("DRM/RBI 연계로 등급별 데이터 흐름 통제");
    actions.push("VDI 세션 로그를 SIEM에 통합");
  } else if (type === "reduce") {
    actions.push("O등급 업무를 식별하여 SaaS/CSAP DaaS로 분리");
    actions.push("RBI(원격 브라우저 격리)로 인터넷 업무 분리");
    actions.push("VDI는 고위험·기밀 업무로 축소 운영");
    actions.push("VMware Broadcom 라이선스 인상에 대비한 코어수 재산정");
    actions.push("DaaS 마이그레이션 PoC: 1개 부서");
  } else {
    // redesign
    actions.push("업무 재분류(C/S/O) PoC + 전체 인벤토리 작성");
    actions.push("기존 VDI 운영 비용·장애 데이터 정량화");
    actions.push("EUC(End-User Computing) 통합 아키텍처 재설계 컨설팅");
    actions.push("VDI 잔존 영역 vs DaaS·SaaS·온북 분리 영역 결정");
    actions.push("재설계 로드맵 수립 후 단계적 발주");
  }

  return actions.slice(0, 5);
}

// ── 업무 영역별 권장 처리 ──
function generateDisposition(type: ResultType, answers: VdiRoleAnswers): VdiDisposition {
  const keep: string[] = [];
  const reduce: string[] = [];
  const redesign: string[] = [];

  // 공통: high-risk는 항상 keep
  keep.push("개인정보·기밀 처리 업무 (C등급)");
  if (answers.vr_primary_workload === "high-risk" || answers.vr_network_segment === "business") {
    keep.push("업무망 핵심 시스템 운영");
  }

  if (type === "maintain") {
    keep.push("재택·외부 접속이 잦은 직원 환경");
    keep.push("규제·감사 대상 업무 (S등급)");
    reduce.push("단순 인터넷 검색용 단말 (가능 시 SaaS로 분리)");
  } else if (type === "complement") {
    keep.push("규제·감사 대상 업무 (S등급) — 단, ZTNA/PAM 보완");
    reduce.push("일반 협업·문서 업무 (SaaS DLP 통제 후 분리)");
    redesign.push("외부 협력사·재택 접속 — ZTNA 중심으로 재설계");
  } else if (type === "reduce") {
    keep.push("기밀·고위험 업무만 VDI 잔존");
    reduce.push("인터넷 접속 / 메일 / 협업 업무 → SaaS·DaaS·RBI");
    reduce.push("저빈도 사용자(Light User) 환경 → 브라우저 기반 워크스페이스");
    redesign.push("일반 사무 업무 → 온북 + ZTNA");
  } else {
    keep.push("고위험 업무는 잔존 VDI에 집중");
    redesign.push("일반 사무 업무 — 온북·DaaS·SaaS 조합으로 재구성");
    redesign.push("재택·외부 접속 — ZTNA + 디바이스 통제");
    redesign.push("개발·연구 환경 — 별도 등급 정책으로 분리");
    reduce.push("인터넷 접속 전용 단말은 단계적 폐지");
  }

  return { keep, reduce, redesign };
}

function generateNextSteps(type: ResultType): string[] {
  if (type === "maintain") {
    return [
      "‘N²SF 전환 준비도 진단’ 함께 수행하여 인증·로그 영역 보완",
      "VDI 갱신 시 N²SF 사양 사전 반영 컨설팅 신청",
      "VMware Broadcom 라이선스 진단 (코어수·EUC 분리 검토)",
      "기존 VDI 운영 안정성을 정기 리포트로 가시화",
    ];
  }
  if (type === "complement") {
    return [
      "ZTNA/SDP PoC 사업자 선정 미팅",
      "‘N²SF 전환 준비도 진단’ 함께 수행하여 인증/감사 영역 점검",
      "기존 VDI + ZTNA 통합 운영 컨설팅 신청",
      "DRM·RBI 솔루션 비교 평가",
    ];
  }
  if (type === "reduce") {
    return [
      "O등급 업무 식별을 위한 1일 워크숍",
      "CSAP DaaS / SaaS 비교 평가",
      "‘N²SF 전환 준비도 진단’ 함께 수행",
      "RBI / SaaS DLP 솔루션 PoC",
    ];
  }
  return [
    "업무 재분류 워크숍 + 정보자산 인벤토리 작성",
    "VDI 운영 비용·장애 데이터 정량화",
    "EUC 통합 재설계 컨설팅 신청",
    "‘N²SF 전환 준비도 진단’ 함께 수행하여 단계적 우선순위 결정",
  ];
}

// ── Main Entry ──
export function runVdiRole(answers: VdiRoleAnswers): VdiRoleOutput {
  const type_scores = calcTypeScores(answers);
  const result_type = pickWinner(type_scores);
  const rationale = generateRationale(answers, result_type);
  const recommended_actions = generateActions(result_type, answers);
  const vdi_disposition = generateDisposition(result_type, answers);
  const next_steps = generateNextSteps(result_type);

  return {
    version: "v1",
    tool: "vdi_role",
    result_type,
    result_name: RESULT_LABELS[result_type],
    type_scores,
    rationale,
    recommended_actions,
    vdi_disposition,
    next_steps,
  };
}

export { RESULT_LABELS, TYPE_DESCRIPTIONS };
