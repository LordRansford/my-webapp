import { test, expect } from "@playwright/test";

/**
 * Mentor Contract Tests
 * 
 * Ensures Mentor API responses always conform to the canonical MentorResponse type.
 * Fails CI if any response shape is invalid.
 */

test.describe("Mentor Contract Tests", () => {
  function sameOriginHeaders(pageUrl: string) {
    const origin = new URL(pageUrl).origin;
    return {
      origin,
      referer: pageUrl,
    };
  }

  test("Normal question returns valid response", async ({ page }) => {
    await page.goto("/tools");
    await page.waitForLoadState("networkidle");

    const response = await page.request.post("/api/mentor/query", {
      headers: sameOriginHeaders(page.url()),
      data: {
        question: "How do I use the Python playground safely",
        pageUrl: "/tools/ai/python-playground",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Assert response structure
    expect(body).toHaveProperty("answer");
    expect(typeof body.answer).toBe("string");
    expect(body.answer.length).toBeGreaterThan(0);

    expect(body).toHaveProperty("answerMode");
    expect(["rag", "general-guidance", "fallback"]).toContain(body.answerMode);

    expect(body).toHaveProperty("citationsV2");
    expect(Array.isArray(body.citationsV2)).toBe(true);
    
    // Assert every citation has required fields
    for (const citation of body.citationsV2) {
      expect(citation).toHaveProperty("title");
      expect(citation).toHaveProperty("urlOrPath");
      expect(typeof citation.title).toBe("string");
      expect(typeof citation.urlOrPath).toBe("string");
      expect(citation.title.length).toBeGreaterThan(0);
      expect(citation.urlOrPath.length).toBeGreaterThan(0);
      
      // Assert no href key exists (old format)
      expect(citation).not.toHaveProperty("href");
    }
  });

  test("Nonsense question returns valid fallback", async ({ page }) => {
    await page.goto("/tools");
    await page.waitForLoadState("networkidle");

    const response = await page.request.post("/api/mentor/query", {
      headers: sameOriginHeaders(page.url()),
      data: {
        question: "asdfghjkl qwertyuiop zxcvbnm",
        pageUrl: "/tools",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Assert response structure
    expect(body).toHaveProperty("answer");
    expect(typeof body.answer).toBe("string");
    expect(body.answer.length).toBeGreaterThan(0);

    expect(body).toHaveProperty("answerMode");
    expect(["rag", "general-guidance", "fallback"]).toContain(body.answerMode);

    expect(body).toHaveProperty("citationsV2");
    expect(Array.isArray(body.citationsV2)).toBe(true);
    expect(body.citationsV2.length).toBeGreaterThan(0); // Must have at least one citation

    // Assert every citation has required fields
    for (const citation of body.citationsV2) {
      expect(citation).toHaveProperty("title");
      expect(citation).toHaveProperty("urlOrPath");
      expect(typeof citation.title).toBe("string");
      expect(typeof citation.urlOrPath).toBe("string");
    }
  });

  test("Empty index scenario returns valid fallback with citations", async ({ page }) => {
    await page.goto("/tools");
    await page.waitForLoadState("networkidle");

    const response = await page.request.post("/api/mentor/query", {
      headers: sameOriginHeaders(page.url()),
      data: {
        question: "xyzabc123 completely unknown topic",
        pageUrl: "/tools",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Assert response structure
    expect(body).toHaveProperty("answer");
    expect(typeof body.answer).toBe("string");
    expect(body.answer.length).toBeGreaterThan(0);

    expect(body).toHaveProperty("citationsV2");
    expect(Array.isArray(body.citationsV2)).toBe(true);
    expect(body.citationsV2.length).toBeGreaterThan(0); // Must have at least Tools hub citation

    // Assert at least one citation points to /tools
    const hasToolsHub = body.citationsV2.some((c: any) => c.urlOrPath === "/tools");
    expect(hasToolsHub).toBe(true);

    // Assert every citation has required fields
    for (const citation of body.citationsV2) {
      expect(citation).toHaveProperty("title");
      expect(citation).toHaveProperty("urlOrPath");
      expect(typeof citation.title).toBe("string");
      expect(typeof citation.urlOrPath).toBe("string");
    }
  });

  test("Response never has empty citationsV2", async ({ page }) => {
    await page.goto("/tools");
    await page.waitForLoadState("networkidle");

    const questions = [
      "How do I use the Python playground safely",
      "What is password entropy",
      "asdfghjkl qwertyuiop",
      "xyzabc123 completely unknown",
    ];

    for (const question of questions) {
      const response = await page.request.post("/api/mentor/query", {
        headers: sameOriginHeaders(page.url()),
        data: { question, pageUrl: "/tools" },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body).toHaveProperty("citationsV2");
      expect(Array.isArray(body.citationsV2)).toBe(true);
      expect(body.citationsV2.length).toBeGreaterThan(0); // Never empty
    }
  });
});

