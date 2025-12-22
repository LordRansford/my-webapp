import Layout from "@/components/Layout";

export default function AccreditationPage() {
  return (
    <Layout
      title="Accreditation - CPD Alignment"
      description="How courses, labs, and templates support CPD without overstating accreditation."
    >
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">CPD aligned</p>
          <h1>Accreditation and CPD alignment</h1>
          <p className="lead">
            This platform supports self-directed CPD with clear time estimates, practical work, and mapping to recognised skill areas. It
            does not claim formal endorsement unless explicitly stated.
          </p>
        </header>

        <section className="section">
          <h2>CPD-aligned learning</h2>
          <p>
            Courses, labs, and templates include realistic exercises and time guidance so you can log self-directed CPD hours responsibly.
            Outputs are suitable as evidence alongside your own notes and employer policies.
          </p>
        </section>

        <section className="section">
          <h2>How activities map to hours</h2>
          <ul className="list">
            <li>Courses and tracks list estimated minutes for reading and practice.</li>
            <li>Labs and templates call out expected effort and outcomes.</li>
            <li>My CPD evidence pages help you export summaries for your own records.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Formal accreditation stance</h2>
          <p>
            Formal accreditation is being explored where appropriate. Until then, treat all material as CPD-aligned learning you can log under
            self-directed categories, subject to your professional body’s rules.
          </p>
          <p className="text-muted">CPD certificates will be optional and available later.</p>
          <p className="text-muted">
            No certification, approval, or endorsement is implied unless explicitly announced with supporting documentation.
          </p>
        </section>

        <section className="section">
          <h2>Using this for self-directed CPD</h2>
          <p>
            Keep your own notes, reflections, and links to completed labs. Combine them with your organisation’s CPD policy and any
            membership guidance you follow. Where possible, pair outputs with evidence from your work environment.
          </p>
        </section>
      </main>
    </Layout>
  );
}
