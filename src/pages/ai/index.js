import Link from "next/link";
import Layout from "@/components/Layout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of AI in clear language with tools and practice questions.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Applied thinking: metrics, leakage, and how models behave in the real world.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Systems, grounding, agents, diffusion, and responsible AI at scale.",
  },
  {
    slug: "dashboards",
    title: "Dashboards",
    summary: "Interactive labs and dashboards to make the concepts tangible before the summary and games.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, games, and dashboards to test your intuition.",
  },
];

export default function AIHub() {
  return (
    <Layout
      title="AI Notes"
      description="Choose your level: beginner, intermediate, advanced, dashboards, or summary with games."
    >
      <header className="page-header">
        <p className="eyebrow">AI Notes</p>
        <h1>Read, practise, and build judgement</h1>
        <p className="lead">
          Pick the stage that fits you. Beginner for the basics, intermediate for system behaviour, advanced for
          architecture and responsible AI, a dashboards page for hands-on labs, and a summary page with games to make it stick.
        </p>
      </header>

      <div className="course-grid">
        {pages.map((page) => (
          <Link key={page.slug} href={`/ai/${page.slug}`} className="course-card">
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
          <li>Responsible AI guidance and documentation from major cloud and AI vendors</li>
          <li>Research papers and textbooks from recognised universities and professional bodies</li>
          <li>National and international guidance on AI governance, safety, and ethics</li>
        </ul>
      </section>
    </Layout>
  );
}

