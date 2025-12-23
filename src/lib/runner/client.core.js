import { safeFetch, SafeFetchBlockedError, SafeFetchTimeoutError } from "../net/safeFetch.core.js";

const NOT_AVAILABLE_MESSAGE = "This feature is not available yet. We are preparing the secure compute runner.";

export async function runInRunner(request) {
  const base = process.env.RUNNER_BASE_URL || "";
  if (!base) {
    return { ok: false, metrics: { runMs: 0 }, error: { code: "RUNNER_NOT_CONFIGURED", message: NOT_AVAILABLE_MESSAGE } };
  }

  const url = new URL("/run", base).toString();
  const maxOutputBytes = Math.max(1, Math.min(200_000, request.limits.maxOutputBytes));
  const maxRunMs = Math.max(1, Math.min(30_000, request.limits.maxRunMs));
  const maxSteps = request?.limits?.maxSteps;

  const started = Date.now();
  try {
    const { res, body } = await safeFetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-job-id": request.jobId,
        "x-tool-id": request.toolId,
      },
      body: JSON.stringify({ ...request, limits: { ...request.limits, maxOutputBytes, maxRunMs, maxSteps } }),
      maxResponseBytes: maxOutputBytes,
      overallTimeoutMs: maxRunMs + 1500,
      allowHttpInDev: true,
      allowLocalhostInDev: true,
    });

    const parsed = JSON.parse(body.toString("utf8"));
    if (!parsed || typeof parsed.ok !== "boolean") {
      return { ok: false, metrics: { runMs: Date.now() - started }, error: { code: "RUNNER_BAD_RESPONSE", message: "Runner returned an invalid response." } };
    }
    if (!res.ok) {
      return { ok: false, metrics: parsed.metrics || { runMs: Date.now() - started }, error: parsed.error || { code: "RUNNER_ERROR", message: "Runner returned an error." }, stderr: parsed.stderr };
    }
    return parsed;
  } catch (err) {
    const runMs = Date.now() - started;
    if (err instanceof SafeFetchBlockedError) return { ok: false, metrics: { runMs }, error: { code: err.code, message: "Runner request blocked." } };
    if (err instanceof SafeFetchTimeoutError) return { ok: false, metrics: { runMs }, error: { code: err.code, message: "Runner request timed out." } };
    return { ok: false, metrics: { runMs }, error: { code: "RUNNER_UNAVAILABLE", message: NOT_AVAILABLE_MESSAGE } };
  }
}


