import Link from "next/link";
import Layout from "@/components/Layout";

export default function ContactPage() {
  return (
    <Layout
      title="Contact · Ransford's Notes"
      description="Get in touch with questions, feedback, or collaboration ideas."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Contact</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1>Let&apos;s talk</h1>
        <p>
          Have a question about a tutorial, want to suggest a topic, or discuss
          collaboration? Drop me a line. I am always happy to hear from readers
          and fellow builders.
        </p>
      </header>

      <section className="section">
        <h2>Email</h2>
        <p>
          The simplest way to reach me is via email. Click below and your email
          client will open a new message addressed to me.
        </p>
        <p>
          <a className="button primary" href="mailto:contact@ransfordsnotes.com">
            Send an email
          </a>
        </p>
      </section>

      <section className="section">
        <h2>LinkedIn</h2>
        <p>
          You can also connect with me on LinkedIn for updates and
          behind-the-scenes notes.
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/ransford-amponsah/"
            target="_blank"
            rel="noreferrer"
          >
            View my LinkedIn
          </a>
        </p>
      </section>
    </Layout>
  );
}
