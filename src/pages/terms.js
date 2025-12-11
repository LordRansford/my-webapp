import Link from "next/link";
import Layout from "@/components/Layout";

export default function TermsPage() {
  return (
    <Layout
      title="Terms - Ransford's Notes"
      description="The terms of use for the site, courses, and tools."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Terms</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Terms</p>
        <h1>Know how the site can be used</h1>
        <p className="lead">
          By using this site you agree to use the content responsibly. Labs are provided as-is; they run
          fully client-side so nothing you type is stored.
        </p>
      </header>

      <section className="section">
        <h2>Acceptable use</h2>
        <ul>
          <li>Use the content for learning and professional development.</li>
          <li>Do not attempt to attack or probe the site infrastructure.</li>
          <li>Attribute content if you reuse it and avoid misrepresentation.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Liability</h2>
        <p>
          All tools run locally in your browser. I am not responsible for issues arising from their use. Use
          the guidance at your own discretion and validate it in your environment.
        </p>
      </section>
    </Layout>
  );
}
