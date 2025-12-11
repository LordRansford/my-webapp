import Link from "next/link";
import Layout from "@/components/Layout";

export default function TermsPage() {
  return (
    <Layout
      title="Terms - Ransford's Notes"
      description="The terms of use for the site, notes, and tools."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Terms</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Terms</p>
        <h1>Terms of Use</h1>
        <p className="lead">
          By using this website you agree to the terms on this page. The goal is to keep the site safe and
          useful for everyone.
        </p>
      </header>

      <section className="section">
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not use the tools or examples for unlawful or harmful activities.</li>
          <li>Do not try to gain unauthorised access to systems or data.</li>
          <li>Do not disrupt the operation of the site or its infrastructure.</li>
          <li>Do not copy large sections of content and present them as your own.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Educational purpose</h2>
        <p>
          All content and tools are for education. They are not a substitute for professional advice or formal
          certification. You are responsible for how you apply what you learn in your own context.
        </p>
      </section>

      <section className="section">
        <h2>Intellectual property</h2>
        <p>
          Unless stated otherwise, the content is created by me, Ransford. You may quote with credit, use
          ideas in your own work, and share links. Please do not repost full articles or courses without
          permission or create commercial products based largely on copied content.
        </p>
      </section>

      <section className="section">
        <h2>Availability and changes</h2>
        <p>
          I aim to keep the site available, but cannot guarantee uninterrupted access. I may modify, suspend,
          or remove parts of the site for maintenance, security, or improvement.
        </p>
      </section>

      <section className="section">
        <h2>Disclaimer</h2>
        <p>
          I work to keep information accurate and current, but mistakes may occur. You use the site at your
          own risk. I am not liable for loss resulting from reliance on the content or tools.
        </p>
      </section>

      <section className="section">
        <h2>Updates</h2>
        <p>
          These terms may change. The date will be updated when that happens. Using the site after changes
          means you accept the updated terms.
        </p>
      </section>
    </Layout>
  );
}
