import { test, expect } from "@playwright/test";

test("assistants: open professor, ask, then open feedback", async ({ page }) => {
  // Assistants are mounted on notes layouts (not the marketing home page).
  await page.goto("/ai/beginner");

  await page.getByRole("button", { name: "Professor Ransford" }).click();
  const professor = page.getByLabel("Professor drawer");
  await professor.getByLabel("Ask a question").fill("What is digitalisation");
  await professor.getByRole("button", { name: "Send", exact: true }).click();

  await expect(
    professor
      .getByText("Digitalisation is", { exact: false })
      .or(professor.getByText("Best next pages on this site.", { exact: true }))
      .or(professor.getByText("Where this is covered on the site", { exact: true }))
  ).toBeVisible({ timeout: 20_000 });

  await professor.getByRole("button", { name: "Close professor panel" }).click();

  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  const feedback = page.getByLabel("Feedback drawer");
  await feedback.getByRole("textbox", { name: "Your feedback" }).fill("Test feedback from e2e");
  // Do not submit in E2E: the feedback flow is allowed to require extra fields and may be configured per environment.
  await expect(feedback.getByRole("textbox", { name: "Your feedback" })).toBeVisible();
  await feedback.getByRole("button", { name: "Close feedback panel" }).click();
});


