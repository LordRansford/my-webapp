import Link from "next/link";
import Layout from "@/components/Layout";

const games = [
  {
    slug: "defend-the-stack",
    title: "Defend the Stack",
    summary: "Map controls to OSI layers and stop the attacks while respecting the CIA triad.",
    chip: "Security",
  },
  {
    slug: "design-the-system",
    title: "Design the System",
    summary: "Place architecture components into the right zones to reinforce separation of concerns.",
    chip: "Architecture",
  },
  {
    slug: "tiny-model",
    title: "Train a Tiny Model",
    summary: "Label points and train a browser-only classifier with TensorFlow.js.",
    chip: "AI",
  },
];

export default function GamesIndex() {
  return (
    <Layout
      title="Games - Ransford's Notes"
      description="Premium mini-games that teach architecture, security, and AI — all browser-based."
    >
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Play and learn</p>
          <h1>Mini-games for secure systems thinking</h1>
          <p className="lead">
            Browser-native, accessibility-friendly games aligned to your courses. No third-party assets, no
            tracking, and designed for phones, tablets, and desktops.
          </p>
          <div className="actions">
            <Link href="/tools" className="button ghost">
              Open labs
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <p className="eyebrow">Governance first</p>
          <ul className="hero-list">
            <li>
              <span className="dot dot--accent" />
              Client-side only — protects confidentiality
            </li>
            <li>
              <span className="dot dot--accent" />
              High-contrast visuals with reduced motion friendly pacing
            </li>
            <li>
              <span className="dot dot--accent" />
              No proprietary art; simple vectors and shapes
            </li>
          </ul>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>Pick a game</h2>
          <span className="hint">Aligned with the notes and sandboxes</span>
        </div>
        <div className="course-grid">
          {games.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`} className="course-card">
              <div className="course-card__meta">
                <span className="chip chip--accent">{game.chip}</span>
              </div>
              <h3>{game.title}</h3>
              <p className="muted">{game.summary}</p>
              <div className="course-card__footer">
                <span className="footnote">Play in-browser</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
