import { calculateROIV2, type ROIV2Input } from "@/lib/scoring/roi-v2";

// Standard small-company input used for most tests
const BASE_INPUT: ROIV2Input = {
  total_users: 100,
  avg_hourly_cost: 30_000,
  avg_downtime_hours: 4,
  incidents_per_year: 6,
  current_backup: true,
  recovery_time_improvement_percent: 50,
  impact_rate_percent: 70,
  major_incident_hours: 24,
};

describe("calculateROIV2", () => {
  describe("Basic calculation accuracy", () => {
    it("computes annual_downtime, annual_loss, and annual_saving exactly", () => {
      const result = calculateROIV2(BASE_INPUT);

      // annual_downtime = 4 * 6 = 24
      expect(result.annual_downtime).toBe(24);

      // annual_loss = 100 * 30000 * 24 * (70 / 100) = 50,400,000
      expect(result.annual_loss).toBe(50_400_000);

      // improved_downtime = 24 * (1 - 50/100) = 12
      expect(result.improved_downtime).toBe(12);

      // improved_annual_loss = 100 * 30000 * 12 * 0.70 = 25,200,000
      expect(result.improved_annual_loss).toBe(25_200_000);

      // annual_saving = 50,400,000 - 25,200,000 = 25,200,000
      expect(result.annual_saving).toBe(25_200_000);
    });
  });

  describe("3-year cumulative", () => {
    it("loss_3y equals annual_loss * 3", () => {
      const result = calculateROIV2(BASE_INPUT);
      expect(result.loss_3y).toBe(result.annual_loss * 3);
      expect(result.loss_3y).toBe(151_200_000);
    });

    it("saving_3y equals annual_saving * 3", () => {
      const result = calculateROIV2(BASE_INPUT);
      expect(result.saving_3y).toBe(result.annual_saving * 3);
      expect(result.saving_3y).toBe(75_600_000);
    });
  });

  describe("Major incident calculation", () => {
    it("major_incident_loss = total_users * avg_hourly_cost * major_incident_hours * (impact_rate / 100)", () => {
      const result = calculateROIV2(BASE_INPUT);
      // 100 * 30000 * 24 * 0.70 = 50,400,000
      expect(result.major_incident_loss).toBe(50_400_000);
    });

    it("major_incident_loss scales with major_incident_hours", () => {
      const result = calculateROIV2({ ...BASE_INPUT, major_incident_hours: 8 });
      // 100 * 30000 * 8 * 0.70 = 16,800,000
      expect(result.major_incident_loss).toBe(16_800_000);
    });
  });

  describe("Investment range with backup", () => {
    it("uses base 20-40M and 150-300K/user when current_backup = true", () => {
      const result = calculateROIV2({ ...BASE_INPUT, current_backup: true });

      // investment_low = 20,000,000 + 100 * 150,000 = 35,000,000
      expect(result.investment_low).toBe(35_000_000);

      // investment_high = 40,000,000 + 100 * 300,000 = 70,000,000
      expect(result.investment_high).toBe(70_000_000);

      expect(result.assumptions.base_cost_low).toBe(20_000_000);
      expect(result.assumptions.base_cost_high).toBe(40_000_000);
      expect(result.assumptions.per_user_low).toBe(150_000);
      expect(result.assumptions.per_user_high).toBe(300_000);
    });
  });

  describe("Investment range without backup", () => {
    it("uses base 30-60M and 200-400K/user when current_backup = false", () => {
      const result = calculateROIV2({ ...BASE_INPUT, current_backup: false });

      // investment_low = 30,000,000 + 100 * 200,000 = 50,000,000
      expect(result.investment_low).toBe(50_000_000);

      // investment_high = 60,000,000 + 100 * 400,000 = 100,000,000
      expect(result.investment_high).toBe(100_000_000);

      expect(result.assumptions.base_cost_low).toBe(30_000_000);
      expect(result.assumptions.base_cost_high).toBe(60_000_000);
      expect(result.assumptions.per_user_low).toBe(200_000);
      expect(result.assumptions.per_user_high).toBe(400_000);
    });
  });

  describe("Grade: critical", () => {
    it("returns grade 'critical' when annual_loss >= 500,000,000", () => {
      // annual_loss = 1000 * 50000 * 20 * 0.70 = 700,000,000 >= 500M
      const result = calculateROIV2({
        ...BASE_INPUT,
        total_users: 1000,
        avg_hourly_cost: 50_000,
        avg_downtime_hours: 20,
        incidents_per_year: 1,
        impact_rate_percent: 70,
      });
      expect(result.annual_loss).toBeGreaterThanOrEqual(500_000_000);
      expect(result.grade).toBe("critical");
    });
  });

  describe("Grade: high", () => {
    it("returns grade 'high' when 100M <= annual_loss < 500M", () => {
      // annual_loss = 500 * 30000 * 10 * 1.0 = 150,000,000
      const result = calculateROIV2({
        ...BASE_INPUT,
        total_users: 500,
        avg_hourly_cost: 30_000,
        avg_downtime_hours: 10,
        incidents_per_year: 1,
        impact_rate_percent: 100,
      });
      expect(result.annual_loss).toBeGreaterThanOrEqual(100_000_000);
      expect(result.annual_loss).toBeLessThan(500_000_000);
      expect(result.grade).toBe("high");
    });
  });

  describe("Grade: low", () => {
    it("returns grade 'low' when annual_loss < 30,000,000", () => {
      // annual_loss = 10 * 10000 * 1 * 0.10 = 10,000 << 30M
      const result = calculateROIV2({
        ...BASE_INPUT,
        total_users: 10,
        avg_hourly_cost: 10_000,
        avg_downtime_hours: 1,
        incidents_per_year: 1,
        impact_rate_percent: 10,
      });
      expect(result.annual_loss).toBeLessThan(30_000_000);
      expect(result.grade).toBe("low");
    });
  });

  describe("Payback calculation", () => {
    it("computes payback_low_years and payback_high_years correctly", () => {
      const result = calculateROIV2(BASE_INPUT);

      // payback_low = round((35,000,000 / 25,200,000) * 10) / 10
      //             = round(13.888...) / 10 = 14 / 10 = 1.4
      expect(result.payback_low_years).toBe(1.4);

      // payback_high = round((70,000,000 / 25,200,000) * 10) / 10
      //              = round(27.777...) / 10 = 28 / 10 = 2.8
      expect(result.payback_high_years).toBe(2.8);
    });
  });

  describe("Payback null when saving is 0", () => {
    it("returns null for both payback fields when recovery_time_improvement_percent is 0", () => {
      const result = calculateROIV2({
        ...BASE_INPUT,
        recovery_time_improvement_percent: 0,
      });
      expect(result.annual_saving).toBe(0);
      expect(result.payback_low_years).toBeNull();
      expect(result.payback_high_years).toBeNull();
    });
  });

  describe("Formatted values", () => {
    it("all formatted fields are non-empty strings", () => {
      const result = calculateROIV2(BASE_INPUT);
      const { formatted } = result;

      expect(typeof formatted.annual_loss).toBe("string");
      expect(formatted.annual_loss.length).toBeGreaterThan(0);

      expect(typeof formatted.annual_saving).toBe("string");
      expect(formatted.annual_saving.length).toBeGreaterThan(0);

      expect(typeof formatted.improved_annual_loss).toBe("string");
      expect(formatted.improved_annual_loss.length).toBeGreaterThan(0);

      expect(typeof formatted.loss_3y).toBe("string");
      expect(formatted.loss_3y.length).toBeGreaterThan(0);

      expect(typeof formatted.saving_3y).toBe("string");
      expect(formatted.saving_3y.length).toBeGreaterThan(0);

      expect(typeof formatted.major_incident_loss).toBe("string");
      expect(formatted.major_incident_loss.length).toBeGreaterThan(0);

      expect(typeof formatted.investment_low).toBe("string");
      expect(formatted.investment_low.length).toBeGreaterThan(0);

      expect(typeof formatted.investment_high).toBe("string");
      expect(formatted.investment_high.length).toBeGreaterThan(0);

      expect(typeof formatted.investment_range).toBe("string");
      expect(formatted.investment_range.length).toBeGreaterThan(0);

      expect(typeof formatted.payback_range).toBe("string");
      expect(formatted.payback_range.length).toBeGreaterThan(0);
    });
  });

  describe("Version field", () => {
    it("output.version is 'v2'", () => {
      const result = calculateROIV2(BASE_INPUT);
      expect(result.version).toBe("v2");
    });
  });

  describe("Benchmark comparison", () => {
    it("benchmark_comparison contains '평균 대비' text when loss is above average threshold", () => {
      // For 100-user segment, avgLoss = 50M. annual_loss = 50.4M.
      // 50.4M >= 50M * 1.3 = 65M? No. 50.4M <= 50M * 0.7 = 35M? No. → "평균 수준"
      // Use a higher loss to trigger "평균 대비 높음"
      // 100 users * 30000 * 50h/yr * 0.70 = 105,000,000 >= 65M → "평균 대비 높음"
      const result = calculateROIV2({
        ...BASE_INPUT,
        avg_downtime_hours: 25,
        incidents_per_year: 2,
        // annual_loss = 100 * 30000 * 50 * 0.70 = 105,000,000
      });
      expect(result.annual_loss).toBeGreaterThanOrEqual(65_000_000);
      expect(result.benchmark_comparison).toContain("평균 대비");
    });

    it("benchmark_text is non-empty", () => {
      const result = calculateROIV2(BASE_INPUT);
      expect(result.benchmark_text.length).toBeGreaterThan(0);
    });
  });
});
