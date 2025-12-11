import Link from "next/link";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { getCoursesIndex } from "@/lib/courses";

export async function getStaticProps() {
  const courses = getCoursesIndex();

  return {
    props: { courses },
  };
}

export default function CoursesPage({ courses }) {
  return (
    <Layout
      title="Courses · Ransford's Notes"
      description="Premium, security-first courses with interactive sandboxes for AI, architecture, and cyber."
    >
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Courses</p>
          <h1>Security-first learning that ships.</h1>
          <p className="lead">
            Three focused tracks — Cybersecurity, Software Architecture, and AI Systems — built with TOGAF
            alignment and SABSA controls. Every lesson pairs guidance with a live sandbox.
          </p>
          <div className="actions">
            <Link href="/tools" className="button primary">
              Open the labs
            </Link>
            <Link href="/about" className="button ghost">
              Meet the author
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <p className="eyebrow">Architecture layers</p>
          <ul className="hero-list">
            <li>
              <span className="dot dot--accent" />
              Business intent (TOGAF)
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
          <span className="hint">MDX content with embedded, browser-safe tooling</span>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
