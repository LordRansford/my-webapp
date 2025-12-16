import Link from "next/link";
import Layout from "@/components/Layout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of cybersecurity and cryptography in plain language with hands-on prompts.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Chapter 1: foundations with tools, Q&A, and RSA practice.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Chapter 3: threats, defence in depth, humans, and response with labs.",
  },
  {
    slug: "dashboards",
    title: "Dashboards",
    summary: "Interactive cybersecurity dashboards and labs that turn theory into intuition before the summary game.",
  },
  {
    slug: "summary",
    title: "Summary and game",
    summary: "A quick recap with an interactive game to test what you learned (publishing soon).",
  },
];

export default function CybersecurityNotesHub() {
  return (
    <Layout
      title="Cybersecurity Notes"
      description="Choose your level: beginner, intermediate, advanced, dashboards, or summary with an interactive game."
    >
      <header className="page-header">
        <p className="eyebrow">Cybersecurity Notes</p>
        <h1>Read, practise, and level up</h1>
        <p className="lead">
          Pick the stage that fits you. Beginner for fundamentals, intermediate for applied crypto, advanced for
          forward-looking topics, a dashboards page for hands-on labs, and a summary page with a game to test yourself.
        </p>
      </header>

      <div className="course-grid">
        {pages.map((page) => (
          <Link key={page.slug} href={`/cybersecurity/${page.slug}`} className="course-card">
            <div className="course-card__meta">
              <span className="chip chip--accent">{page.title}</span>
            </div>
            <h3>{page.title}</h3>
            <p className="muted">{page.summary}</p>
            <div className="course-card__footer">
              <span className="footnote">Open notes</span>
              <span aria-hidden="true">{"\u003e"}</span>
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
          <li>Public guidance from national cybersecurity centres and regulators</li>
          <li>Documentation and whitepapers from major cloud and security vendors</li>
          <li>Textbooks and open course materials from recognised universities and professional bodies</li>
        </ul>
      </section>
    </Layout>
  );
}
