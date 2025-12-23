import type { RunnerJobRequest, RunnerJobResponse } from "@/lib/runner/types";
import { runInRunner as runInRunnerCore } from "@/lib/runner/client.core.js";

export async function runInRunner(request: RunnerJobRequest): Promise<RunnerJobResponse> {
  return (await runInRunnerCore(request as any)) as RunnerJobResponse;
}


