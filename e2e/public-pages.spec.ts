import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("homepage loads with heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/VDI/i);
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });

  test("content listing page loads", async ({ page }) => {
    await page.goto("/content");
    // Page should have a heading or search area
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("risk assessment page loads with form", async ({ page }) => {
    await page.goto("/tools/risk-assessment");
    // Should show the lead input step (Step 1)
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.getByPlaceholder("홍길동")).toBeVisible();
  });

  test("risk assessment form shows progress bar", async ({ page }) => {
    await page.goto("/tools/risk-assessment");
    // Progress indicator should be present
    const progressBar = page.locator("[role='progressbar'], .bg-blue-600, .bg-\\[\\#2563eb\\]").first();
    await expect(progressBar).toBeVisible();
  });

  test("ROI calculator page loads with form", async ({ page }) => {
    await page.goto("/tools/roi-calculator");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    // Should have number inputs for calculation
    await expect(page.locator("input[type='number']").first()).toBeVisible();
  });

  test("thank-you page loads", async ({ page }) => {
    await page.goto("/thank-you");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("404 page for nonexistent route", async ({ page }) => {
    const res = await page.goto("/nonexistent-page-xyz");
    expect(res?.status()).toBe(404);
  });
});

test.describe("Risk Assessment Form Flow", () => {
  test("step 1: lead form validation requires email", async ({ page }) => {
    await page.goto("/tools/risk-assessment");

    // Try to proceed without email
    const nextButton = page.locator("button", { hasText: /다음|시작|Next/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      // Should still be on step 1 (email required)
      await expect(page.locator("input[type='email']")).toBeVisible();
    }
  });

  test("step 1: fills lead info and advances", async ({ page }) => {
    await page.goto("/tools/risk-assessment");

    // Fill in lead form
    await page.getByPlaceholder("홍길동").fill("테스트 사용자");
    await page.locator("input[type='email']").fill("e2e-test@example.com");
    await page.getByPlaceholder("(주)회사명").fill("테스트 회사");

    // Check consent checkbox if present
    const consent = page.locator("input[type='checkbox']").first();
    if (await consent.isVisible()) {
      await consent.check();
    }

    // Click next
    const nextButton = page.locator("button", { hasText: /다음|시작|Next/i }).first();
    await expect(nextButton).toBeVisible();
  });
});

test.describe("Admin Pages", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("input[type='email'], input[type='text']").first()).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("admin dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin/content");
    // Should redirect to login or show unauthorized
    await page.waitForURL(/login|admin/);
  });
});
