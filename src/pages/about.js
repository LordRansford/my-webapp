import Link from "next/link";
import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout title="About - Ransford's Notes" description="Who I am, why I build tools, and how this stays practitioner-first.">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>About</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">About</p>
        <h1>Ransford Chung Amponsah</h1>
        <p className="lead">
          Engineer turned digital and data practitioner. I prefer building tools and runnable examples over slides. This site reflects that
          mindset.
        </p>
      </header>

      <section className="section">
        <h2>Background</h2>
        <p>
          I started in mechanical engineering and moved into digital, data, AI, and regulation work. The shift required patient explanations,
          so I wrote my own and turned them into notes, labs, and templates. They are written to help people who need clear, practical
          guidance without noise.
        </p>
      </section>

      <section className="section">
        <h2>Why tools instead of slides</h2>
        <p>
          Real understanding comes from doing. That is why courses pair with browser-based tools, sandboxes, and templates. You can try ideas
          immediately, see outputs, and use them as CPD-aligned evidence.
        </p>
      </section>

      <section className="section">
        <h2>Practitioner mindset</h2>
        <ul>
          <li>Explain like an engineer: precise, testable, and referenced.</li>
          <li>Prioritise safety: browser-only labs, no sensitive data, clear limits.</li>
          <li>Stay current: update when standards or guidance change.</li>
          <li>Be honest: no inflated claims about accreditation or endorsements.</li>
        </ul>
      </section>
    </Layout>
  );
}
