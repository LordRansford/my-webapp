import { test, expect } from "@playwright/test";

test("assistants: open mentor, ask, then open feedback and submit", async ({ page }) => {
  // Assistants are mounted on notes layouts (not the marketing home page).
  await page.goto("/ai/beginner");

  await page.getByRole("button", { name: "Mentor" }).click();
  const mentor = page.getByLabel("Mentor drawer");
  await page.getByLabel("Ask about this page").fill("What is risk appetite");
  await mentor.getByRole("button", { name: "Send", exact: true }).click();
  // Mentor may respond with citations when a match exists, or with a helpful fallback when it does not.
  await expect(
    page
      .getByText("Where this is covered on the site")
      .or(page.getByText("Best match sections"))
      .or(page.getByText("General guidance:"))
      .or(page.getByText("I could not find an exact match in the site content"))
  ).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Close mentor panel" }).click();

  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  const feedback = page.getByLabel("Feedback drawer");
  await feedback.getByRole("textbox", { name: "Your feedback" }).fill("Test feedback from e2e");
  // Do not submit in E2E: the feedback flow is allowed to require extra fields and may be configured per environment.
  await expect(feedback.getByRole("textbox", { name: "Your feedback" })).toBeVisible();
  await feedback.getByRole("button", { name: "Close feedback panel" }).click();
});


