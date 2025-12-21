import Layout from "@/components/Layout";
import CPDDisclaimer from "@/components/cpd/CPDDisclaimer";
import { ACCREDITATION_MAP } from "@/lib/cpd/accreditation-map";

export default function ApplyPage() {
  const bodies = [
    {
      id: "cpd_certification_service",
      name: "CPD Certification Service",
      status: "pending",
      notes: "Submission preparation in progress. No approval is claimed.",
    },
  ];

  const evidenceReady = [
    "Course syllabi with learning objectives",
    "Assessment methods documentation",
    "Evidence capture mechanisms",
    "CPD hour calculation logic",
    "Quality assurance processes",
    "Audit log system",
    "Version control documentation",
  ];

  const manualSubmission = [
    "Completed application forms per accreditor",
    "Payment of application fees",
    "Review and approval process",
    "Ongoing compliance reporting",
  ];

  return (
    <Layout title="Accreditor Application Checklist" description="Evidence readiness and application status for CPD accreditors.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>CPD submission preparation checklist</h1>
          <p className="lead">
            This page tracks evidence preparation for a potential CPD submission. It does not imply accreditation, endorsement, or approval.
          </p>
        </header>

        <CPDDisclaimer className="mb-8" />

        <section className="section">
          <h2>Evidence prepared</h2>
          <p>The following evidence is prepared and can be shared with assessors as part of a submission:</p>
          <ul className="list">
            {evidenceReady.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-4">
            <a href="/api/cpd/accreditation-pack" className="link" download>
              Download CPD evidence pack
            </a>
          </p>
        </section>

        <section className="section">
          <h2>Manual steps</h2>
          <p>The following steps require manual action:</p>
          <ul className="list">
            {manualSubmission.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Submission status</h2>
          <div className="space-y-4">
            {bodies.map((body) => (
              <div key={body.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{body.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{body.notes}</p>
                  </div>
                  <span
                    className={`ml-4 rounded-full px-3 py-1 text-xs font-semibold ${
                      body.status === "ready"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {body.status === "ready" ? "Prepared" : "Preparing"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Course Coverage</h2>
          <p>Current courses mapped to accreditor requirements:</p>
          <ul className="list">
            {ACCREDITATION_MAP.map((mapping) => (
              <li key={mapping.courseId}>
                <strong>{mapping.courseId}</strong>: {mapping.cpdHours} CPD hours, applicable to{" "}
                {mapping.applicableBodies.length} accreditor body/bodies
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
