"use client";

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { AIStudioProject } from "@/lib/ai-studio/projects/store";

type SharePayloadV1 = {
  v: 1;
  type: "ai-studio-project";
  project: Pick<
    AIStudioProject,
    "title" | "exampleId" | "audience" | "difficulty" | "category" | "config" | "lastRun" | "runs"
  >;
};

export function createProjectShareCode(project: AIStudioProject): string {
  const payload: SharePayloadV1 = {
    v: 1,
    type: "ai-studio-project",
    project: {
      title: project.title,
      exampleId: project.exampleId,
      audience: project.audience,
      difficulty: project.difficulty,
      category: project.category,
      config: project.config,
      // Keep shareable value high but bounded: include lastRun + up to 5 runs.
      lastRun: project.lastRun,
      runs: Array.isArray(project.runs) ? project.runs.slice(0, 5) : project.lastRun ? [project.lastRun] : undefined,
    },
  };

  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

export function parseProjectShareCode(code: string): { ok: true; payload: SharePayloadV1 } | { ok: false; error: string } {
  const trimmed = String(code || "").trim();
  if (!trimmed) return { ok: false, error: "Empty share code." };
  const json = decompressFromEncodedURIComponent(trimmed);
  if (!json) return { ok: false, error: "Invalid or corrupted share code." };
  try {
    const parsed = JSON.parse(json) as any;
    if (!parsed || parsed.v !== 1 || parsed.type !== "ai-studio-project" || !parsed.project) {
      return { ok: false, error: "Unsupported share code format." };
    }
    if (typeof parsed.project.title !== "string" || typeof parsed.project.exampleId !== "string") {
      return { ok: false, error: "Invalid share code payload." };
    }
    return { ok: true, payload: parsed as SharePayloadV1 };
  } catch {
    return { ok: false, error: "Invalid share code payload." };
  }
}

