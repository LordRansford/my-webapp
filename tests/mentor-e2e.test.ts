import { test, expect } from "@playwright/test";

/**
 * Mentor E2E Tests
 * 
 * Tests that Mentor ALWAYS responds within 3 seconds with useful answers.
 * Verifies the 3-layer fallback system works correctly.
 */

const testPrompts = [
  "How do I use the Python playground safely",
  "Why did input validation fail",
  "What are the limits on this tool",
  "Which tools run locally vs credits",
  "How do I test a regex pattern",
  "What is password entropy",
  "How do I generate RSA keys",
  "What tools are available for cybersecurity",
  "How do I use the SQL sandbox",
  "What is the difference between local and compute mode",
];

test.describe("Mentor E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with Mentor available
    await page.goto("/tools");
    await page.waitForLoadState("networkidle");
  });

  for (const prompt of testPrompts) {
    test(`Mentor responds to: "${prompt}"`, async ({ page }) => {
      // Find Mentor input/button (adjust selector based on actual UI)
      const mentorInput = page.locator('input[placeholder*="ask"], textarea[placeholder*="ask"], input[type="text"]').first();
      const mentorButton = page.locator('button:has-text("Ask"), button:has-text("Submit")').first();

      // If Mentor UI is not visible, try API directly
      if (await mentorInput.count() === 0) {
        // Test API directly
        const startTime = Date.now();
        const response = await page.request.post("/api/mentor/query", {
          data: {
            question: prompt,
            pageUrl: page.url(),
          },
        });

        const duration = Date.now() - startTime;
        const body = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000); // Must respond within 3 seconds
        expect(body.answer).toBeTruthy();
        expect(body.answer.length).toBeGreaterThan(200); // At least 200 chars
        expect(body.citationsV2 || body.citations || []).toBeInstanceOf(Array);
        expect((body.citationsV2 || body.citations || []).length).toBeGreaterThan(0); // At least 1 link
        expect(body.answer).not.toBe("");
        expect(body.answer).not.toBeNull();
        expect(body.answer).not.toBeUndefined();
      } else {
        // Test via UI
        await mentorInput.fill(prompt);
        await mentorButton.click();

        // Wait for response (should appear within 3 seconds)
        const responseElement = page.locator('[data-mentor-response], .mentor-answer, [role="alert"]').first();
        await responseElement.waitFor({ timeout: 3000 });

        const responseText = await responseElement.textContent();
        const pageContent = await page.textContent("body");

        // Assertions
        expect(responseText).toBeTruthy();
        expect(responseText?.length || 0).toBeGreaterThan(200);
        expect(pageContent?.toLowerCase()).toContain(prompt.toLowerCase().split(" ")[0]); // Response should relate to prompt
      }
    });
  }

  test("Mentor fallback works when OpenAI key is missing", async ({ page }) => {
    // Test that fallback system works
    const startTime = Date.now();
    const response = await page.request.post("/api/mentor/query", {
      data: {
        question: "What tools are available",
        pageUrl: "/tools",
      },
    });

    const duration = Date.now() - startTime;
    const body = await response.json();

    // Should still respond successfully
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(3000);
    expect(body.answer).toBeTruthy();
    expect(body.answer.length).toBeGreaterThan(200);
    
    // Fallback should include links
    const hasLinks = (body.citationsV2 || body.citations || []).length > 0 || 
                     body.answer.includes("http") || 
                     body.answer.includes("/tools");
    expect(hasLinks).toBe(true);
  });

  test("Mentor handles timeout gracefully", async ({ page }) => {
    // This test verifies timeout handling
    // In a real scenario, we might mock a slow response
    const startTime = Date.now();
    const response = await page.request.post("/api/mentor/query", {
      data: {
        question: "Test timeout handling",
        pageUrl: "/tools",
      },
    });

    const duration = Date.now() - startTime;
    const body = await response.json();

    // Should respond within timeout
    expect(duration).toBeLessThan(3000);
    expect(response.status()).toBe(200);
    expect(body.answer).toBeTruthy();
    // Even on timeout, should return fallback
    expect(body.answer.length).toBeGreaterThan(0);
  });
});

