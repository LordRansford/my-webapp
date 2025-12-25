import { test, expect } from "@playwright/test";

/**
 * Mentor Contract Tests
 * 
 * Ensures Mentor API responses always conform to the canonical MentorResponse type.
 * Fails CI if any response shape is invalid.
 */

test.describe("Mentor Contract Tests", () => {
  test("Normal question returns valid response", async ({ request }) => {
    const response = await request.post("http://127.0.0.1:3000/api/mentor/query", {
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

    // Assert no href key exists anywhere in response
    const responseStr = JSON.stringify(body);
    expect(responseStr).not.toContain('"href"');
  });

  test("Nonsense question returns valid fallback", async ({ request }) => {
    const response = await request.post("http://127.0.0.1:3000/api/mentor/query", {
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

    // Assert no href key exists
    const responseStr = JSON.stringify(body);
    expect(responseStr).not.toContain('"href"');
  });

  test("Empty index scenario returns valid fallback with citations", async ({ request }) => {
    const response = await request.post("http://127.0.0.1:3000/api/mentor/query", {
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

    // Assert no href key exists
    const responseStr = JSON.stringify(body);
    expect(responseStr).not.toContain('"href"');
  });

  test("Response never has empty citationsV2", async ({ request }) => {
    const questions = [
      "How do I use the Python playground safely",
      "What is password entropy",
      "asdfghjkl qwertyuiop",
      "xyzabc123 completely unknown",
    ];

    for (const question of questions) {
      const response = await request.post("http://127.0.0.1:3000/api/mentor/query", {
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

