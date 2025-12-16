import Link from "next/link";
import Layout from "@/components/Layout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of systems, structure, boundaries, and architectural thinking.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Designing real systems, styles, decomposition, quality driven design, and decisions.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Architecture at organisational scale, platforms, resilience, and governance.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, games, dashboards, and reflection to consolidate architecture thinking.",
  },
];

export default function ArchitectureHub() {
  return (
    <Layout
      title="Software Architecture Notes"
      description="Choose your level: beginner, intermediate, advanced, or summary with games and dashboards."
    >
      <header className="page-header">
        <p className="eyebrow">Software Architecture Notes</p>
        <h1>Read, design, and steward systems</h1>
        <p className="lead">
          Pick the stage that fits you. Beginner for core structure, intermediate for design and decisions, advanced for
          platforms and governance, and a summary page with games and dashboards.
        </p>
      </header>

      <div className="course-grid">
        {pages.map((page) => (
          <Link key={page.slug} href={`/software-architecture/${page.slug}`} className="course-card">
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

      <section className="section">
        <h2>References and further reading</h2>
        <p className="muted">
          These notes draw on a wide range of sources. A few starting points are listed here so that you can explore the
          official material in more depth.
        </p>
        <ul className="list">
          <li>Architecture handbooks and open course materials from recognised universities and industry leaders</li>
          <li>Documentation and guidance on cloud architecture, reliability, and security from major vendors</li>
          <li>Standards and playbooks on software design, observability, and operational excellence</li>
        </ul>
      </section>
    </Layout>
  );
}

