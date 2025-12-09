import Link from "next/link";
import Layout from "@/components/Layout";

export default function PrivacyPage() {
  return (
    <Layout
      title="Privacy Policy · Ransford's Notes"
      description="Understand how Ransford's Notes handles personal information."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Privacy Policy</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Privacy</p>
        <h1>Our commitment to your privacy</h1>
        <p>
          We respect your privacy and work to ensure your information is
          protected. This policy explains what data we collect, why we collect
          it, and how we use it.
        </p>
      </header>

      <section className="section">
        <h2>What information we collect</h2>
        <ul>
          <li>
            <strong>Email addresses:</strong> If you subscribe or contact us, we
            collect your email address solely to communicate with you.
          </li>
          <li>
            <strong>Site analytics:</strong> We use privacy-focused analytics to
            understand site usage. This collects aggregate, anonymised data such
            as page views and time spent. It does not track you across sites or
            build profiles.
          </li>
          <li>
            <strong>Cookies:</strong> Essential cookies may store preferences
            like theme or form inputs. We do not use advertising cookies or
            trackers.
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>How we use your information</h2>
        <ul>
          <li>Send newsletters or updates that you requested.</li>
          <li>Respond to enquiries or support requests.</li>
          <li>Improve the content and performance of the site via aggregated analytics.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Third-party services</h2>
        <p>
          We may embed interactive demos or forms from trusted providers. These
          providers collect only what is necessary for their functionality. We
          do not share your information with advertisers or data brokers.
        </p>
      </section>

      <section className="section">
        <h2>Your choices</h2>
        <p>
          You can unsubscribe from emails at any time via the unsubscribe link
          in messages or by contacting us. You can clear cookies through your
          browser settings.
        </p>
      </section>

      <section className="section">
        <h2>Contact</h2>
        <p>
          Questions about this policy or a data request? Email{" "}
          <a href="mailto:privacy@ransfordsnotes.com">privacy@ransfordsnotes.com</a>.
        </p>
      </section>
    </Layout>
  );
}
