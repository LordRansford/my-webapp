import { JobDeniedError } from "@/lib/jobs/errors";
import { createJobEvent } from "@/lib/jobs/jobEvents";
import { validateCodeRunnerPayloadTs } from "@/lib/jobs/codeRunnerGuard";
import { runComputeJob } from "@/lib/compute/runner";

const RUNNER_NOT_AVAILABLE_MESSAGE = "This feature is not available yet. We are preparing the secure compute runner.";

export type JobHandler = (params: { jobId: string; payload: any; userId: string | null; anonKey: string | null; toolId: string }) => Promise<any>;

export const JOB_HANDLERS: Record<string, JobHandler> = {
  "mentor-query": async ({ jobId, payload }) => {
    return { jobId, ok: true, message: "mentor-query handler not implemented yet", echo: payload ? "received" : "none" };
  },
  "whois-summary": async ({ jobId, payload }) => {
    return { jobId, ok: true, message: "whois-summary handler not implemented yet", echo: payload ? "received" : "none" };
  },
  "templates-request-download": async ({ jobId, payload }) => {
    return { jobId, ok: true, message: "templates-request-download handler not implemented yet", echo: payload ? "received" : "none" };
  },
  "sandbox-echo": async ({ jobId, payload, userId, anonKey, toolId }) => {
    const out = await runComputeJob({
      toolId,
      userId,
      anonKey,
      inputs: payload,
      limits: { maxRunMs: 15_000, maxOutputBytes: 200_000, maxMemoryMb: 128, maxSteps: 10_000 },
    });
    const response: any = out.result;
    if (!response?.ok) {
      throw new JobDeniedError(response?.error?.code || "RUNNER_NOT_AVAILABLE", response?.error?.message || RUNNER_NOT_AVAILABLE_MESSAGE);
    }
    return { ok: true, stdout: String(response.stdout || ""), metrics: response.metrics, compute: out.metrics };
  },
  "code-runner": async ({ jobId, payload, userId, anonKey, toolId }) => {
    const validated = validateCodeRunnerPayloadTs(payload);
    if (!validated.ok) {
      await createJobEvent({ jobId, level: "warn", message: "code_runner_rejected", data: { reason: validated.error } });
      throw new JobDeniedError("INVALID_INPUT", validated.error);
    }

    if (validated.value.language === "py") {
      await createJobEvent({ jobId, level: "warn", message: "python_coming_soon" });
      throw new JobDeniedError("PYTHON_COMING_SOON", "Python sandbox coming soon.");
    }

    const out = await runComputeJob({
      toolId,
      userId,
      anonKey,
      inputs: validated.value,
      limits: { maxRunMs: 8_000, maxOutputBytes: 60_000, maxMemoryMb: 128, maxSteps: 200_000 },
    });
    const response: any = out.result;

    const stdoutSummary = typeof response.stdout === "string" ? response.stdout.slice(0, 1200) : "";
    const stderrSummary = typeof response.stderr === "string" ? response.stderr.slice(0, 1200) : "";
    await createJobEvent({
      jobId,
      level: response.ok ? "info" : "warn",
      message: "code_runner_result",
      data: { ok: response.ok, runMs: response.metrics?.runMs || 0, stdout: stdoutSummary, stderr: stderrSummary, aborted: Boolean(out.metrics.aborted) },
    });

    if (!response.ok) {
      throw new JobDeniedError(response.error?.code || "RUNNER_NOT_AVAILABLE", response.error?.message || RUNNER_NOT_AVAILABLE_MESSAGE);
    }

    return { ok: true, stdout: response.stdout || "", stderr: response.stderr || "", metrics: response.metrics, compute: out.metrics };
  },
};

export function getJobHandler(toolId: string): JobHandler | null {
  return JOB_HANDLERS[toolId] || null;
}


