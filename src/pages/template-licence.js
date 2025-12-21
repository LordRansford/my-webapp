import Link from "next/link";
import Layout from "@/components/Layout";

export default function TemplateLicencePage() {
  return (
    <Layout title="Template licence" description="Placeholder policy for template usage and attribution.">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Template licence</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Templates</p>
        <h1>Template licence (placeholder)</h1>
        <p className="lead">This is a placeholder policy page. It is not enforced automatically yet.</p>
      </header>

      <section className="section">
        <h2>Attribution</h2>
        <p>Commercial users must keep author credit: “Template by Ransford’s Notes”.</p>
        <p>Internal use may remove branding.</p>
      </section>

      <section className="section">
        <h2>Redistribution</h2>
        <p>Donation or permission is required for commercial redistribution.</p>
      </section>

      <section className="section">
        <h2>Status</h2>
        <p>This page will be updated with final wording later.</p>
      </section>
    </Layout>
  );
}


