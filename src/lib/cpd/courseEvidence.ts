import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { CPDState } from "@/lib/cpd";
import { minutesToHours } from "@/lib/cpd/calculations";

export type CourseId = "cybersecurity" | "ai" | "software-architecture" | "data" | "digitalisation";

export type CourseLevelId = "foundations" | "intermediate" | "advanced" | "applied" | "practice" | "summary";

export type CourseLevelMeta = {
  courseId: CourseId;
  levelId: CourseLevelId;
  title: string;
  summary: string;
  estimatedHours: number;
  learningObjectives: string[];
};

export type CourseEvidenceSummary = {
  courseId: CourseId;
  levelId: CourseLevelId;
  courseTitle: string;
  levelTitle: string;
  learnerIdentifier: string;
  estimatedHours: number;
  recordedHours: number;
  completionDate: string | null;
  objectivesCovered: string[];
  evidenceSignals: {
    sectionsCompleted: number;
    minutesLogged: number;
    quizzesCompleted: number;
    toolEvents: number;
  };
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonCourse(courseId: string) {
  const p = path.join(CONTENT_DIR, "courses", `${courseId}.json`);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function readMdxFrontmatter(relativePath: string) {
  const p = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    const parsed = matter(raw);
    return parsed.data || null;
  } catch {
    return null;
  }
}

export function getCourseLevelMeta(courseId: CourseId, levelId: CourseLevelId): CourseLevelMeta | null {
  // Prefer MDX frontmatter when available, because it is the canonical “course page” metadata.
  // For cybersecurity (notes-driven), fall back to the course JSON.
  const mdxPathByCourse: Record<string, Record<string, string>> = {
    ai: {
      foundations: "notes/ai/beginner.mdx",
      intermediate: "courses/ai/intermediate.mdx",
      advanced: "courses/ai/advanced.mdx",
      summary: "courses/ai/summary.mdx",
    },
    cybersecurity: {
      foundations: "notes/cybersecurity/ch1.mdx",
      applied: "notes/cybersecurity/intermediate.mdx",
      practice: "notes/cybersecurity/advanced.mdx",
    },
    "software-architecture": {
      foundations: "courses/software-architecture/foundations.mdx",
      intermediate: "courses/software-architecture/intermediate.mdx",
      advanced: "courses/software-architecture/advanced.mdx",
      summary: "courses/software-architecture/summary.mdx",
    },
    data: {
      foundations: "courses/data/foundations.mdx",
      intermediate: "courses/data/intermediate.mdx",
      advanced: "courses/data/advanced.mdx",
      summary: "courses/data/summary.mdx",
    },
    digitalisation: {
      foundations: "courses/digitalisation/foundations.mdx",
      intermediate: "courses/digitalisation/intermediate.mdx",
      advanced: "courses/digitalisation/advanced.mdx",
      summary: "courses/digitalisation/summary.mdx",
    },
  };

  const mdxPath = mdxPathByCourse?.[courseId]?.[levelId];
  const fm = mdxPath ? readMdxFrontmatter(mdxPath) : null;
  if (fm && fm.title && fm.summary && fm.estimatedHours && Array.isArray(fm.learningObjectives)) {
    return {
      courseId,
      levelId,
      title: String(fm.title),
      summary: String(fm.summary),
      estimatedHours: Number(fm.estimatedHours) || 0,
      learningObjectives: (fm.learningObjectives || []).map((x: any) => String(x)).filter(Boolean),
    };
  }

  const courseJson = readJsonCourse(courseId);
  if (!courseJson) return null;

  const level = (courseJson.levels || []).find((l: any) => l.id === levelId) || null;
  const summaryPage = levelId === "summary" ? courseJson.summaryPage : null;

  const estimated = Number(level?.estimatedHours || level?.estimated_hours || (levelId === "summary" ? 4 : 0)) || 0;
  const objectives = (level?.learningOutcomes || level?.learning_outcomes || []).map((x: any) => String(x)).filter(Boolean);

  if (!estimated) return null;
  return {
    courseId,
    levelId,
    title: String(level?.title || summaryPage?.title || courseJson.title || courseId),
    summary: String(level?.summary || summaryPage?.description || courseJson.description || ""),
    estimatedHours: estimated,
    learningObjectives: objectives,
  };
}

function pickCompletionDate(state: CPDState, trackId: string, levelId: string): string | null {
  const completed = state.sections
    .filter((s) => s.trackId === trackId && s.levelId === levelId && s.completed && s.lastUpdated)
    .map((s) => s.lastUpdated)
    .sort();
  return completed.length ? completed[completed.length - 1] : null;
}

export function buildCourseEvidenceSummary(params: {
  courseId: CourseId;
  levelId: CourseLevelId;
  courseTitle: string;
  learnerIdentifier: string;
  cpdState: CPDState;
}): CourseEvidenceSummary {
  const meta = getCourseLevelMeta(params.courseId, params.levelId);
  const levelTitle = meta?.title || params.levelId;
  const estimatedHours = meta?.estimatedHours || 0;
  const objectivesCovered = meta?.learningObjectives || [];

  const trackId =
    params.courseId === "cybersecurity" ? "cyber" :
    params.courseId === "software-architecture" ? "software-architecture" :
    params.courseId === "digitalisation" ? "digitalisation" :
    params.courseId === "data" ? "data" :
    "ai";

  const minutesLogged = (params.cpdState.activity || [])
    .filter((a) => a.trackId === trackId && a.levelId === params.levelId)
    .reduce((sum, a) => sum + (Number(a.minutesDelta) || 0), 0);

  const quizzesCompleted = (params.cpdState.activity || []).filter((a) => a.trackId === trackId && a.levelId === params.levelId)
    .filter((a) => String(a.note || "").toLowerCase().includes("completed quiz")).length;

  const toolEvents = (params.cpdState.activity || []).filter((a) => a.trackId === trackId && a.levelId === params.levelId)
    .filter((a) => String(a.note || "").toLowerCase().includes("tool")).length;

  const sectionsCompleted = (params.cpdState.sections || []).filter((s) => s.trackId === trackId && s.levelId === params.levelId && s.completed).length;

  const completionDate = pickCompletionDate(params.cpdState, trackId, params.levelId);

  // Fixed hours policy:
  // - Learners cannot self-declare hours
  // - Recorded hours match the fixed estimated hours
  // - Timed assessment time is included once when the level is completed
  const assessmentHours = completionDate ? (params.levelId === "summary" ? 0 : (75 / 60)) : 0;

  return {
    courseId: params.courseId,
    levelId: params.levelId,
    courseTitle: params.courseTitle,
    levelTitle,
    learnerIdentifier: params.learnerIdentifier,
    estimatedHours,
    recordedHours: Math.round((Number(estimatedHours) + assessmentHours) * 10) / 10,
    completionDate,
    objectivesCovered,
    evidenceSignals: {
      sectionsCompleted,
      minutesLogged,
      quizzesCompleted,
      toolEvents,
    },
  };
}


