import Link from "next/link";
import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function DonatePage() {
  return (
    <Layout
      title="Donate - Ransford's Notes"
      description="Support the continued creation of secure, hands-on learning resources."
    >
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Donate" }]}>
        <header className="page-header">
          <p className="eyebrow">Support</p>
          <h1>Help keep the labs online</h1>
          <p className="lead">
            Your support covers hosting, new interactive labs, and time to publish deeper security, architecture,
            and AI content. Every contribution keeps the site independent and focused on learners.
          </p>
        </header>

      <section className="section">
        <h2>Ways to support</h2>
        <ul>
          <li>One-off donation via your preferred provider.</li>
          <li>Sponsor a new lab or lesson topic; I&apos;ll acknowledge your support in the release notes.</li>
          <li>Share the site with a friend or colleague.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Ready to donate?</h2>
        <p>
          A secure payment option will be published here soon. If you would like to support now or sponsor a
          new lab, please reach out via the contact page.
        </p>
        <Link className="button primary" href="/contact">
          Contact to donate
        </Link>
      </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
