// =====================================================================
// VDI Role Redefinition — 진단 질문 정의
// 9문항. 4가지 결과 유형(maintain/complement/reduce/redesign)에 가중치 합산.
// 설계: docs/02-design/features/n2sf-transition-advisor.design.md
// =====================================================================

export type ResultType = "maintain" | "complement" | "reduce" | "redesign";

export const RESULT_LABELS: Record<ResultType, string> = {
  maintain: "유지 강화형",
  complement: "제로트러스트 보완형",
  reduce: "점진적 축소형",
  redesign: "재설계형",
};

export type WeightVector = Record<ResultType, number>;

export interface VdiRoleOption {
  value: string;
  label: string;
  weights: WeightVector;
}

export interface VdiRoleQuestion {
  id: string;
  label: string;
  help?: string;
  required: boolean;
  options: VdiRoleOption[];
}

// 가중치 설계 원칙:
// - 각 옵션은 4유형 모두에 0~3 사이의 점수를 분배
// - 합계 ~5점 정도로 설계해 9문항 합산 시 ~45점 근처
// - maintain: 안정 운영·고위험 업무 비중 높음을 신호
// - complement: S등급·인증/권한 연계 필요를 신호
// - reduce: O등급·SaaS 가능 업무 비중 높음을 신호
// - redesign: 비효율·운영 장애·재분류 필요성 신호

export const VDI_ROLE_QUESTIONS: VdiRoleQuestion[] = [
  {
    id: "vr_primary_workload",
    label: "VDI는 현재 주로 어떤 업무에 사용됩니까?",
    required: true,
    options: [
      { value: "high-risk", label: "고위험 업무(개인정보·기밀 처리)", weights: { maintain: 3, complement: 2, reduce: 0, redesign: 0 } },
      { value: "general", label: "일반 사무 업무 전반", weights: { maintain: 1, complement: 2, reduce: 2, redesign: 1 } },
      { value: "internet-only", label: "인터넷 접속 전용", weights: { maintain: 0, complement: 1, reduce: 3, redesign: 1 } },
      { value: "remote", label: "재택·외부 접속용", weights: { maintain: 1, complement: 3, reduce: 1, redesign: 1 } },
      { value: "mixed", label: "혼재되어 명확치 않음", weights: { maintain: 0, complement: 1, reduce: 1, redesign: 3 } },
    ],
  },
  {
    id: "vr_network_segment",
    label: "VDI는 인터넷망용입니까, 업무망용입니까?",
    required: true,
    options: [
      { value: "internet", label: "인터넷망 VDI", weights: { maintain: 0, complement: 1, reduce: 3, redesign: 1 } },
      { value: "business", label: "업무망 VDI", weights: { maintain: 3, complement: 2, reduce: 0, redesign: 0 } },
      { value: "both", label: "둘 다 운영", weights: { maintain: 2, complement: 2, reduce: 1, redesign: 1 } },
      { value: "unknown", label: "모름/미정", weights: { maintain: 0, complement: 1, reduce: 1, redesign: 2 } },
    ],
  },
  {
    id: "vr_user_complaints",
    label: "사용자가 VDI에 대해 불편을 호소하는 빈도는?",
    required: true,
    options: [
      { value: "rare", label: "거의 없음", weights: { maintain: 3, complement: 1, reduce: 0, redesign: 0 } },
      { value: "occasional", label: "가끔 발생", weights: { maintain: 2, complement: 1, reduce: 1, redesign: 0 } },
      { value: "frequent", label: "자주 발생", weights: { maintain: 0, complement: 1, reduce: 2, redesign: 2 } },
      { value: "constant", label: "항시적 불만", weights: { maintain: 0, complement: 0, reduce: 2, redesign: 3 } },
    ],
  },
  {
    id: "vr_incident_frequency",
    label: "VDI 운영 장애(접속 불가, 성능 저하 등) 빈도는?",
    required: true,
    options: [
      { value: "stable", label: "안정적", weights: { maintain: 3, complement: 1, reduce: 0, redesign: 0 } },
      { value: "minor", label: "경미한 이슈만 가끔", weights: { maintain: 2, complement: 1, reduce: 1, redesign: 0 } },
      { value: "regular", label: "주기적 장애", weights: { maintain: 0, complement: 1, reduce: 1, redesign: 2 } },
      { value: "severe", label: "잦은 중대 장애", weights: { maintain: 0, complement: 0, reduce: 2, redesign: 3 } },
    ],
  },
  {
    id: "vr_saas_potential",
    label: "현재 VDI에서 처리하는 업무 중 SaaS/브라우저로 전환 가능한 업무 비중은?",
    required: true,
    options: [
      { value: "very-low", label: "거의 없음", weights: { maintain: 3, complement: 2, reduce: 0, redesign: 0 } },
      { value: "low", label: "20% 미만", weights: { maintain: 2, complement: 2, reduce: 1, redesign: 0 } },
      { value: "mid", label: "20~50%", weights: { maintain: 1, complement: 1, reduce: 2, redesign: 1 } },
      { value: "high", label: "50% 이상", weights: { maintain: 0, complement: 0, reduce: 3, redesign: 2 } },
    ],
  },
  {
    id: "vr_link_dependency",
    label: "망연계 시스템 의존도는?",
    required: true,
    options: [
      { value: "very-high", label: "매우 높음(주 업무 흐름)", weights: { maintain: 3, complement: 2, reduce: 0, redesign: 0 } },
      { value: "high", label: "높음", weights: { maintain: 2, complement: 2, reduce: 0, redesign: 1 } },
      { value: "medium", label: "보통", weights: { maintain: 1, complement: 2, reduce: 1, redesign: 1 } },
      { value: "low", label: "낮음", weights: { maintain: 0, complement: 1, reduce: 2, redesign: 2 } },
    ],
  },
  {
    id: "vr_iam_integration",
    label: "VDI가 인증/권한관리(IAM)와 통합되어 있습니까?",
    required: true,
    options: [
      { value: "isolated", label: "별도 운영", weights: { maintain: 0, complement: 3, reduce: 0, redesign: 2 } },
      { value: "basic-ad", label: "기본 AD 연동만", weights: { maintain: 1, complement: 3, reduce: 1, redesign: 1 } },
      { value: "sso", label: "SSO 연동", weights: { maintain: 2, complement: 2, reduce: 1, redesign: 0 } },
      { value: "iam-pam", label: "IAM/PAM 통합 운영", weights: { maintain: 3, complement: 1, reduce: 1, redesign: 0 } },
    ],
  },
  {
    id: "vr_cost_efficiency",
    label: "VDI 비용 대비 효과 인식은?",
    required: true,
    options: [
      { value: "very-good", label: "매우 만족", weights: { maintain: 3, complement: 1, reduce: 0, redesign: 0 } },
      { value: "good", label: "만족", weights: { maintain: 2, complement: 1, reduce: 1, redesign: 0 } },
      { value: "neutral", label: "보통", weights: { maintain: 1, complement: 1, reduce: 1, redesign: 1 } },
      { value: "low", label: "비용 대비 낮음", weights: { maintain: 0, complement: 1, reduce: 2, redesign: 2 } },
      { value: "very-low", label: "매우 비효율", weights: { maintain: 0, complement: 0, reduce: 2, redesign: 3 } },
    ],
  },
  {
    id: "vr_renewal_timing",
    label: "다음 VDI 갱신/증설 시점은 언제입니까?",
    required: true,
    options: [
      { value: "12m", label: "12개월 이내", weights: { maintain: 1, complement: 2, reduce: 1, redesign: 2 } },
      { value: "12-24m", label: "12~24개월", weights: { maintain: 2, complement: 2, reduce: 1, redesign: 1 } },
      { value: "24m+", label: "24개월 이후", weights: { maintain: 3, complement: 1, reduce: 1, redesign: 0 } },
      { value: "unknown", label: "정해지지 않음", weights: { maintain: 1, complement: 1, reduce: 1, redesign: 2 } },
    ],
  },
];

export type VdiRoleAnswers = Record<string, string>;
