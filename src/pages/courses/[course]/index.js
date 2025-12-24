import Link from "next/link";
import Layout from "@/components/Layout";
import LessonNavigation from "@/components/LessonNavigation";
import { getCourseLessons, getCoursesIndex } from "@/lib/courses";
import NextActionsCard from "@/components/course/NextActionsCard";
import { getLearnerPath } from "@/lib/learnerPaths";
import { CourseOverviewTemplate } from "@/components/templates/PageTemplates";

export async function getStaticPaths() {
  const courses = getCoursesIndex();
  const paths = courses.map((course) => ({ params: { course: course.slug } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const course = getCoursesIndex().find((entry) => entry.slug === params.course);
  const lessons = getCourseLessons(params.course);

  return {
    props: {
      course,
      lessons,
    },
  };
}

export default function CourseOverviewPage({ course, lessons }) {
  const firstLesson = lessons[0];
  const path = getLearnerPath(course?.slug);
  const breadcrumbs = [
    { label: "Courses", href: "/courses" },
    { label: course?.meta?.title || "Course" },
  ];

  return (
    <Layout
      title={`${course.meta.title} - Ransford's Notes`}
      description={course.meta.description || course.meta.tagline}
    >
      <CourseOverviewTemplate
        breadcrumbs={breadcrumbs}
        sidebar={<LessonNavigation courseSlug={course.slug} lessons={lessons} />}
      >
        <p className="eyebrow">Course overview</p>
        <h1>{course.meta.title}</h1>
        {course.meta.tagline && <p className="lead">{course.meta.tagline}</p>}
        <div className="lesson-meta">
          {course.meta.tags?.map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
          {course.meta.duration && <span className="pill pill--ghost">{course.meta.duration}</span>}
          {course.meta.level && <span className="pill pill--ghost">{course.meta.level}</span>}
        </div>
        <p>{course.meta.description}</p>
        {firstLesson && (
          <div className="actions">
            <Link href={`/courses/${course.slug}/${firstLesson.slug}`} className="button primary">
              Start the course
            </Link>
            <Link href="/tools" className="button ghost">
              Jump to labs
            </Link>
            <Link href="/my-cpd" className="button ghost">
              Track CPD
            </Link>
          </div>
        )}

        {path ? (
          <div className="mt-6">
            <NextActionsCard
              title="Practice + CPD"
              links={[
                { kind: "cpd", label: "My CPD (track minutes)", href: "/my-cpd", note: "Log time as you study. Evidence is stored locally in this browser." },
                { kind: "cpd", label: "CPD evidence (copy/export)", href: "/my-cpd/evidence", note: "Copy a defensible summary into your CPD system." },
                ...path.recommended,
              ]}
            />
          </div>
        ) : null}
      </CourseOverviewTemplate>
    </Layout>
  );
}
