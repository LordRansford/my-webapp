import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function MetricsDefinitionStudioWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Metrics definition studio",
        description: "Define useful metrics and avoid vanity measurements.",
        level: "Tools",
        slug: "/tools/data/metrics-definition-studio",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Metrics definition studio</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Metrics definition studio</h1>
        <p className="lead">A structured worksheet for defining metrics that drive decisions.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to define a metric end-to-end: what decision it supports, how it’s calculated, what “good” looks like, and how it can be gamed. The
          outcome is a metric definition you can share across teams and implement consistently.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Building dashboards: align on definitions before instrumenting.</li>
          <li>Setting OKRs: ensure metrics reflect outcomes, not activity.</li>
          <li>After surprises: refine metrics that misled decisions.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Decision</strong>: what you will do differently based on this number.
          </li>
          <li>
            <strong>Definition</strong>: numerator/denominator, time window, filters, exclusions.
          </li>
          <li>
            <strong>Data sources</strong>: where events/records come from and their known quality issues.
          </li>
        </ul>
        <p>Common mistakes: mixing multiple concepts, unclear time windows, and not documenting exclusions.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Metric spec</strong>: name, intent, calculation, owner, refresh cadence, data lineage.
          </li>
          <li>
            <strong>Interpretation notes</strong>: what it does/doesn’t mean, leading indicators, anti-gaming checks.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Metric: “Activation rate”
Definition: % of new users completing 3 key actions within 7 days

Output:
Spec: activation_rate_7d = activated_users_7d / new_users
Notes: exclude internal accounts; monitor drop-offs per step; beware incentive gaming.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only: no live data connection or automated instrumentation.</li>
          <li>Doesn’t validate correctness of your tracking implementation.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


