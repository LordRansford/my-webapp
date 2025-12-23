import test from "node:test";
import assert from "node:assert/strict";
import { validateCodeRunnerPayload } from "../src/lib/jobs/codeRunnerGuard.core.js";

test("code runner rejects oversized code", () => {
  const big = "a".repeat(7000);
  const out = validateCodeRunnerPayload({ language: "js", code: big });
  assert.equal(out.ok, false);
});

test("code runner rejects unknown language", () => {
  const out = validateCodeRunnerPayload({ language: "rb", code: "puts 1" });
  assert.equal(out.ok, false);
});

test("code runner rejects obvious network keywords", () => {
  const out = validateCodeRunnerPayload({ language: "js", code: "fetch('https://example.com')" });
  assert.equal(out.ok, false);
});


