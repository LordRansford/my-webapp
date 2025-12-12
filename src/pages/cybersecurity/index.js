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
    summary: "Modern algorithms and protocols applied to real systems (publishing soon).",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Future-facing topics like post-quantum and zero trust (publishing soon).",
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
      description="Choose your level: beginner, intermediate, advanced, or summary with an interactive game."
    >
      <header className="page-header">
        <p className="eyebrow">Cybersecurity Notes</p>
        <h1>Read, practise, and level up</h1>
        <p className="lead">
          Pick the stage that fits you. Beginner for fundamentals, intermediate for applied crypto, advanced for
          forward-looking topics, and a summary page with a game to test yourself.
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
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
