import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { appendAnalyticsEvents, getUserAnalytics } from "../src/lib/analytics/store.core.js";

const STORE_PATH = process.env.ANALYTICS_STORE_PATH || "data/learning-analytics.json";

test("analytics store isolates users", async () => {
  const u1 = "user-a";
  const u2 = "user-b";

  appendAnalyticsEvents(u1, [{ type: "tool_used", toolId: "dns-lookup", timestamp: "2025-01-01T00:00:00.000Z" }]);
  appendAnalyticsEvents(u2, [{ type: "tool_used", toolId: "tls-inspect", timestamp: "2025-01-01T00:00:00.000Z" }]);

  const a = getUserAnalytics(u1);
  const b = getUserAnalytics(u2);

  assert.equal(a.userId, u1);
  assert.equal(b.userId, u2);
  assert.equal(a.events.some((e) => e.toolId === "dns-lookup"), true);
  assert.equal(a.events.some((e) => e.toolId === "tls-inspect"), false);
  assert.equal(b.events.some((e) => e.toolId === "tls-inspect"), true);
});

test("analytics store caps events", async () => {
  const u = "user-cap";
  const batch = Array.from({ length: 2500 }).map((_, i) => ({
    type: "quiz_attempted",
    quizId: `q-${i}`,
    timestamp: "2025-01-01T00:00:00.000Z",
  }));
  appendAnalyticsEvents(u, batch);
  const got = getUserAnalytics(u);
  assert.ok(got.events.length <= 2000);
});

test("analytics store writes a json file", async () => {
  assert.ok(fs.existsSync(STORE_PATH));
});


