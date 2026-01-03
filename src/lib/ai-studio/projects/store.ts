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
    output: unknown;
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
  return Array.isArray(parsed) ? parsed : [];
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

