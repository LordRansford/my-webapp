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
