import Link from "next/link";
import Layout from "@/components/Layout";
import { ArrowRight, Clock3 } from "lucide-react";
import { getCourseTracks } from "@/lib/courses";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

export async function getStaticProps() {
  const courses = getCourseTracks();

  return {
    props: { courses },
  };
}

function CourseTrackCard({ course }) {
  const levelCount = (course?.bands?.length || 0) + 1;
  const hours = Number(course?.totalEstimatedHours || 0);
  const firstLabel = course.bands?.[0]?.label || "Foundations";

  return (
    <div className="course-card">
      <div className="course-card__meta">
        <span className="chip chip--accent">{levelCount} levels</span>
        {hours ? (
          <span className="chip chip--ghost">
            <Clock3 size={14} aria-hidden="true" />
            {hours} hrs
          </span>
        ) : null}
      </div>

      <h3 className="text-xl font-semibold">
        <Link href={course.overviewRoute} className="hover:underline">
          {course.title}
        </Link>
      </h3>

      {course.description ? <p className="muted">{course.description}</p> : null}

      <div className="course-card__tags">
        {course.bands?.map((level) => (
          <Link key={level.key} href={level.href} className="pill pill--accent">
            {level.label}
          </Link>
        ))}
        <Link href={course.summary?.href || course.overviewRoute} className="pill pill--ghost">
          {course.summary?.label || "Summary"}
        </Link>
      </div>

      <div className="course-card__footer">
        <Link
          href={course.startHref || course.overviewRoute}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          Start with {firstLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href={course.overviewRoute}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          Overview
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CoursesPage({ courses }) {
  return (
    <Layout
      title="Courses - Ransford's Notes"
      description="Notes with browser practice for cybersecurity, data, software architecture, digitalisation, and AI."
    >
      <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}>
        <div className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Courses</p>
            <h1>Notes that build from foundations to advanced practice.</h1>
            <p className="lead">
              Five focused tracks. Cybersecurity, AI, Software Architecture, Data, and Digitalisation. Each track has a
              clear path from foundations to advanced practice, plus a summary with games and practical tools.
            </p>
            <div className="actions">
              <Link href="/tools" className="button primary">
                Open the labs
              </Link>
              <Link href="/about" className="button ghost">
                Meet the author
              </Link>
              <Link href="/my-cpd" className="button ghost">
                Open My CPD
              </Link>
              <Link href="/templates" className="button ghost">
                Explore templates
              </Link>
            </div>
            <Link href="/my-cpd/evidence" className="text-link">
              Need evidence for work or accreditation? Open the CPD evidence view.
            </Link>
          </div>
          <div className="hero__panel">
            <p className="eyebrow">Learning flow</p>
            <ul className="hero-list">
              <li>
                <span className="dot dot--accent" />
                Clear intent and scope
              </li>
              <li>
                <span className="dot dot--accent" />
                Data clarity (front matter + MDX)
              </li>
              <li>
                <span className="dot dot--accent" />
                Application guardrails (React/Next)
              </li>
              <li>
                <span className="dot dot--accent" />
                Technology controls (headers, client-side tools)
              </li>
            </ul>
          </div>
        </div>

        <section className="section">
          <div className="section-heading">
            <h2>Choose a track</h2>
            <span className="hint">Notes with embedded, browser-safe tooling</span>
          </div>
          <div className="course-grid">
            {courses.map((course) => (
              <CourseTrackCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      </MarketingPageTemplate>
    </Layout>
  );
}
