import {
  runRiskAssessment,
  type RiskAssessmentInput,
} from "@/lib/scoring/risk-assessment";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_LOW: RiskAssessmentInput = {
  platform: "vmware",
  vm_count: 50,
  network_separation: false,
  storage_migration: false,
  backup_exists: true,
  downtime_tolerance: "night",
  ops_staff_level: "mid",
};

// All rules fire simultaneously:
// mixed(+10) + vm>=500(+15) + storage_migration(+20) + none(+20)
// + !backup(+15) + network_sep(+10) + low_staff(+10) = 100
const ALL_FLAGS: RiskAssessmentInput = {
  platform: "mixed",
  vm_count: 500,
  network_separation: true,
  storage_migration: true,
  backup_exists: false,
  downtime_tolerance: "none",
  ops_staff_level: "low",
};

// ---------------------------------------------------------------------------
// 1. Low risk scenario
// ---------------------------------------------------------------------------
describe("runRiskAssessment", () => {
  it("returns low risk for minimal inputs", () => {
    const result = runRiskAssessment(BASE_LOW);

    expect(result.score).toBeLessThan(30);
    expect(result.risk_level).toBe("low");
    expect(result.risks).toHaveLength(0);
  });

  // -------------------------------------------------------------------------
  // 2. Critical risk scenario
  // -------------------------------------------------------------------------
  it("returns critical risk for worst-case inputs with score capped at 100", () => {
    const result = runRiskAssessment(ALL_FLAGS);

    expect(result.score).toBe(100);
    expect(result.risk_level).toBe("critical");
  });

  // -------------------------------------------------------------------------
  // 3. Medium risk scenario
  // -------------------------------------------------------------------------
  it("returns medium risk for moderate inputs (score 30-49)", () => {
    // storage_migration(+20) + network_separation(+10) = 30
    const input: RiskAssessmentInput = {
      ...BASE_LOW,
      storage_migration: true,
      network_separation: true,
    };
    const result = runRiskAssessment(input);

    expect(result.score).toBeGreaterThanOrEqual(30);
    expect(result.score).toBeLessThan(50);
    expect(result.risk_level).toBe("medium");
  });

  // -------------------------------------------------------------------------
  // 4. High risk scenario
  // -------------------------------------------------------------------------
  it("returns high risk when several flags are active (score 50-69)", () => {
    // vm 200-499(+8) + storage_migration(+20) + none(+20) + network_sep(+10) = 58
    const input: RiskAssessmentInput = {
      ...BASE_LOW,
      vm_count: 300,
      storage_migration: true,
      downtime_tolerance: "none",
      network_separation: true,
    };
    const result = runRiskAssessment(input);

    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThan(70);
    expect(result.risk_level).toBe("high");
  });

  // -------------------------------------------------------------------------
  // 5. Score clamping — never exceeds 100
  // -------------------------------------------------------------------------
  it("clamps the score to 100 even when all rules fire", () => {
    const result = runRiskAssessment(ALL_FLAGS);

    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  // -------------------------------------------------------------------------
  // 6. Risks are sorted by score descending
  // -------------------------------------------------------------------------
  it("returns risks sorted by rule score descending", () => {
    // Use critical scenario — 7 rules fire, top 5 returned sorted desc
    // Scores of matched rules: 20, 20, 15, 15, 10, 10, 10
    // Top 5 after sort: [20, 20, 15, 15, 10]
    const result = runRiskAssessment(ALL_FLAGS);

    // The first two risks must be the score-20 rules:
    // "스토리지 이관..." and "다운타임 허용이 없어..."
    const storageMsgFragment = "스토리지 이관";
    const downtimeMsgFragment = "다운타임 허용이 없어";

    expect(result.risks[0]).toMatch(
      new RegExp(`${storageMsgFragment}|${downtimeMsgFragment}`)
    );
    expect(result.risks[1]).toMatch(
      new RegExp(`${storageMsgFragment}|${downtimeMsgFragment}`)
    );

    // The 3rd and 4th must be score-15 rules:
    // "VM 수가 500대..." and "백업 체계 부재..."
    const vm500MsgFragment = "VM 수가 500대";
    const backupMsgFragment = "백업 체계 부재";

    expect(result.risks[2]).toMatch(
      new RegExp(`${vm500MsgFragment}|${backupMsgFragment}`)
    );
    expect(result.risks[3]).toMatch(
      new RegExp(`${vm500MsgFragment}|${backupMsgFragment}`)
    );
  });

  // -------------------------------------------------------------------------
  // 7. Max 5 risks returned even when all 10 rules could fire
  // -------------------------------------------------------------------------
  it("returns at most 5 risks even when all rules fire", () => {
    // Add xenserver (but xenserver conflicts with mixed; use a separate scenario
    // where we get 6+ matched rules without conflicting conditions)
    // xenserver(+5) + vm>=500(+15) + storage_migration(+20) + none(+20)
    // + !backup(+15) + network_sep(+10) + low_staff(+10) = 95 → 7 rules
    const input: RiskAssessmentInput = {
      platform: "xenserver",
      vm_count: 600,
      network_separation: true,
      storage_migration: true,
      backup_exists: false,
      downtime_tolerance: "none",
      ops_staff_level: "low",
    };
    const result = runRiskAssessment(input);

    expect(result.risks.length).toBeLessThanOrEqual(5);
  });

  // -------------------------------------------------------------------------
  // 8. Next steps include PoC for critical risk
  // -------------------------------------------------------------------------
  it("includes a PoC step in next_steps for critical risk level", () => {
    const result = runRiskAssessment(ALL_FLAGS);

    expect(result.risk_level).toBe("critical");
    const hasPoc = result.next_steps.some((step) => step.includes("PoC"));
    expect(hasPoc).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 9. Next steps include backup reminder when backup_exists is false
  // -------------------------------------------------------------------------
  it("includes a backup step in next_steps when backup_exists is false", () => {
    const input: RiskAssessmentInput = {
      ...BASE_LOW,
      backup_exists: false,
    };
    const result = runRiskAssessment(input);

    const hasBackupStep = result.next_steps.some((step) =>
      step.includes("백업")
    );
    expect(hasBackupStep).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 10. Rollback step is appended as the last generated step
  //
  // generateNextSteps always appends "이관 일정과 롤백 시나리오를 문서화하세요"
  // before the final .slice(0, 5). When fewer than 5 earlier steps fire, the
  // rollback step appears in the output. For the low-risk BASE_LOW scenario
  // only 2 earlier steps fire (checklist + rollback), so rollback is present.
  // For a critical scenario where 5 earlier steps already fill the slice, the
  // rollback step is cut off — this is expected behaviour.
  // -------------------------------------------------------------------------
  it("includes a rollback step in next_steps when there is room (low risk)", () => {
    const result = runRiskAssessment(BASE_LOW);

    const hasRollback = result.next_steps.some((step) =>
      step.includes("롤백")
    );
    expect(hasRollback).toBe(true);
  });

  it("rollback step is the last item in next_steps for low risk", () => {
    const result = runRiskAssessment(BASE_LOW);
    const last = result.next_steps[result.next_steps.length - 1];

    expect(last).toContain("롤백");
  });
});
