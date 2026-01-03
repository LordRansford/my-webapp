import fs from "fs";
import path from "path";
import matter from "gray-matter";

type CourseLevel = {
  id: string;
  title: string;
  path: string;
  estimatedHours: number;
};

type CourseOverview = {
  id: string;
  title: string;
  tagline: string;
  totalEstimatedHours: number;
  levels: CourseLevel[];
};

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

const COURSE_LEVEL_MAP: Record<
  string,
  { id: string; title: string; sourceId?: string; slug: string }[]
> = {
  data: [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "intermediate", title: "Intermediate", sourceId: "intermediate", slug: "intermediate" },
    { id: "advanced", title: "Advanced", sourceId: "advanced", slug: "advanced" },
    { id: "summary", title: "Summary and games", slug: "summary" },
  ],
  ai: [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "intermediate", title: "Intermediate", sourceId: "applied", slug: "intermediate" },
    { id: "advanced", title: "Advanced", sourceId: "practice-strategy", slug: "advanced" },
    { id: "summary", title: "Summary and games", slug: "summary" },
  ],
  cybersecurity: [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "applied", title: "Intermediate", sourceId: "applied", slug: "intermediate" },
    { id: "practice", title: "Advanced", sourceId: "practice", slug: "advanced" },
    { id: "summary", title: "Summary and games", slug: "summary" },
  ],
  digitalisation: [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "intermediate", title: "Intermediate", sourceId: "applied", slug: "intermediate" },
    { id: "advanced", title: "Advanced", sourceId: "practice-strategy", slug: "advanced" },
    { id: "summary", title: "Summary and games", slug: "summary" },
  ],
  "software-architecture": [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "intermediate", title: "Intermediate", sourceId: "applied", slug: "intermediate" },
    { id: "advanced", title: "Advanced", sourceId: "practice-strategy", slug: "advanced" },
    { id: "summary", title: "Summary and games", slug: "summary" },
  ],
  "network-models": [
    { id: "foundations", title: "Foundations", sourceId: "foundations", slug: "foundations" },
    { id: "applied", title: "Applied", sourceId: "applied", slug: "intermediate" },
    { id: "practice", title: "Practice", sourceId: "practice", slug: "advanced" },
    { id: "summary", title: "Summary and practice", slug: "summary" },
  ],
};

const readJson = (courseId: string) => {
  const filePath = path.join(COURSES_DIR, `${courseId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
};

const readEstimatedHours = (courseId: string, slug: string) => {
  const mdxPath = path.join(COURSES_DIR, courseId, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) return null;
  try {
    const raw = fs.readFileSync(mdxPath, "utf8");
    const { data } = matter(raw);
    const hours = Number(data?.estimatedHours);
    return Number.isFinite(hours) ? hours : null;
  } catch {
    return null;
  }
};

export const getCpdCourses = (): CourseOverview[] => {
  return Object.keys(COURSE_LEVEL_MAP).map((courseId) => {
    const data = readJson(courseId) || {};
    const levels = COURSE_LEVEL_MAP[courseId].map((level) => {
      const fromMdx = readEstimatedHours(courseId, level.slug);
      const fromJson =
        data.levels?.find((item: { id: string }) => item.id === level.sourceId)?.estimatedHours ??
        data.levels?.find((item: { id: string }) => item.id === level.sourceId)?.estimated_hours ??
        0;
      const fallbackSummary = level.id === "summary" ? 4 : 0;

      return {
        id: level.id,
        title: level.title,
        path: `/courses/${courseId}/${level.slug}`,
        estimatedHours: fromMdx ?? Number(fromJson || fallbackSummary),
      };
    });

    const totalEstimatedHours = levels.reduce((sum, lvl) => sum + (Number(lvl.estimatedHours) || 0), 0);

    return {
      id: courseId,
      title: data.title || courseId,
      tagline: data.description || data.tagline || "",
      totalEstimatedHours,
      levels,
    };
  });
};

export const getPlannedHoursTotal = (courses: CourseOverview[]) =>
  courses.reduce((sum, course) => sum + (Number(course.totalEstimatedHours) || 0), 0);

export type { CourseOverview, CourseLevel };
