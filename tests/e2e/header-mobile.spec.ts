import { test, expect, devices } from "@playwright/test";

test.describe("mobile header", () => {
  test("hamburger menu does not cause horizontal overflow and sign in navigates", async ({ page }) => {
    const iphone = devices["iPhone 12"];
    await page.context().setDefaultTimeout(60_000);
    await page.setViewportSize(iphone.viewport!);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Trigger a small interaction so the auto-hiding header reveals itself.
    // This mirrors real mobile behaviour where the header appears on touch or movement.
    await page.mouse.move(5, 5);

    // Open hamburger menu
    await page.getByRole("button", { name: /open navigation menu/i }).click();

    // The page should not become horizontally scrollable
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(overflow).toBeFalsy();

    // Sign in should be reachable and tappable in the menu
    await page.getByRole("link", { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/signin(\?|$)/);

    // Sign in page should render a stable heading
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });
});

