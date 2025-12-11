import Link from "next/link";
import Layout from "@/components/Layout";

export default function PrivacyPage() {
  return (
    <Layout
      title="Privacy - Ransford's Notes"
      description="How your data is handled across the courses, labs, and newsletter."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Privacy</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Privacy</p>
        <h1>Respectful, minimal data use</h1>
        <p className="lead">
          The labs run entirely in your browser. No code or data is sent to a server. Analytics, if enabled,
          will be privacy-preserving and opt-in.
        </p>
      </header>

      <section className="section">
        <h2>What is collected</h2>
        <ul>
          <li>Anonymous usage metrics to improve content (when turned on).</li>
          <li>Email address only if you choose to subscribe.</li>
          <li>Technical error logs with no payload data.</li>
        </ul>
      </section>

      <section className="section">
        <h2>What is not collected</h2>
        <ul>
          <li>No code you run in the Python or RSA labs.</li>
          <li>No personal data from MDX course content files.</li>
          <li>No ad tracking pixels.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Your choices</h2>
        <p>Reach out via the contact page to request data export or deletion of subscription data.</p>
      </section>
    </Layout>
  );
}
