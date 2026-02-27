import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase admin client
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockUpsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({ upsert: mockUpsert }));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockFrom }),
}));

// Import AFTER mocking
const { POST } = await import("@/app/api/leads/route");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if email is missing", async () => {
    const res = await POST(makeRequest({ name: "Test" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Email");
  });

  it("returns 201 on successful upsert", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "uuid-1", email: "test@example.com" },
      error: null,
    });

    const res = await POST(
      makeRequest({
        email: "test@example.com",
        name: "Test User",
        company: "ACME",
        consent_marketing: true,
      })
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.id).toBe("uuid-1");
    expect(json.email).toBe("test@example.com");
  });

  it("calls upsert with onConflict email", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "uuid-1", email: "test@example.com" },
      error: null,
    });

    await POST(
      makeRequest({
        email: "test@example.com",
        name: "Test",
        source: "seo",
      })
    );

    expect(mockFrom).toHaveBeenCalledWith("leads");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com", source: "seo" }),
      { onConflict: "email" }
    );
  });

  it("returns 400 on supabase error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("DB error");
  });

  it("defaults source to 'direct' when not provided", async () => {
    mockSingle.mockResolvedValue({
      data: { id: "uuid-1", email: "a@b.com" },
      error: null,
    });

    await POST(makeRequest({ email: "a@b.com" }));

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ source: "direct" }),
      expect.anything()
    );
  });
});
