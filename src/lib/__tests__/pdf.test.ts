import { renderReportHtml } from "@/lib/pdf";

const testData = {
  company: "테스트 주식회사",
  date: "2026-02-27",
  score: 65,
  risk_level: "high",
  risks: ["스토리지 이관 리스크", "다운타임 제로 요구"],
  next_steps: ["PoC 환경 구축 권장", "롤백 시나리오 준비"],
  input: {
    platform: "vmware",
    vm_count: 300,
    network_separation: true,
    storage_migration: true,
    backup_exists: true,
    downtime_tolerance: "none",
    ops_staff_level: "mid",
  },
};

describe("renderReportHtml", () => {
  test("returns valid HTML string", () => {
    const result = renderReportHtml(testData);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/<!DOCTYPE html>|<html/i);
  });

  test("company name replaced", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("테스트 주식회사");
  });

  test("date replaced", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("2026-02-27");
  });

  test("score replaced", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("65");
  });

  test("risk level label replaced — high maps to 높음", () => {
    const result = renderReportHtml({ ...testData, risk_level: "high" });
    expect(result).toContain("높음");
  });

  test("risk level label replaced — critical maps to 매우 높음", () => {
    const result = renderReportHtml({ ...testData, risk_level: "critical" });
    expect(result).toContain("매우 높음");
  });

  test("risks rendered as HTML", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("스토리지 이관 리스크");
    expect(result).toContain("다운타임 제로 요구");
  });

  test("next steps rendered", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("PoC 환경 구축 권장");
    expect(result).toContain("롤백 시나리오 준비");
  });

  test("input table rendered with Korean labels", () => {
    const result = renderReportHtml(testData);
    expect(result).toContain("플랫폼");
    expect(result).toContain("VM 수");
  });

  test("no unreplaced placeholders remain", () => {
    const result = renderReportHtml(testData);
    expect(result).not.toContain("{{");
  });

  test("empty company defaults to dash", () => {
    const result = renderReportHtml({ ...testData, company: "" });
    expect(result).toContain("-");
  });
});
