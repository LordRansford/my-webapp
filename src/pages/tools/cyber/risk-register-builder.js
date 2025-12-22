import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function RiskRegisterBuilderWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Risk register builder",
        description: "Structure and prioritise risks with likelihood, impact, and mitigation.",
        level: "Tools",
        slug: "/tools/cyber/risk-register-builder",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Risk register builder</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Risk register builder</h1>
        <p className="lead">A structured way to record risks, prioritise work, and track mitigations over time.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>Use this workspace to capture risks consistently and make trade-offs visible. It supports prioritisation, reporting, and accountability.</p>
        <p>It is not a compliance certificate and it does not replace a real risk process or governance forum.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: record risks introduced by a new system or change.</li>
          <li>Pre-decision analysis: compare mitigations and decide what to do first.</li>
          <li>Governance: maintain a clear list of owned, reviewed risks.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Risk statement</strong>: asset, threat, vulnerability, and consequence in one sentence.
          </li>
          <li>
            <strong>Likelihood and impact</strong>: simple scales with a short justification.
          </li>
          <li>
            <strong>Mitigation</strong>: controls, owner, and due date.
          </li>
        </ul>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Prioritised entries</strong>: which risks should be handled first.
          </li>
          <li>
            <strong>Decision cues</strong>: what is being accepted, treated, transferred, or terminated.
          </li>
        </ul>

        <h2>Example (short)</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Risk: Account takeover via credential stuffing
Likelihood: High (observed in logs)
Impact: Major (customer loss, fraud)
Mitigation: MFA + rate limiting + alerting
Owner: Security lead
Status: In progress`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Browser-first and static. Treat outputs as working notes.</li>
          <li>Scales are subjective. Write justifications so the numbers mean something.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}



