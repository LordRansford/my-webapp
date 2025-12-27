import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { aiSectionManifest } from "./aiSections";
import { digitalisationSectionManifest } from "./digitalisationSections";
import { softwareArchitectureSectionManifest } from "./softwareArchitectureSections";
import { dataSectionManifest } from "./dataSections";

const coursesDir = path.join(process.cwd(), "content", "courses");

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: { className: ["anchor"] },
      },
    ],
  ],
};

const readDirIfExists = (dirPath) => {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
};

const listCourseJson = () =>
  readDirIfExists(coursesDir).filter((entry) => entry.endsWith(".json"));

const parseJsonCourse = (fileName) => {
  const filePath = path.join(coursesDir, fileName);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const slug = data.slug || data.id || toSlug(fileName);
    const totalHours = (data.levels || []).reduce(
      (acc, lvl) => acc + (Number(lvl.estimatedHours) || 0),
      0,
    );
    return {
      slug,
      meta: {
        title: data.title || slug,
        tagline: data.description || "",
        description: data.description || "",
        tags: (data.levels || []).map((lvl) => lvl.title).slice(0, 4),
        level: data.levels ? `${data.levels.length} levels` : "",
        duration: totalHours ? `≈${totalHours} hrs` : undefined,
        lessonCount: (data.levels || []).length || 0,
      },
      lessons: [],
      fromJson: true,
    };
  } catch {
    return null;
  }
};

const COURSE_TRACK_ORDER = [
  "cybersecurity",
  "ai",
  "software-architecture",
  "data",
  "digitalisation",
];

const COURSE_TRACK_ROUTES = {
  ai: "/ai",
  cybersecurity: "/cybersecurity",
  data: "/data",
  digitalisation: "/digitalisation",
  "software-architecture": "/software-architecture",
};

const COURSE_TRACK_LEVEL_ROUTES = {
  ai: {
    foundations: "/ai/beginner",
    intermediate: "/ai/intermediate",
    advanced: "/ai/advanced",
    summary: "/ai/summary",
  },
  cybersecurity: {
    foundations: "/cybersecurity/beginner",
    intermediate: "/cybersecurity/intermediate",
    advanced: "/cybersecurity/advanced",
    summary: "/cybersecurity/summary",
  },
  data: {
    foundations: "/data/foundations",
    intermediate: "/data/intermediate",
    advanced: "/data/advanced",
    summary: "/data/summary",
  },
  digitalisation: {
    foundations: "/digitalisation/beginner",
    intermediate: "/digitalisation/intermediate",
    advanced: "/digitalisation/advanced",
    summary: "/digitalisation/summary",
  },
  "software-architecture": {
    foundations: "/software-architecture/beginner",
    intermediate: "/software-architecture/intermediate",
    advanced: "/software-architecture/advanced",
    summary: "/software-architecture/summary",
  },
};

const parseCourseTrack = (fileName) => {
  const filePath = path.join(coursesDir, fileName);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const slug = data.slug || data.id || toSlug(fileName);
    const levels = Array.isArray(data.levels) ? data.levels : [];
    const summaryRoute = data.summary_route || data.summaryRoute || null;
    const totalHours = Number(data.totalEstimatedHours || data.total_estimated_hours) || 0;

    return {
      id: data.id || slug,
      slug,
      title: data.shortTitle || data.short_title || data.title || slug,
      longTitle: data.title || data.shortTitle || slug,
      description: data.description || "",
      totalEstimatedHours: totalHours,
      overviewRoute: data.overview_route || data.overviewRoute || COURSE_TRACK_ROUTES[slug] || `/courses/${slug}`,
      summaryRoute,
      levels,
    };
  } catch {
    return null;
  }
};

const resolveEstimatedHours = (level) =>
  Number(level?.estimatedHours || level?.estimated_hours || level?.estimated_hours_total) || 0;

const resolveLevelHref = (trackSlug, bandKey, level) => {
  const override = COURSE_TRACK_LEVEL_ROUTES?.[trackSlug]?.[bandKey];
  if (override) return override;
  if (level?.route) return level.route;
  if (level?.slug && COURSE_TRACK_ROUTES[trackSlug]) return `${COURSE_TRACK_ROUTES[trackSlug]}/${level.slug}`;
  if (level?.slug) return `/courses/${trackSlug}/${level.slug}`;
  return COURSE_TRACK_ROUTES[trackSlug] || `/courses/${trackSlug}`;
};

const buildTrackBands = (track) => {
  const labels = ["Foundations", "Intermediate", "Advanced"];
  const bandKeys = ["foundations", "intermediate", "advanced"];

  const bands = track.levels.slice(0, 3).map((level, index) => {
    const bandKey = bandKeys[index] || "advanced";
    return {
      key: bandKey,
      label: labels[index] || "Level",
      title: level?.title || labels[index] || "Level",
      summary: level?.summary || "",
      estimatedHours: resolveEstimatedHours(level),
      href: resolveLevelHref(track.slug, bandKey, level),
    };
  });

  const summaryHref = resolveLevelHref(track.slug, "summary", { route: track.summaryRoute, slug: "summary" });
  return {
    bands,
    summary: {
      key: "summary",
      label: "Summary",
      title: "Summary and games",
      href: summaryHref,
    },
  };
};

export const getCourseTracks = () => {
  const tracks = listCourseJson()
    .map(parseCourseTrack)
    .filter(Boolean)
    .map((track) => {
      const resolvedRoute = COURSE_TRACK_ROUTES[track.slug] || track.overviewRoute || `/courses/${track.slug}`;
      const { bands, summary } = buildTrackBands(track);
      const totalBandHours = bands.reduce((acc, b) => acc + (Number(b.estimatedHours) || 0), 0);
      const totalHours = track.totalEstimatedHours || totalBandHours;

      return {
        ...track,
        overviewRoute: resolvedRoute,
        totalEstimatedHours: totalHours,
        bands,
        summary,
        startHref: bands[0]?.href || resolvedRoute,
      };
    });

  const orderIndex = new Map(COURSE_TRACK_ORDER.map((slug, idx) => [slug, idx]));
  tracks.sort((a, b) => (orderIndex.get(a.slug) ?? 99) - (orderIndex.get(b.slug) ?? 99));
  return tracks;
};

const listCourseSlugs = () =>
  readDirIfExists(coursesDir).filter((entry) =>
    fs.statSync(path.join(coursesDir, entry)).isDirectory(),
  );

const listLessonFiles = (courseSlug) => {
  const lessonDir = path.join(coursesDir, courseSlug);
  return readDirIfExists(lessonDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(lessonDir, file));
};

const toSlug = (filePath) => path.basename(filePath, ".mdx");

const normaliseMeta = (data = {}, fallbackTitle) => ({
  title: data.title || fallbackTitle || "Untitled lesson",
  description: data.description || data.tagline || "",
  tags: Array.isArray(data.tags) ? data.tags : [],
  level: data.level || "",
  duration: data.duration || "",
  order: Number.isFinite(data.order) ? data.order : 99,
  tagline: data.tagline || data.description || "",
});

export const getCourseLessons = (courseSlug) => {
  const files = listLessonFiles(courseSlug);

  return files
    .map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);
      const meta = normaliseMeta(data, toSlug(filePath));

      return {
        slug: toSlug(filePath),
        filePath,
        meta,
        readingStats: readingTime(content),
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order);
};

export const getCoursesIndex = () => {
  const courseSlugs = listCourseSlugs();
  const jsonCourses = listCourseJson()
    .map(parseJsonCourse)
    .filter(Boolean);

  const dirCourses = courseSlugs.map((slug) => {
    const lessons = getCourseLessons(slug);
    const primary = lessons.find((lesson) => lesson.slug === "course") || lessons[0];
    const meta = primary?.meta || normaliseMeta({}, slug);

    return {
      slug,
      meta: {
        ...meta,
        lessonCount: lessons.length,
      },
      lessons,
    };
  });

  const combined = [...dirCourses];
  jsonCourses.forEach((jsonCourse) => {
    if (!combined.find((c) => c.slug === jsonCourse.slug)) combined.push(jsonCourse);
  });

  return combined;
};

export const getAllLessonPaths = () =>
  listCourseSlugs().flatMap((courseSlug) =>
    getCourseLessons(courseSlug).map((lesson) => ({
      course: courseSlug,
      lesson: lesson.slug,
    })),
  );

export const getLesson = async (courseSlug, lessonSlug) => {
  const filePath = path.join(coursesDir, courseSlug, `${lessonSlug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const extraScope =
    courseSlug === "ai"
      ? { aiSectionManifest }
      : courseSlug === "digitalisation"
      ? { digitalisationSectionManifest }
      : courseSlug === "software-architecture"
      ? { softwareArchitectureSectionManifest }
      : courseSlug === "data"
      ? { dataSectionManifest }
      : {};
  const serialised = await serialize(content, {
    scope: { ...data, ...extraScope },
    mdxOptions,
  });

  const lessons = getCourseLessons(courseSlug);
  const course = getCoursesIndex().find((entry) => entry.slug === courseSlug);

  return {
    course: course || {
      slug: courseSlug,
      meta: normaliseMeta(data, courseSlug),
      lessons,
    },
    lesson: {
      slug: lessonSlug,
      meta: normaliseMeta(data, lessonSlug),
      readingStats: readingTime(content),
    },
    mdx: serialised,
    lessons,
  };
};
