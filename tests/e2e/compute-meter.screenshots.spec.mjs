import { test, expect } from "@playwright/test";

test("compute meter screenshots (free, paid, blocked)", async ({ page }) => {
  await page.goto("/compute/demo");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("h1")).toContainText("Compute meter examples");

  const free = page.locator("#free-run");
  const paid = page.locator("#paid-run");
  const blocked = page.locator("#blocked-run");

  await expect(free).toContainText("Free tier run");
  await expect(paid).toContainText("Paid tier run");
  await expect(blocked).toContainText("Blocked due to insufficient credits");

  await free.screenshot({ path: "test-results/compute-meter-free.png" });
  await paid.screenshot({ path: "test-results/compute-meter-paid.png" });
  await blocked.screenshot({ path: "test-results/compute-meter-blocked.png" });
});


