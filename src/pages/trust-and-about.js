import Link from "next/link";
import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function TrustAndAbout() {
  return (
    <Layout
      title="Trust and About Ransford"
      description="Who I am, why I built Ransford's Notes, and how I try to keep it accurate, safe, and useful."
    >
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Trust and About" }]}>
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Trust and About Ransford</h1>
          <p className="lead">
            A short, unapologetically practical explanation of who I am, why this site exists, and how I try to keep it accurate (without
            pretending the internet is a sacred place.
          </p>
          <div className="actions">
            <Link className="button primary" href="/about">
              Read the full About page
            </Link>
            <a className="button ghost" href="#verification">
              Verification links
            </a>
          </div>
        </header>

        <section className="section">
          <h2>Why this site exists</h2>
          <p>
            A lot of technical content fails not because the topic is too hard, but because the explanation is too vague. Concepts are wrapped in
            unexplained jargon, assumptions are left unstated, and one missed step turns the whole thing into interpretive dance.
          </p>
          <p>
            This site exists to do the opposite: slow down, show the logic, make the experiments runnable, and treat your attention like the
            limited resource it is.
          </p>
          <p>
            It is built for people who want depth and clarity (including neurodivergent learners who often need structure rather than vibes)
            and for anyone who is tired of “trust me” explanations.
          </p>
        </section>

        <section className="section">
          <h2>How I try to earn trust</h2>
          <p>
            Trust is mostly boring habits done consistently:
          </p>
          <ul className="list">
            <li>
              <strong>Primary sources first:</strong> standards, official docs, and vendor guidance where appropriate (and clearly marked when it is
              vendor guidance).
            </li>
            <li>
              <strong>Assumptions stated:</strong> if a concept depends on an assumption, it gets written down, not silently smuggled in.
            </li>
            <li>
              <strong>Models labelled as models:</strong> tools are educational, not production systems. If you should not paste secrets into it, it
              will say so.
            </li>
            <li>
              <strong>No overclaiming:</strong> no implied endorsements, no “accredited unless stated”, and no pretending CPD is a magical force-field.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Safety and data handling</h2>
          <p>
            The interactive tools on this site are built to be safe and educational. Still: do not paste real passwords, confidential work data,
            or sensitive personal information into tools. If you are learning security, treat that as practice for professional hygiene rather
            than a suggestion.
          </p>
          <p className="muted">
            If you spot a vulnerability or something that looks like a vulnerability, please use the security contact in the footer or the
            relevant policy page.
          </p>
        </section>

        <section className="section">
          <h2 id="verification">Verification links</h2>
          <ul className="list">
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a
                className="text-link"
                href="https://www.linkedin.com/in/ransford-amponsah-ceng-mimeche-togaf%C2%AE-79489a105/"
                target="_blank"
                rel="noreferrer"
              >
                View profile
              </a>
            </li>
            <li>
              <strong>TOGAF® Certified Practitioner (Credly):</strong>{" "}
              <a
                className="text-link"
                href="https://www.credly.com/badges/d36678f6-a316-46d9-8242-6b673d3b853e/public_url"
                target="_blank"
                rel="noreferrer"
              >
                View public badge
              </a>
            </li>
            <li>
              <strong>IMechE Council page:</strong>{" "}
              <a className="text-link" href="https://www.imeche.org/about-us/governance/council" target="_blank" rel="noreferrer">
                View council listing
              </a>
            </li>
          </ul>
          <div className="callout callout--info">
            <div className="callout__header">
              <p className="callout__title">Trademarks and independence</p>
            </div>
            <div className="callout__body">
              <p className="muted">
                TOGAF® is a registered trademark of The Open Group. “Institution of Mechanical Engineers” and “IMechE” are trademarks of their
                respective owners. This site is independent and is not endorsed by, sponsored by, or affiliated with The Open Group or IMechE
                unless explicitly stated.
              </p>
            </div>
          </div>
        </section>

      </StaticInfoTemplate>
    </Layout>
  );
}
