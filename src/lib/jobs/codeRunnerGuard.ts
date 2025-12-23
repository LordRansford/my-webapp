import { validateCodeRunnerPayload } from "@/lib/jobs/codeRunnerGuard.core.js";

export type CodeRunnerPayload = { language: "js" | "py"; code: string; input: string };
export type CodeRunnerValidation = { ok: true; value: CodeRunnerPayload } | { ok: false; error: string };

export function validateCodeRunnerPayloadTs(payload: unknown): CodeRunnerValidation {
  return validateCodeRunnerPayload(payload) as CodeRunnerValidation;
}


