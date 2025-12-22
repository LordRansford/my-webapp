import { ZodError } from "zod";
import { ArchitectureDiagramInputSchema, type ArchitectureDiagramInput } from "./schema";

export type ValidationErrorItem = {
  path: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; value: ArchitectureDiagramInput; errors: [] }
  | { ok: false; value: null; errors: ValidationErrorItem[] };

function pathToString(path: PropertyKey[]) {
  if (!path?.length) return "input";
  return path
    .map((p) => {
      if (typeof p === "number") return `[${p}]`;
      if (typeof p === "symbol") return String(p.description || "symbol");
      return p;
    })
    .join(".")
    .replace(".[", "[");
}

export function validateArchitectureDiagramInput(input: unknown): ValidationResult {
  const parsed = ArchitectureDiagramInputSchema.safeParse(input);
  if (parsed.success) return { ok: true, value: parsed.data, errors: [] };

  const err = parsed.error;
  const issues = err instanceof ZodError ? err.issues : [];
  return {
    ok: false,
    value: null,
    errors: issues.map((i) => ({
      path: pathToString(i.path),
      message: i.message,
    })),
  };
}


