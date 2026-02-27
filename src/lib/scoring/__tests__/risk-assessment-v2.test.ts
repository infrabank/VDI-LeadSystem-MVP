import { describe, it, expect } from "vitest";
import {
  runRiskAssessmentV2,
  type RiskAssessmentInput,
  type RiskAssessmentV2Output,
} from "../risk-assessment-v2";

const baseInput: RiskAssessmentInput = {
  platform: "vmware",
  vm_count: 100,
  network_separation: false,
  storage_migration: false,
  backup_exists: true,
  downtime_tolerance: "night",
  ops_staff_level: "mid",
};

describe("runRiskAssessmentV2", () => {
  it("returns version v2", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(result.version).toBe("v2");
  });

  it("returns score between 0 and 100", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("has valid risk_level", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(["low", "medium", "high", "critical"]).toContain(result.risk_level);
  });

  it("has maturity_model with 4 categories", () => {
    const result = runRiskAssessmentV2(baseInput);
    const mm = result.maturity_model;
    expect(mm).toHaveProperty("migration");
    expect(mm).toHaveProperty("dr");
    expect(mm).toHaveProperty("operations");
    expect(mm).toHaveProperty("automation");
  });

  it("maturity levels are 1-5", () => {
    const result = runRiskAssessmentV2(baseInput);
    const mm = result.maturity_model;
    for (const cat of [mm.migration, mm.dr, mm.operations, mm.automation]) {
      expect(cat.level).toBeGreaterThanOrEqual(1);
      expect(cat.level).toBeLessThanOrEqual(5);
      expect(cat.score).toBeGreaterThanOrEqual(0);
      expect(cat.score).toBeLessThanOrEqual(25);
    }
  });

  it("category scores sum to 100 - risk score", () => {
    const result = runRiskAssessmentV2(baseInput);
    const mm = result.maturity_model;
    const readiness = mm.migration.score + mm.dr.score + mm.operations.score + mm.automation.score;
    expect(result.score).toBe(100 - readiness);
  });

  it("has benchmark_text and benchmark_comparison", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(result.benchmark_text).toBeTruthy();
    expect(result.benchmark_comparison).toBeTruthy();
    expect(result.benchmark_text).toContain("내부 분석 기준");
  });

  it("generates 3-5 risk details", () => {
    const highRiskInput: RiskAssessmentInput = {
      ...baseInput,
      vm_count: 600,
      storage_migration: true,
      backup_exists: false,
      downtime_tolerance: "none",
      ops_staff_level: "low",
      network_separation: true,
      platform: "mixed",
    };
    const result = runRiskAssessmentV2(highRiskInput);
    expect(result.risks.length).toBeGreaterThanOrEqual(3);
    expect(result.risks.length).toBeLessThanOrEqual(5);
  });

  it("risk details have required fields", () => {
    const result = runRiskAssessmentV2({
      ...baseInput,
      storage_migration: true,
      backup_exists: false,
    });
    for (const risk of result.risks) {
      expect(risk).toHaveProperty("title");
      expect(risk).toHaveProperty("impact_scope");
      expect(risk).toHaveProperty("potential_impact");
      expect(risk).toHaveProperty("trigger_condition");
      expect(risk).toHaveProperty("likelihood");
      expect(["low", "medium", "high"]).toContain(risk.likelihood);
    }
  });

  it("has current_state_projection with 3 scenarios", () => {
    const result = runRiskAssessmentV2(baseInput);
    const proj = result.current_state_projection;
    expect(proj.short_term_risk).toBeTruthy();
    expect(proj.mid_term_risk).toBeTruthy();
    expect(proj.large_scale_event_risk).toBeTruthy();
  });

  it("has roadmap with 3 phases", () => {
    const result = runRiskAssessmentV2(baseInput);
    const rm = result.roadmap;
    for (const phase of [rm.phase_1, rm.phase_2, rm.phase_3]) {
      expect(phase.title).toBeTruthy();
      expect(phase.duration).toBeTruthy();
      expect(phase.actions.length).toBeGreaterThanOrEqual(2);
      expect(phase.actions.length).toBeLessThanOrEqual(3);
    }
  });

  it("has executive_summary string", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(result.executive_summary).toBeTruthy();
    expect(result.executive_summary.length).toBeGreaterThan(50);
  });

  it("has backward-compat risk_messages and next_steps", () => {
    const result = runRiskAssessmentV2(baseInput);
    expect(Array.isArray(result.risk_messages)).toBe(true);
    expect(Array.isArray(result.next_steps)).toBe(true);
  });

  it("high-risk input produces critical/high risk_level", () => {
    const result = runRiskAssessmentV2({
      ...baseInput,
      vm_count: 600,
      storage_migration: true,
      backup_exists: false,
      downtime_tolerance: "none",
      ops_staff_level: "low",
      network_separation: true,
      platform: "mixed",
    });
    expect(["high", "critical"]).toContain(result.risk_level);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("low-risk input produces low risk_level", () => {
    const result = runRiskAssessmentV2({
      ...baseInput,
      vm_count: 50,
      storage_migration: false,
      backup_exists: true,
      downtime_tolerance: "night",
      ops_staff_level: "high",
      network_separation: false,
      platform: "vmware",
    });
    expect(result.risk_level).toBe("low");
    expect(result.score).toBeLessThan(30);
  });

  it("benchmark comparison reflects score vs avg", () => {
    // Low risk, small VM count
    const low = runRiskAssessmentV2({
      ...baseInput,
      vm_count: 100,
      ops_staff_level: "high",
      backup_exists: true,
    });
    expect(low.benchmark_comparison).toContain("50~200 VM");

    // Large VM count
    const large = runRiskAssessmentV2({
      ...baseInput,
      vm_count: 600,
      storage_migration: true,
      backup_exists: false,
    });
    expect(large.benchmark_comparison).toContain("500+");
  });
});
