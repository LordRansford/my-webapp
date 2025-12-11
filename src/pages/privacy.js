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
        <h1>Privacy Policy</h1>
        <p className="lead">
          I take privacy seriously. I collect as little information as possible while still providing a
          useful service.
        </p>
      </header>

      <section className="section">
        <h2>What information I collect</h2>
        <ol>
          <li>
            <strong>When you browse the site</strong>: basic technical information such as IP address,
            browser type, approximate location, and pages visited may be collected via privacy-friendly
            analytics. It does not include your name or direct identifiers.
          </li>
          <li>
            <strong>When you subscribe</strong>: your email address and the time of subscription and consent.
            Used only to send you updates.
          </li>
          <li>
            <strong>When you contact me</strong>: whatever you choose to share in your message, used only to
            respond and keep context.
          </li>
        </ol>
      </section>

      <section className="section">
        <h2>How I use your information</h2>
        <ul>
          <li>Operate and improve the site.</li>
          <li>Communicate with subscribers and respond to messages.</li>
          <li>Understand which topics are most valuable to prioritise future content.</li>
        </ul>
        <p>I do not sell your data and I do not share it with advertisers.</p>
      </section>

      <section className="section">
        <h2>Cookies and analytics</h2>
        <p>
          Cookies may be used to remember preferences, support essential functions, and enable anonymous
          analytics. Analytics, when enabled, avoid tracking you across sites and collect only aggregated
          statistics. Where required, the site will request consent.
        </p>
      </section>

      <section className="section">
        <h2>Third party services</h2>
        <p>
          Hosting, email, and payments (if you donate) are handled by third parties chosen for their security
          and compliance. They process data only on my instructions and for the stated purpose.
        </p>
      </section>

      <section className="section">
        <h2>Your rights</h2>
        <p>
          Depending on your jurisdiction you may have rights to access, correct, delete, or object to certain
          processing. Contact me with any request; I will respond in line with legal obligations.
        </p>
      </section>

      <section className="section">
        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated when features or regulations change. The date will be updated and
          significant changes may be highlighted.
        </p>
      </section>
    </Layout>
  );
}
