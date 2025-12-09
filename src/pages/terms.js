import Link from "next/link";
import Layout from "@/components/Layout";

export default function TermsPage() {
  return (
    <Layout
      title="Terms of Use · Ransford's Notes"
      description="Understand the terms and conditions for using Ransford's Notes."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Terms of Use</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Terms</p>
        <h1>Terms of Use</h1>
        <p>
          By accessing and using Ransford&apos;s Notes you agree to the following
          terms. Please read them carefully.
        </p>
      </header>

      <section className="section">
        <h2>Intellectual property</h2>
        <p>
          All original content on this site, including text, code examples, and
          graphics, is © Ransford&apos;s Notes. You may quote or reference
          material with appropriate attribution. Please do not republish articles
          in full without permission.
        </p>
      </section>

      <section className="section">
        <h2>Disclaimer</h2>
        <p>
          The information provided is for educational purposes only. While I
          strive for accuracy, I cannot guarantee that all content is error-free
          or up to date. Use your judgement before applying any advice in
          production systems.
        </p>
      </section>

      <section className="section">
        <h2>External links</h2>
        <p>
          The site may contain links to third-party websites. I am not
          responsible for the content or privacy practices of those sites.
          Linking does not equal endorsement.
        </p>
      </section>

      <section className="section">
        <h2>User conduct</h2>
        <p>
          Please do not misuse the site. That includes attempting to breach
          security, posting malicious code, or harassing others. I may limit or
          revoke access if misuse is detected.
        </p>
      </section>

      <section className="section">
        <h2>Changes to these terms</h2>
        <p>
          These terms may change over time. The latest version will always be
          available on this page. Continuing to use the site after changes take
          effect means you accept the revised terms.
        </p>
      </section>

      <section className="section">
        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:legal@ransfordsnotes.com">legal@ransfordsnotes.com</a>.
        </p>
      </section>
    </Layout>
  );
}
