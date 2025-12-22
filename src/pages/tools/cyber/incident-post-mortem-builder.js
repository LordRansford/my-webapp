import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function IncidentPostMortemBuilderWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Incident post-mortem builder",
        description: "Create learning-focused post-incident reviews and actions.",
        level: "Tools",
        slug: "/tools/cyber/incident-post-mortem-builder",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Incident post-mortem builder</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Incident post-mortem builder</h1>
        <p className="lead">A concise, blameless post-incident writeup structure with actionable follow-ups.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to capture what happened, what mattered, and what you’ll change. It’s designed to produce a document you can share with engineering,
          security, and leadership: factual timeline, impact, contributing factors, and prioritized actions.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>After outages or security incidents: capture learning while it’s fresh.</li>
          <li>After near-misses: document risks discovered before they became incidents.</li>
          <li>For recurring issues: compare patterns across multiple post-mortems.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Timeline</strong>: key events with timestamps (detection, escalation, mitigation, recovery).
          </li>
          <li>
            <strong>Impact</strong>: affected users/services, duration, data exposure (if any).
          </li>
          <li>
            <strong>Contributing factors</strong>: technical + process + human/system constraints.
          </li>
        </ul>
        <p>Common mistakes: guessing root cause without evidence, skipping customer impact, and creating vague actions (“improve monitoring”).</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Post-mortem draft</strong>: summary, impact, timeline, contributing factors, what went well, what didn’t.
          </li>
          <li>
            <strong>Action list</strong>: prevention, detection, response, recovery — each with owner and verification.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Incident: Elevated 500s on checkout API (45 min)
Cause: DB connection pool exhaustion after deploy

Output:
Actions:
1) Add pool saturation alert + runbook (Owner: SRE, Verify: alert fires in staging)
2) Add load test for checkout critical path (Owner: Eng, Verify: CI gate)
3) Implement gradual rollout + auto rollback (Owner: Platform, Verify: canary policy)`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Does not integrate with incident tooling; you copy outputs into your system of record.</li>
          <li>Not legal or regulatory advice; involve the right stakeholders when required.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


