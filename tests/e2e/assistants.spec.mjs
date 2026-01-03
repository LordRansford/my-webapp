import { test, expect } from "@playwright/test";

test("assistants: open professor, ask, then open feedback", async ({ page }) => {
  // Assistants are mounted on notes layouts (not the marketing home page).
  await page.goto("/ai/beginner");

  const professorLauncher = page.locator('button[aria-label="Professor Ransford"]');
  await expect(professorLauncher).toBeVisible({ timeout: 20_000 });
  await professorLauncher.click();

  const professor = page.getByLabel("Professor drawer");
  await professor.getByLabel("Ask a question").fill("What is digitalisation");
  await professor.getByRole("button", { name: "Send", exact: true }).click();

  await expect(professor.getByText("Digitalisation is", { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  await expect(professor.getByText("Where this is covered on the site", { exact: true })).toBeVisible({ timeout: 20_000 });

  await professor.getByRole("button", { name: "Close professor panel" }).click();

  const feedbackLauncher = page.locator('button[aria-label="Feedback"]');
  await expect(feedbackLauncher).toBeVisible({ timeout: 20_000 });
  await feedbackLauncher.click();
  const feedback = page.getByLabel("Feedback drawer");
  await feedback.getByRole("textbox", { name: "Your feedback" }).fill("Test feedback from e2e");
  // Do not submit in E2E: the feedback flow is allowed to require extra fields and may be configured per environment.
  await expect(feedback.getByRole("textbox", { name: "Your feedback" })).toBeVisible();
  await feedback.getByRole("button", { name: "Close feedback panel" }).click();
});


