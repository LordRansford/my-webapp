import crypto from "crypto";
import type { ArchitectureDiagramInput } from "../schema";

function sortValue(value: any): any {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .forEach((k) => {
        out[k] = sortValue(value[k]);
      });
    return out;
  }
  return value;
}

export function hashArchitectureInputs(input: ArchitectureDiagramInput) {
  const stable = sortValue(input);
  const json = JSON.stringify(stable);
  return crypto.createHash("sha256").update(json).digest("hex").slice(0, 12);
}


