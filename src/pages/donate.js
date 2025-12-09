import Link from "next/link";
import Layout from "@/components/Layout";

export default function DonatePage() {
  return (
    <Layout
      title="Donate · Ransford's Notes"
      description="Support the site and keep the educational content free for everyone."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Donate</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Support</p>
        <h1>Help this project grow</h1>
        <p>
          If you find value in these notes and tools, consider making a
          contribution. Your support helps cover hosting costs and funds new
          tutorials and interactive demos.
        </p>
      </header>

      <section className="section">
        <h2>One-time donations</h2>
        <p>
          A small one-off donation goes a long way. Click below to contribute via
          our payment processor (replace this link when your checkout is ready).
        </p>
        <p>
          <a
            className="button primary"
            href="https://example.com/donate"
            target="_blank"
            rel="noreferrer"
          >
            Donate now
          </a>
        </p>
      </section>

      <section className="section">
        <h2>Recurring support</h2>
        <p>
          I plan to offer a membership tier with deep-dive guides, live Q&amp;A,
          and behind-the-scenes updates. Register your interest and I will let
          you know when it is ready.
        </p>
        <p>
          <a
            className="button secondary"
            href="https://example.com/membership-interest"
            target="_blank"
            rel="noreferrer"
          >
            Register interest
          </a>
        </p>
      </section>

      <section className="section">
        <h2>Transparency</h2>
        <p>
          Every pound donated goes back into Ransford&apos;s Notes: hosting,
          domain registration, development time, and new learning experiments.
          I am exploring the option of a non-profit to formalise this
          commitment.
        </p>
      </section>
    </Layout>
  );
}
