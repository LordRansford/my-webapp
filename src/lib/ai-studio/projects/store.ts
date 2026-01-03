/**
 * AI Studio Projects (local-first)
 *
 * This store makes "Load example" produce a real artefact:
 * - a persisted project record in localStorage
 * - a stable project ID that the UI can re-open
 *
 * It is intentionally conservative: it stores only non-sensitive configuration.
 */

import type { AIStudioExample } from "@/lib/ai-studio/examples/types";

export type AIStudioRunReceipt = {
  runId: string;
  mode: "local" | "compute";
  durationMs: number;
  inputBytes: number;
  outputBytes: number;
  freeTierAppliedMs: number;
  paidMs: number;
  creditsCharged: number;
  remainingCredits: number | null;
  guidanceTips: string[];
};

export type AIStudioProject = {
  id: string;
  title: string;
  exampleId: string;
  audience: AIStudioExample["audience"];
  difficulty: AIStudioExample["difficulty"];
  category: AIStudioExample["category"];
  createdAt: string;
  updatedAt: string;
  config: AIStudioExample["config"];
  lastRun?: {
    ranAt: string;
    input?: unknown;
    output: unknown;
    receipt?: AIStudioRunReceipt;
  };
};

const STORAGE_KEY = "ai-studio-projects:v1";
const LAST_OPENED_KEY = "ai-studio-last-opened-project-id:v1";

function isClient() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  // Avoid importing crypto in the browser bundle; use a simple stable ID.
  return `p_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function getProjects(): AIStudioProject[] {
  if (!isClient()) return [];
  const parsed = safeParse<AIStudioProject[]>(localStorage.getItem(STORAGE_KEY));
  if (!Array.isArray(parsed)) return [];

  // Lightweight migration: tolerate older lastRun shape.
  return parsed.map((p) => {
    if (!p || typeof p !== "object") return p;
    const lastRun: any = (p as any).lastRun;
    if (!lastRun || typeof lastRun !== "object") return p;
    if ("receipt" in lastRun) return p;
    return {
      ...p,
      lastRun: {
        ranAt: typeof lastRun.ranAt === "string" ? lastRun.ranAt : nowIso(),
        input: lastRun.input,
        output: lastRun.output,
      },
    } as AIStudioProject;
  });
}

export function saveProjects(projects: AIStudioProject[]) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(0, 200)));
}

export function createProjectFromExample(example: AIStudioExample): AIStudioProject {
  const projects = getProjects();
  const createdAt = nowIso();
  const project: AIStudioProject = {
    id: newId(),
    title: example.title,
    exampleId: example.id,
    audience: example.audience,
    difficulty: example.difficulty,
    category: example.category,
    createdAt,
    updatedAt: createdAt,
    config: example.config,
  };
  saveProjects([project, ...projects]);
  return project;
}

export function getProjectById(projectId: string): AIStudioProject | null {
  const projects = getProjects();
  return projects.find((p) => p.id === projectId) || null;
}

export function setLastOpenedProjectId(projectId: string) {
  if (!isClient()) return;
  localStorage.setItem(LAST_OPENED_KEY, projectId);
}

export function getLastOpenedProjectId(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(LAST_OPENED_KEY);
}

export function updateProjectLastRun(projectId: string, output: unknown) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx < 0) return;
  const updated: AIStudioProject = {
    ...projects[idx],
    updatedAt: nowIso(),
    lastRun: { ranAt: nowIso(), output },
  };
  const next = [...projects];
  next[idx] = updated;
  saveProjects(next);
}

export function updateProjectRun(projectId: string, params: { input?: unknown; output: unknown; receipt?: AIStudioRunReceipt }) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx < 0) return;
  const updated: AIStudioProject = {
    ...projects[idx],
    updatedAt: nowIso(),
    lastRun: { ranAt: nowIso(), input: params.input, output: params.output, receipt: params.receipt },
  };
  const next = [...projects];
  next[idx] = updated;
  saveProjects(next);
}

export function deleteProject(projectId: string) {
  const projects = getProjects();
  const next = projects.filter((p) => p.id !== projectId);
  saveProjects(next);
  const last = getLastOpenedProjectId();
  if (last === projectId && isClient()) {
    localStorage.removeItem(LAST_OPENED_KEY);
  }
}

export function importProject(raw: unknown): { ok: true; project: AIStudioProject } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid project file." };
  const p = raw as any;
  if (typeof p.title !== "string" || typeof p.exampleId !== "string") return { ok: false, error: "Missing required project fields." };

  // Sanitize and avoid ID collisions.
  const projects = getProjects();
  const incomingId = typeof p.id === "string" ? p.id : newId();
  const exists = projects.some((x) => x.id === incomingId);
  const id = exists ? newId() : incomingId;

  const createdAt = typeof p.createdAt === "string" ? p.createdAt : nowIso();
  const updatedAt = typeof p.updatedAt === "string" ? p.updatedAt : nowIso();

  const project: AIStudioProject = {
    id,
    title: String(p.title).slice(0, 120),
    exampleId: String(p.exampleId).slice(0, 80),
    audience: (p.audience || "all") as any,
    difficulty: (p.difficulty || "beginner") as any,
    category: String(p.category || "unknown").slice(0, 80),
    createdAt,
    updatedAt,
    config: (p.config || {}) as any,
    lastRun: p.lastRun && typeof p.lastRun === "object" ? (p.lastRun as any) : undefined,
  };

  saveProjects([project, ...projects]);
  return { ok: true, project };
}

