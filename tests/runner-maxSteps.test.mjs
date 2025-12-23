import test from "node:test";
import assert from "node:assert/strict";

test("runner request supports maxSteps in limits shape", () => {
  /** @type {import('../src/lib/runner/types').RunnerJobRequest} */
  const req = {
    toolId: "code-runner",
    jobId: "test",
    payload: { language: "js", code: "1+1" },
    limits: { maxRunMs: 1000, maxOutputBytes: 1000, maxMemoryMb: 64, maxSteps: 123 },
  };
  assert.equal(req.limits.maxSteps, 123);
});


