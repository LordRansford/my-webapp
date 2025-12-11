import Link from "next/link";
import Layout from "@/components/Layout";

export default function ContactPage() {
  return (
    <Layout
      title="Contact - Ransford's Notes"
      description="Get in touch with questions, feedback, or collaboration ideas."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Contact</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lead">
          I am happy to hear about collaborations, classroom use, speaking, corrections, or simply that an
          explanation finally clicked.
        </p>
      </header>

      <section className="section">
        <h2>Preferred channels</h2>
        <p>Email works best for anything detailed.</p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a className="text-link" href="mailto:ransford@ransfordsnotes.com">
              ransford@ransfordsnotes.com
            </a>
          </li>
          <li>
            <strong>LinkedIn:</strong>{" "}
            <Link className="text-link" href="/contact">
              Request my LinkedIn profile
            </Link>
          </li>
          <li>
            <strong>GitHub:</strong> For code and experiments.
            <a className="text-link" href="https://github.com/LordRansford" target="_blank" rel="noreferrer">
              github.com/LordRansford
            </a>
          </li>
        </ul>
        <p>
          If you are writing about something specific, include who you are, why you are reaching out, and any
          useful links. It helps me reply clearly and quickly.
        </p>
        <p className="muted">
          I aim to reply within a few working days. If I am slow, it is because I am juggling work and this
          project, not because your note is unimportant.
        </p>
      </section>
    </Layout>
  );
}
