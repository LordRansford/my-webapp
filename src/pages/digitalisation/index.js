import Link from "next/link";
import Layout from "@/components/Layout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of digitalisation, data discipline, people, and process.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Designing operating models, platforms, governance, and realistic roadmaps.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Ecosystems, regulation, funding models, risk, and stewardship.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, games, and dashboards to test strategy thinking.",
  },
];

export default function DigitalisationHub() {
  return (
    <Layout
      title="Digitalisation Strategy Notes"
      description="Choose your level: beginner, intermediate, advanced, or summary with games and dashboards."
    >
      <header className="page-header">
        <p className="eyebrow">Digitalisation Strategy</p>
        <h1>Read, design, and deliver</h1>
        <p className="lead">
          Pick the stage that fits you. Beginner for language and foundations, intermediate for operating models and
          platforms, advanced for ecosystems and stewardship, plus a summary page with games and dashboards.
        </p>
      </header>

      <div className="course-grid">
        {pages.map((page) => (
          <Link key={page.slug} href={`/digitalisation/${page.slug}`} className="course-card">
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
          <li>Official guidance from government digital services and sector regulators</li>
          <li>Research and playbooks on digital operating models, platform thinking, and service design</li>
          <li>Standards and textbooks on data governance, architecture, and programme delivery</li>
        </ul>
      </section>
    </Layout>
  );
}

