import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase admin client
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((table: string) => {
  if (table === "tool_runs") return { insert: mockInsert };
  if (table === "leads") return { update: mockUpdate };
  return {};
});

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockFrom }),
}));

const { POST } = await import(
  "@/app/api/tools/risk-assessment/run/route"
);

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/tools/risk-assessment/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/tools/risk-assessment/run", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockResolvedValue({
      data: { id: "tool-run-uuid" },
      error: null,
    });
  });

  it("returns 400 if lead_id is missing", async () => {
    const res = await POST(
      makeRequest({ input: { platform: "vmware" } })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("required");
  });

  it("returns 400 if input is missing", async () => {
    const res = await POST(makeRequest({ lead_id: "uuid-1" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("required");
  });

  it("detects v3 from explicit version field", async () => {
    const v3Input = {
      platform: "vmware",
      vm_count: 100,
      host_count: 5,
      storage_type: "san",
      storage_migration: false,
      network_separation: false,
      ha_enabled: "yes",
      dr_site: "warm",
      rpo_target: "<=4h",
      rto_target: "<=4h",
      backup_exists: "yes",
      ops_staff_level: "mid",
      incident_response_maturity: "standard",
      change_management: "standard",
      documentation_level: "standard",
      automation_level: "standard",
      migration_rehearsal: "complete",
      access_method: ["vpn"],
      mfa_enabled: "yes",
    };

    const res = await POST(
      makeRequest({ lead_id: "uuid-1", input: v3Input, version: "v3" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tool_run_id).toBe("tool-run-uuid");
    expect(json.score).toBeGreaterThanOrEqual(0);
    expect(json.score).toBeLessThanOrEqual(100);
    expect(json.risk_level).toBeTruthy();
  });

  it("auto-detects v3 from input shape (host_count)", async () => {
    const v3Input = {
      platform: "vmware",
      vm_count: 100,
      host_count: 5,
      storage_type: "san",
      storage_migration: false,
      network_separation: false,
      ha_enabled: "yes",
      dr_site: "warm",
      rpo_target: "<=4h",
      rto_target: "<=4h",
      backup_exists: "yes",
      ops_staff_level: "mid",
      incident_response_maturity: "standard",
      change_management: "standard",
      documentation_level: "standard",
      automation_level: "standard",
      migration_rehearsal: "complete",
      access_method: ["vpn"],
      mfa_enabled: "yes",
    };

    const res = await POST(
      makeRequest({ lead_id: "uuid-1", input: v3Input })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.score).toBeGreaterThanOrEqual(0);
  });

  it("falls back to v2 for old-format input", async () => {
    const v2Input = {
      platform: "vmware",
      vm_count: 100,
      network_separation: false,
      storage_migration: false,
      backup_exists: true,
      downtime_tolerance: "night",
      ops_staff_level: "mid",
    };

    const res = await POST(
      makeRequest({ lead_id: "uuid-1", input: v2Input })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tool_run_id).toBe("tool-run-uuid");
    expect(json.score).toBeGreaterThanOrEqual(0);
  });

  it("updates lead score after scoring", async () => {
    const v2Input = {
      platform: "vmware",
      vm_count: 100,
      network_separation: false,
      storage_migration: false,
      backup_exists: true,
      downtime_tolerance: "night",
    };

    await POST(makeRequest({ lead_id: "uuid-1", input: v2Input }));

    expect(mockFrom).toHaveBeenCalledWith("leads");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ score: expect.any(Number) })
    );
  });

  it("returns 400 on tool_runs insert error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });

    const v2Input = {
      platform: "vmware",
      vm_count: 100,
      network_separation: false,
      storage_migration: false,
      backup_exists: true,
      downtime_tolerance: "night",
    };

    const res = await POST(
      makeRequest({ lead_id: "uuid-1", input: v2Input })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Insert failed");
  });
});
