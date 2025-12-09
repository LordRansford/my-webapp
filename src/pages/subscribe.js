import Link from "next/link";
import Layout from "@/components/Layout";

export default function SubscribePage() {
  return (
    <Layout
      title="Subscribe · Ransford's Notes"
      description="Subscribe to receive the latest posts and tools straight to your inbox."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Subscribe</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Subscribe</p>
        <h1>Stay up to date</h1>
        <p>
          Get the newest tutorials and tools delivered to your inbox. No spam,
          just practical notes and announcements. You can unsubscribe at any
          time.
        </p>
      </header>

      <section className="section">
        <h2>Join the list</h2>
        <p>
          We are setting up a mailing list with a trusted provider. In the
          meantime, register your interest via the link below. Replace this link
          with your real signup URL once your provider is live.
        </p>
        <p>
          <a
            className="button primary"
            href="https://example.com/newsletter-signup"
            target="_blank"
            rel="noreferrer"
          >
            Sign up for updates
          </a>
        </p>
        <p className="muted">
          Once the mailing service is live, this page will show an embedded
          form.
        </p>
      </section>
    </Layout>
  );
}
