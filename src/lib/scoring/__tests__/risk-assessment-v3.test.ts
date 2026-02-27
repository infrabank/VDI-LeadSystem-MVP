import { describe, it, expect } from "vitest";
import {
  runRiskAssessmentV3,
  type RiskAssessmentV3Output,
} from "../risk-assessment-v3";
import type { RiskAssessmentV3Input } from "@/lib/tools/risk-assessment/questions.v3";

const baseInput: RiskAssessmentV3Input = {
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
};

const highRiskInput: RiskAssessmentV3Input = {
  platform: "mixed",
  vm_count: 600,
  host_count: 20,
  concurrent_users: 500,
  storage_type: "local",
  storage_protocol: "unknown",
  storage_migration: true,
  multipath_configured: "no",
  network_separation: true,
  ha_enabled: "no",
  dr_site: "none",
  rpo_target: ">24h",
  rto_target: ">24h",
  backup_exists: "no",
  backup_frequency: "ad-hoc",
  ops_staff_level: "low",
  incident_response_maturity: "ad-hoc",
  change_management: "none",
  documentation_level: "none",
  automation_level: "none",
  provisioning_time: ">30m",
  migration_rehearsal: "none",
  access_method: ["direct"],
  mfa_enabled: "no",
  privileged_access_control: "none",
};

const lowRiskInput: RiskAssessmentV3Input = {
  platform: "vmware",
  vm_count: 50,
  host_count: 3,
  concurrent_users: 40,
  storage_type: "hci",
  storage_protocol: "nfs",
  storage_migration: false,
  multipath_configured: "yes",
  network_separation: false,
  ha_enabled: "yes",
  dr_site: "hot",
  rpo_target: "<=1h",
  rto_target: "<=1h",
  backup_exists: "yes",
  backup_frequency: "daily",
  ops_staff_level: "high",
  incident_response_maturity: "advanced",
  change_management: "strict",
  documentation_level: "excellent",
  automation_level: "high",
  provisioning_time: "<10m",
  migration_rehearsal: "complete",
  access_method: ["zero-trust", "vpn"],
  mfa_enabled: "yes",
  privileged_access_control: "strict",
};

describe("runRiskAssessmentV3", () => {
  it("returns version v3", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.version).toBe("v3");
  });

  it("returns score between 0 and 100", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("has valid risk_level", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(["low", "medium", "high", "critical"]).toContain(result.risk_level);
  });

  it("has maturity_model with 4 categories", () => {
    const result = runRiskAssessmentV3(baseInput);
    const mm = result.maturity_model;
    expect(mm).toHaveProperty("migration");
    expect(mm).toHaveProperty("dr");
    expect(mm).toHaveProperty("operations");
    expect(mm).toHaveProperty("automation");
  });

  it("maturity levels are 1-5 and scores 0-25", () => {
    const result = runRiskAssessmentV3(baseInput);
    const mm = result.maturity_model;
    for (const cat of [mm.migration, mm.dr, mm.operations, mm.automation]) {
      expect(cat.level).toBeGreaterThanOrEqual(1);
      expect(cat.level).toBeLessThanOrEqual(5);
      expect(cat.score).toBeGreaterThanOrEqual(0);
      expect(cat.score).toBeLessThanOrEqual(25);
    }
  });

  it("category scores sum to 100 - risk score", () => {
    const result = runRiskAssessmentV3(baseInput);
    const mm = result.maturity_model;
    const readiness = mm.migration.score + mm.dr.score + mm.operations.score + mm.automation.score;
    expect(result.score).toBe(100 - readiness);
  });

  it("has benchmark_text and benchmark_comparison", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.benchmark_text).toBeTruthy();
    expect(result.benchmark_comparison).toBeTruthy();
    expect(result.benchmark_text).toContain("내부 분석 기준");
  });

  it("generates at least 5 risk details", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.risks.length).toBeGreaterThanOrEqual(5);
    expect(result.risks.length).toBeLessThanOrEqual(8);
  });

  it("risk details have required fields including category", () => {
    const result = runRiskAssessmentV3(highRiskInput);
    for (const risk of result.risks) {
      expect(risk).toHaveProperty("title");
      expect(risk).toHaveProperty("impact_scope");
      expect(risk).toHaveProperty("potential_impact");
      expect(risk).toHaveProperty("trigger_condition");
      expect(risk).toHaveProperty("likelihood");
      expect(risk).toHaveProperty("category");
      expect(["low", "medium", "high"]).toContain(risk.likelihood);
      expect(["migration", "dr", "operations", "automation", "security"]).toContain(risk.category);
    }
  });

  it("has current_state_projection with 3 scenarios", () => {
    const result = runRiskAssessmentV3(baseInput);
    const proj = result.current_state_projection;
    expect(proj.short_term_risk).toBeTruthy();
    expect(proj.mid_term_risk).toBeTruthy();
    expect(proj.large_scale_event_risk).toBeTruthy();
  });

  it("has roadmap with 3 phases, each with 2-4 actions", () => {
    const result = runRiskAssessmentV3(baseInput);
    const rm = result.roadmap;
    for (const phase of [rm.phase_1, rm.phase_2, rm.phase_3]) {
      expect(phase.title).toBeTruthy();
      expect(phase.duration).toBeTruthy();
      expect(phase.actions.length).toBeGreaterThanOrEqual(2);
      expect(phase.actions.length).toBeLessThanOrEqual(4);
    }
  });

  it("has executive_summary mentioning 25개 항목", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.executive_summary).toBeTruthy();
    expect(result.executive_summary.length).toBeGreaterThan(50);
    expect(result.executive_summary).toContain("25개 항목");
  });

  it("has backward-compat risk_messages and next_steps", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(Array.isArray(result.risk_messages)).toBe(true);
    expect(result.risk_messages.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(result.next_steps)).toBe(true);
    expect(result.next_steps.length).toBeGreaterThanOrEqual(1);
  });

  it("high-risk input produces critical risk_level", () => {
    const result = runRiskAssessmentV3(highRiskInput);
    expect(["high", "critical"]).toContain(result.risk_level);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("low-risk input produces low risk_level", () => {
    const result = runRiskAssessmentV3(lowRiskInput);
    expect(result.risk_level).toBe("low");
    expect(result.score).toBeLessThan(26);
  });

  it("benchmark comparison reflects VM tier", () => {
    // Small: 50~200 VM
    const small = runRiskAssessmentV3(baseInput);
    expect(small.benchmark_comparison).toContain("50~200 VM");

    // Large: 500+ VM
    const large = runRiskAssessmentV3(highRiskInput);
    expect(large.benchmark_comparison).toContain("500+");
  });

  it("high-risk input generates many matched risks (not just generics)", () => {
    const result = runRiskAssessmentV3(highRiskInput);
    // With high-risk input, many conditions fire — should get 5+ risks with most being matched rules
    expect(result.risks.length).toBeGreaterThanOrEqual(5);
    // At least some should be high likelihood
    const highLikelihood = result.risks.filter((r) => r.likelihood === "high");
    expect(highLikelihood.length).toBeGreaterThanOrEqual(3);
  });

  it("projection reflects input conditions", () => {
    // High-risk with no rehearsal
    const result = runRiskAssessmentV3(highRiskInput);
    const proj = result.current_state_projection;
    // Should mention rehearsal/PoC given migration_rehearsal=none
    expect(proj.short_term_risk).toContain("리허설");
  });

  it("roadmap phases have correct titles and durations", () => {
    const result = runRiskAssessmentV3(baseInput);
    expect(result.roadmap.phase_1.title).toBe("즉시 조치");
    expect(result.roadmap.phase_1.duration).toBe("1~2주");
    expect(result.roadmap.phase_2.title).toBe("파일럿/기반 구축");
    expect(result.roadmap.phase_2.duration).toBe("1개월");
    expect(result.roadmap.phase_3.title).toBe("실행 및 안정화");
    expect(result.roadmap.phase_3.duration).toBe("3개월");
  });

  it("score level boundaries are correct", () => {
    // Test boundary: score < 26 = low
    const lowResult = runRiskAssessmentV3(lowRiskInput);
    expect(lowResult.score).toBeLessThan(26);
    expect(lowResult.risk_level).toBe("low");

    // Test high-risk boundary
    const highResult = runRiskAssessmentV3(highRiskInput);
    expect(highResult.score).toBeGreaterThanOrEqual(76);
    expect(highResult.risk_level).toBe("critical");
  });

  it("risk_messages are derived from risk titles", () => {
    const result = runRiskAssessmentV3(highRiskInput);
    for (const msg of result.risk_messages) {
      // Each risk_message should contain ":" separator (title: impact)
      expect(msg).toContain(":");
    }
  });
});
