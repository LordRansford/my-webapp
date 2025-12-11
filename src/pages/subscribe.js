import Link from "next/link";
import Layout from "@/components/Layout";

export default function SubscribePage() {
  return (
    <Layout
      title="Subscribe - Ransford's Notes"
      description="Get updates on new courses, labs, and architecture patterns."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Subscribe</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Newsletter</p>
        <h1>Stay ahead with field-tested notes</h1>
        <p className="lead">
          Receive short, practical updates when new labs drop or architecture patterns are published. No
          spam, just techniques you can apply immediately.
        </p>
      </header>

      <section className="section">
        <h2>Join the list</h2>
        <p>Hook this form up to your email service (e.g. Buttondown, Listmonk, or Mailchimp).</p>
        <form className="stack" action="#" method="post">
          <label className="control">
            Email
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <button className="button primary" type="submit">
            Subscribe
          </button>
          <p className="muted">
            We value privacy. Unsubscribe anytime. Replace the action with your provider endpoint to enable
            submissions.
          </p>
        </form>
      </section>
    </Layout>
  );
}
