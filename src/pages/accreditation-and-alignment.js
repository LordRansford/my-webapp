import Link from "next/link";
import Layout from "@/components/Layout";

export default function AccreditationAndAlignment() {
  return (
    <Layout
      title="Accreditation and Alignment"
      description="How the notes align with professional frameworks and how to use them responsibly."
    >
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Accreditation and Alignment</h1>
          <p className="lead">
            How the notes align with common professional frameworks, how to use them for CPD responsibly, and what I do (and absolutely do not)
            claim. No hype. No implied endorsements. No “trust me” footnotes.
          </p>
        </header>

        <section className="section">
          <h2>What this site is</h2>
          <p>
            Ransford&apos;s Notes is a personal learning and teaching project. The notes reflect my understanding and
            experience and are built on top of official documentation, standards, and widely accepted best practice.
            They are designed to support serious learning and to complement, not replace, official training and
            certification.
          </p>
          <p className="muted">
            Where I reference qualifications or professional activities (for example, TOGAF® certification or IMechE volunteering), I link to public
            verification sources where possible. See{" "}
            <Link className="text-link" href="/about#credentials">
              credentials & verification
            </Link>
            .
          </p>
        </section>

        <section className="section">
          <h2>Alignment with professional frameworks</h2>
          <p>
            Each notes track is aligned with widely recognised frameworks and bodies of knowledge. The aim is to help
            learners build the depth they need to succeed in formal training and on the job.
          </p>
          <ul className="list">
            <li>
              <strong>Cybersecurity Notes</strong> draw on concepts found in internationally recognised certification
              bodies and national guidance. The structure mirrors common domain breakdowns and emphasises foundational
              thinking, secure design, and practical skills.
            </li>
            <li>
              <strong>Artificial Intelligence Notes</strong> are influenced by responsible artificial intelligence
              guidance from leading technology companies and research institutions. They touch on model basics, data
              quality, evaluation, and ethical considerations.
            </li>
            <li>
              <strong>Software Architecture Notes</strong> follow patterns that are common in modern architecture
              practice such as layered architectures, domain driven design, microservices, event driven systems, and
              cloud native design.
            </li>
            <li>
              <strong>Digitalisation Strategy Notes</strong> reflect common patterns in public and private sector
              digital programmes such as outcome based planning, capability mapping, platform thinking, and ecosystem
              awareness.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Continuing professional development</h2>
          <p>
            Many professional bodies recognise structured self study as valid continuing professional development. If
            you are a member of such a body, you may be able to log time spent working through these notes, quizzes, and
            tools as self directed learning, subject to their rules.
          </p>
          <p>
            The approximate time required for each notes track and the amount of practice work involved will be made
            clear on the relevant pages so that you can record learning time accurately in your own records.
          </p>
          <p>
            At this stage the site does not issue formal certificates that carry external accreditation. As the project
            matures I may seek formal CPD accreditation for selected tracks. If that happens it will be clearly
            signposted and supported with appropriate documentation.
          </p>
          <div className="callout callout--warning">
            <div className="callout__header">
              <p className="callout__title">A note on “CPD-aligned” versus “accredited”</p>
            </div>
            <div className="callout__body">
              <p className="muted">
                “CPD-aligned” here means the learning is structured and evidence-friendly (time estimates, outcomes, exercises, and exportable
                summaries). It does not mean a professional body has endorsed it, unless a specific page explicitly says so and provides the
                supporting documentation.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>How to read and use the notes</h2>
          <p>
            The notes are written to be read in order within each level and then revisited. They are not a substitute
            for hands on work in your own environment, but they should give you the confidence to try new tools, ask
            more precise questions, and understand what you are seeing when you do.
          </p>
          <p>
            Where possible I link out to official documentation and standards so that you can check definitions and see
            the original sources. When you use the notes to support professional work, you should combine them with
            those official references and the policies and standards that apply in your own organisation and
            jurisdiction.
          </p>
        </section>

        <section className="section">
          <h2>Limitations and responsibilities</h2>
          <p>
            These notes are intended as educational material. They are not legal advice, are not a substitute for
            professional consultancy, and do not guarantee examination success. Any use of ideas from this site in a
            production or regulatory context must be checked against the relevant laws, standards, and internal
            policies.
          </p>
          <p className="muted">
            Trademarks: TOGAF® is a registered trademark of The Open Group. “Institution of Mechanical Engineers” and “IMechE” are trademarks of
            their respective owners.
          </p>
        </section>
      </main>
    </Layout>
  );
}

