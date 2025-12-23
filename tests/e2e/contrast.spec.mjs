import { test, expect } from "@playwright/test";

async function getColors(page, selector) {
  return await page.locator(selector).first().evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { color: cs.color, backgroundColor: cs.backgroundColor };
  });
}

test("key pages have readable heading contrast (text not same as background)", async ({ page }) => {
  const routes = ["/", "/ai", "/courses"];
  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState("domcontentloaded");

    // Prefer a main heading; fallback to header.
    const selector = (await page.locator("main h1").count()) ? "main h1" : "header";
    const { color, backgroundColor } = await getColors(page, selector);

    expect(color).toBeTruthy();
    expect(backgroundColor).toBeTruthy();
    expect(color).not.toEqual(backgroundColor);
  }
});


