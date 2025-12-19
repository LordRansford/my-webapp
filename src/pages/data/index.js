import Link from "next/link";
import Layout from "@/components/Layout";
import dataCourse from "../../../content/courses/data.json";

const pages = [
  {
    slug: "foundations",
    title: "Foundations",
    summary: "Start with the language, formats, and habits that make data useful across teams.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Models, pipelines, and analytics that keep data reliable and ready for use.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Architecture, streaming, governance, and data products at scale.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, scenarios, and playful practice for the data course.",
  },
];

export default function DataHub() {
  return (
    <Layout
      title={dataCourse.title || "Data course"}
      description={
        dataCourse.description ||
        "A practical course on data from formats and models to governance, architecture, and real-world use."
      }
    >
      <header className="page-header">
        <p className="eyebrow">Data course</p>
        <h1>Data as a practice</h1>
        <p className="lead">
          Follow the four level path from foundations to summary. Each level keeps the same CPD tracking and section
          toggles as the other courses.
        </p>
      </header>

      <div className="course-grid">
        {pages.map((page) => (
          <Link key={page.slug} href={`/data/${page.slug}`} className="course-card">
            <div className="course-card__meta">
              <span className="chip chip--accent">{page.title}</span>
            </div>
            <h3>{page.title}</h3>
            <p className="muted">{page.summary}</p>
            <div className="course-card__footer">
              <span className="footnote">Open notes</span>
              <span aria-hidden="true">{">"}</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
