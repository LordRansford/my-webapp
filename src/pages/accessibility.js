import Link from "next/link";
import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function AccessibilityPage() {
  return (
    <Layout
      title="Accessibility - Ransford's Notes"
      description="How I aim to make Ransford's Notes usable by as many people as possible."
    >
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]}>
        <header className="page-header">
          <p className="eyebrow">Accessibility</p>
          <h1>Accessibility Statement</h1>
        <p className="lead">
          I want the site to work well for different devices, assistive technologies, and personal
          preferences.
        </p>
      </header>

      <section className="section">
        <h2>What I have done</h2>
        <ul>
          <li>Use semantic HTML so screen readers interpret content correctly.</li>
          <li>Provide strong colour contrast between text and backgrounds.</li>
          <li>Support keyboard navigation for key interactions.</li>
          <li>Avoid relying only on colour to convey meaning.</li>
          <li>Use clear headings and structure for easy scanning.</li>
          <li>Keep animation subtle and respect reduced motion preferences.</li>
        </ul>
      </section>

      <section className="section">
        <h2>What I plan to improve</h2>
        <ul>
          <li>Better screen reader hints in interactive tools.</li>
          <li>Clearer focus styles for keyboard users.</li>
          <li>More testing with different assistive technologies.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Known limitations</h2>
        <ul>
          <li>Some interactive labs use custom UI elements that may need more screen reader hints.</li>
          <li>Speech synthesis quality varies by device and browser.</li>
          <li>Some pages mix older styles and newer styles while the platform is being upgraded.</li>
        </ul>
      </section>

      <section className="section">
        <h2>How you can help</h2>
        <p>
          If you spot an accessibility problem, please tell me what page or tool you were using, what you were
          trying to do, what went wrong, and any assistive technology or browser you use. It will help me fix
          it faster.
        </p>
        <p>
          Contact: <a className="link" href="mailto:hello@ransfordsnotes.example">hello@ransfordsnotes.example</a>
        </p>
      </section>

      <section className="section">
        <h2>Commitment</h2>
        <p>
          Accessibility is part of the core values of this project. I will keep refining the site to remove
          barriers and follow recognised guidelines as closely as possible.
        </p>
      </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
