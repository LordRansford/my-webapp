import Layout from "@/components/Layout";
import CPDDisclaimer from "@/components/cpd/CPDDisclaimer";
import { ACCREDITATION_MAP } from "@/lib/cpd/accreditation-map";

export default function ApplyPage() {
  const bodies = [
    {
      id: "cpd_certification_service",
      name: "CPD Certification Service",
      status: "ready",
      notes: "Evidence pack ready. Application can proceed.",
    },
    {
      id: "bcs",
      name: "BCS, The Chartered Institute for IT",
      status: "ready",
      notes: "Evidence pack ready. Application can proceed.",
    },
    {
      id: "iet",
      name: "Institution of Engineering and Technology (IET)",
      status: "ready",
      notes: "Evidence pack ready. Application can proceed.",
    },
    {
      id: "engineering_council",
      name: "Engineering Council",
      status: "pending",
      notes: "Requires additional mapping to UK-SPEC competencies.",
    },
    {
      id: "ico_aligned",
      name: "ICO Aligned Learning",
      status: "ready",
      notes: "Evidence pack ready for data protection and privacy courses.",
    },
  ];

  const evidenceReady = [
    "Course syllabi with learning objectives",
    "Assessment methods documentation",
    "Evidence capture mechanisms",
    "Sample certificates",
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
          <h1>Accreditor Application Checklist</h1>
          <p className="lead">
            This page tracks what evidence is ready and what still needs manual submission for CPD accreditation
            applications.
          </p>
        </header>

        <CPDDisclaimer className="mb-8" />

        <section className="section">
          <h2>Evidence Ready</h2>
          <p>The following evidence is prepared and available for download:</p>
          <ul className="list">
            {evidenceReady.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-4">
            <a href="/api/cpd/accreditation-pack" className="link" download>
              Download accreditation evidence pack
            </a>
          </p>
        </section>

        <section className="section">
          <h2>Manual Submission Required</h2>
          <p>The following steps require manual action:</p>
          <ul className="list">
            {manualSubmission.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Accreditor Status</h2>
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
                    {body.status === "ready" ? "Ready" : "Pending"}
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
