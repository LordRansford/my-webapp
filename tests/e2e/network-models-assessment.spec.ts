import { test, expect } from "@playwright/test";

test.describe("network models assessment", () => {
  test("assessment page loads and assistant is paused", async ({ page }) => {
    await page.goto("/network-models/assessment/foundations", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /network models certification assessment.*foundations/i }).first()).toBeVisible();
    await expect(page.getByText("Rules", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Time limit is 75 minutes.", { exact: true })).toBeVisible();

    // Professor Ransford must be hidden on assessment routes.
    await expect(page.locator('button[aria-label="Professor Ransford"]')).toHaveCount(0);

    // Feedback remains available.
    await expect(page.locator('button[aria-label="Feedback"]')).toBeVisible();
  });
});

