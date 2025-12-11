import Link from "next/link";
import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout
      title="About - Ransford's Notes"
      description="Why I created Ransford's Notes and how I hope it helps you learn."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>About</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">About</p>
        <h1>Why I created Ransfords Notes</h1>
        <p className="lead">
          I moved from mechanical engineering into data and digitalisation. The jargon, diagrams, and layered
          models were a shock. Writing my own explanations, sketches, and experiments helped. These notes are
          that journey, cleaned up for anyone who wants a clearer path.
        </p>
      </header>

      <section className="section">
        <h2>What I am trying to achieve</h2>
        <ul>
          <li>Demystify key ideas in cybersecurity, software architecture, AI, and engineering.</li>
          <li>Provide a safe, practical place to experiment with browser sandboxes.</li>
          <li>Help people pivot careers or move into digital roles without feeling lost.</li>
          <li>Support educators who want learners to understand real systems, not just theory.</li>
          <li>Keep practising and sharing openly, improving with feedback.</li>
        </ul>
      </section>

      <section className="section">
        <h2>How the site is designed</h2>
        <p>
          Each lesson is written as if I am explaining the topic to my past self. I define terms, keep jargon
          light, and show how ideas connect across disciplines. Notes are paired with exercises and
          sandboxes, so you can apply ideas straight away. You can add pictures and videos with markdown
          images (<code>![alt text](path)</code>) or embed video using standard HTML.
        </p>
      </section>

      <section className="section">
        <h2>How you can get involved</h2>
        <p>
          If you want to collaborate, suggest topics, or contribute material, I am open to it. I value
          curiosity, integrity, and clarity over titles. If you share those values and want to help others
          learn, there is room here for you.
        </p>
      </section>
    </Layout>
  );
}
