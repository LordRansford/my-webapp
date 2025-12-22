import { test, expect } from "@playwright/test";

test("assistants: open mentor, ask, then open feedback and submit", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Mentor" }).click();
  await page.getByLabel("Ask about this page").fill("What is risk appetite");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Where this is covered on the site")).toBeVisible();
  await page.getByRole("button", { name: "Close mentor panel" }).click();

  await page.getByRole("button", { name: "Feedback" }).click();
  await page.getByLabel("Feedback").fill("Test feedback from e2e");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByText("Thank you. Your feedback has been received.")).toBeVisible();
});


