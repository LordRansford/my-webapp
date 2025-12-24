import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function TrustPage() {
  return (
    <Layout title="Trust - Ransford's Notes" description="How this platform stays accurate, transparent, and learner-safe.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Trust" }]}>
        <header className="page-header">
          <p className="eyebrow">Trust</p>
          <h1>Why you can rely on this platform</h1>
          <p className="lead">
            Plain, engineering-style explanations, transparent sources, and careful tools. Everything here is built to be useful for real
            work and self-directed CPD, without overclaiming or hype.
          </p>
        </header>

        <section className="section">
          <h2>Mission and philosophy</h2>
          <p>
            Give engineers, analysts, and technical leaders a quiet place to learn and practise. The aim is to reduce noise, keep examples
            realistic, and pair notes with hands-on exercises so you can see concepts in action.
          </p>
        </section>

        <section className="section">
          <h2>Why this platform exists</h2>
          <p>
            Many people are asked to make technical decisions without clear, vendor-neutral explanations. This site exists to fill that gap
            with careful writing, runnable tools, and realistic scenarios that respect your time and attention.
          </p>
        </section>

        <section className="section">
          <h2>Commitment to accuracy and transparency</h2>
          <ul className="list">
            <li>Uses primary sources and recognised standards where possible.</li>
            <li>Updates content when frameworks or guidance change.</li>
            <li>Explains assumptions and trade-offs in plain language.</li>
            <li>Clearly marks educational models versus production-ready patterns.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Tools are educational and exploratory</h2>
          <p>
            Interactive labs and templates run in the browser and are designed for understanding, not for handling sensitive data. They help
            you build intuition before applying ideas in production with your own controls and reviews.
          </p>
        </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
