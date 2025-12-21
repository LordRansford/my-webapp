import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import Layout from "@/components/Layout";
import LessonNavigation from "@/components/LessonNavigation";
import mdxComponents from "@/components/mdx-components";
import { getAllLessonPaths, getLesson } from "@/lib/courses";

export async function getStaticPaths() {
  const paths = getAllLessonPaths().map(({ course, lesson }) => ({
    params: { course, lesson },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const lessonData = await getLesson(params.course, params.lesson);

  if (!lessonData) {
    return { notFound: true };
  }

  return {
    props: { ...lessonData },
  };
}

export default function LessonPage({ course, lesson, mdx, lessons }) {
  const activeIndex = Array.isArray(lessons) ? lessons.findIndex((l) => l.slug === lesson.slug) : -1;
  const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const nextLesson = activeIndex >= 0 && activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

  return (
    <Layout
      title={`${lesson.meta.title} · ${course.meta.title}`}
      description={lesson.meta.description || course.meta.tagline}
    >
      <nav className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/courses/${course.slug}`}>{course.meta.title}</Link>
        <span aria-hidden="true"> / </span>
        <span>{lesson.meta.title}</span>
      </nav>

      <div className="lesson-layout">
        <div className="lesson-content">
          <p className="eyebrow">{course.meta.tagline || course.meta.title}</p>
          <h1>{lesson.meta.title}</h1>
          {lesson.meta.description && <p className="lead">{lesson.meta.description}</p>}
          <div className="lesson-meta">
            {lesson.meta.tags?.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
            {lesson.readingStats && (
              <span className="pill pill--ghost">
                {Math.ceil(lesson.readingStats.minutes)} min read
              </span>
            )}
          </div>
          <article className="post-content">
            <MDXRemote {...mdx} components={mdxComponents} />
          </article>

          <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="Lesson navigation">
            {prevLesson ? (
              <Link href={`/courses/${course.slug}/${prevLesson.slug}`} className="button ghost" rel="prev">
                ← {prevLesson.meta.title || "Previous"}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link href={`/courses/${course.slug}/${nextLesson.slug}`} className="button primary" rel="next">
                {nextLesson.meta.title || "Next"} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <LessonNavigation courseSlug={course.slug} lessons={lessons} active={lesson.slug} />
      </div>
    </Layout>
  );
}
