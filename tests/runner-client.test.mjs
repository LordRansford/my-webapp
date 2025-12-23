import test from "node:test";
import assert from "node:assert/strict";
import { runInRunner } from "../src/lib/runner/client.core.js";

test("runInRunner returns not configured when RUNNER_BASE_URL is missing", async () => {
  const prev = process.env.RUNNER_BASE_URL;
  delete process.env.RUNNER_BASE_URL;
  const out = await runInRunner({
    toolId: "sandbox-echo",
    jobId: "job_test",
    payload: { message: "hi" },
    limits: { maxRunMs: 1000, maxOutputBytes: 10_000, maxMemoryMb: 64 },
  });
  assert.equal(out.ok, false);
  assert.equal(out.error.code, "RUNNER_NOT_CONFIGURED");
  if (prev) process.env.RUNNER_BASE_URL = prev;
});


