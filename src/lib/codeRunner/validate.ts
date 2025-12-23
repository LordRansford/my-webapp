import { validateCodeRunnerPayload } from "@/lib/codeRunner/validate.core.js";

export type ValidatedCodeRunnerPayload =
  | { ok: true; language: "js" | "py"; code: string; input: string }
  | { ok: false; error: string };

export function validateCodeRunnerPayloadTs(payload: unknown): ValidatedCodeRunnerPayload {
  return validateCodeRunnerPayload(payload) as ValidatedCodeRunnerPayload;
}


