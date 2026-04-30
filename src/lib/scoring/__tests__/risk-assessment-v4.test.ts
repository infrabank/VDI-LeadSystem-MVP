import { describe, it, expect } from "vitest";
import {
  calculateRiskAssessmentV4,
  resolveGrade,
} from "../risk-assessment-v4";
import type { RiskAssessmentV4Input } from "@/lib/tools/risk-assessment/questions.v4";

const baseInput: RiskAssessmentV4Input = {
  // v3 base fields
  platform: "vmware",
  vm_count: 150,
  host_count: 6,
  concurrent_users: 120,
  storage_type: "san",
  storage_protocol: "iscsi",
  storage_migration: false,
  multipath_configured: "yes",
  network_separation: false,
  ha_enabled: "yes",
  dr_site: "warm",
  rpo_target: "<=4h",
  rto_target: "<=4h",
  backup_exists: "yes",
  backup_frequency: "daily",
  ops_staff_level: "mid",
  incident_response_maturity: "standard",
  change_management: "standard",
  documentation_level: "standard",
  automation_level: "standard",
  provisioning_time: "10-30m",
  migration_rehearsal: "complete",
  access_method: ["vpn", "gateway"],
  mfa_enabled: "yes",
  privileged_access_control: "standard",
  // v4 fields
  data_grade: "O",
  mixed_grade: [],
  service_model: "other",
};

describe("resolveGrade — 가이드라인 표 2-9 상위 등급 자동 승계", () => {
  it("Test 1: declared O + mixed=[personal_info] → S 로 승계", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "O",
      mixed_grade: ["personal_info"],
    };
    expect(resolveGrade(input)).toBe("S");
  });

  it("declared C + mixed=[personal_info] → C 유지 (상위 우선)", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "C",
      mixed_grade: ["personal_info"],
    };
    expect(resolveGrade(input)).toBe("C");
  });

  it("declared O + mixed=[open_data] → O 유지", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "O",
      mixed_grade: ["open_data"],
    };
    expect(resolveGrade(input)).toBe("O");
  });

  it("declared O + mixed=[trade_secret] → S 로 승계", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "O",
      mixed_grade: ["trade_secret"],
    };
    expect(resolveGrade(input)).toBe("S");
  });

  it("declared O + mixed=[system_log] → S 로 승계", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "O",
      mixed_grade: ["system_log"],
    };
    expect(resolveGrade(input)).toBe("S");
  });
});

describe("calculateRiskAssessmentV4 — 등급 가중치 (C 1.5 / S 1.2 / O 1.0)", () => {
  it("Test 2: 동일 베이스 입력에서 C 등급 score >= O 등급 score (clamp 100 고려)", () => {
    const oInput: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "O",
      mixed_grade: [],
    };
    const cInput: RiskAssessmentV4Input = {
      ...baseInput,
      data_grade: "C",
      mixed_grade: [],
    };
    const oOut = calculateRiskAssessmentV4(oInput);
    const cOut = calculateRiskAssessmentV4(cInput);
    // C 가중치 1.5 → 동일 risk 기반에서 C 의 위험 점수가 더 높아야 함
    expect(cOut.score).toBeGreaterThanOrEqual(oOut.score);
  });
});

describe("calculateRiskAssessmentV4 — N²SF 매핑 룰", () => {
  it("Test 3: MFA 미적용 + S 등급 → gap_controls 에 N2SF-MA-1 포함", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      mfa_enabled: "no",
      data_grade: "S",
      mixed_grade: [],
    };
    const out = calculateRiskAssessmentV4(input);
    expect(out.n2sf_compliance.gap_controls).toContain("N2SF-MA-1");
    expect(out.n2sf_compliance.gap_controls).toContain("N2SF-MA-2");
  });

  it("Test 4: 제로 트러스트 접속 → matched_controls 에 DA-3, DA-4, RA-2, EB-5 모두 포함", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      access_method: ["zero-trust"],
      mfa_enabled: "yes",
      data_grade: "O",
      mixed_grade: [],
    };
    const out = calculateRiskAssessmentV4(input);
    expect(out.n2sf_compliance.matched_controls).toContain("N2SF-DA-3");
    expect(out.n2sf_compliance.matched_controls).toContain("N2SF-DA-4");
    expect(out.n2sf_compliance.matched_controls).toContain("N2SF-RA-2");
    expect(out.n2sf_compliance.matched_controls).toContain("N2SF-EB-5");
  });

  it("Test 5: 모델 3 (SaaS) + C 등급 → gap_controls 에 N2SF-IF-14 포함 (등급 부적합)", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      service_model: "model3_saas_collab",
      data_grade: "C",
      mixed_grade: [],
    };
    const out = calculateRiskAssessmentV4(input);
    expect(out.n2sf_compliance.gap_controls).toContain("N2SF-IF-14");
  });
});

describe("calculateRiskAssessmentV4 — 출력 스키마/라벨", () => {
  it("version === 'v4' 이며 v3 필드(risks, maturity_model 등) 보존", () => {
    const out = calculateRiskAssessmentV4(baseInput);
    expect(out.version).toBe("v4");
    expect(out.maturity_model).toBeDefined();
    expect(out.risks.length).toBeGreaterThan(0);
    expect(out.executive_summary).toBeTruthy();
    expect(out.next_steps.length).toBeGreaterThan(0);
  });

  it("appropriateness_label 은 score 에 따라 ready/partial/early 중 하나", () => {
    const out = calculateRiskAssessmentV4(baseInput);
    expect(["ready", "partial", "early"]).toContain(out.appropriateness_label);
  });

  it("coverage_pct 는 0~100 범위", () => {
    const out = calculateRiskAssessmentV4(baseInput);
    expect(out.n2sf_compliance.coverage_pct).toBeGreaterThanOrEqual(0);
    expect(out.n2sf_compliance.coverage_pct).toBeLessThanOrEqual(100);
  });

  it("모델 3 선택 → recommended_controls 에 emphasis_controls 일부 포함 (matched 제외)", () => {
    const input: RiskAssessmentV4Input = {
      ...baseInput,
      service_model: "model3_saas_collab",
      data_grade: "O",
      mixed_grade: [],
    };
    const out = calculateRiskAssessmentV4(input);
    // 모델 3 emphasis: ["N2SF-EB-5","N2SF-EB-14","N2SF-IF-14","N2SF-RA-2","N2SF-DA-2"]
    // matched에 이미 들어간 항목은 recommended에서 제외되므로 길이만 검증
    expect(out.n2sf_compliance.recommended_controls.length).toBeGreaterThan(0);
  });
});
