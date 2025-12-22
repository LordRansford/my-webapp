import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function ThreatModellingLiteWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Threat modelling lite",
        description: "Run a STRIDE-style walkthrough without diagrams.",
        level: "Tools",
        slug: "/tools/cyber/threat-modelling-lite",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Threat modelling lite</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Threat modelling lite</h1>
        <p className="lead">A fast, text-first threat review you can run in 20–40 minutes.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to identify credible threats, note the controls you already have, and capture follow-up actions. It’s intentionally lightweight:
          enough structure to avoid hand-waving, without requiring full data flow diagrams.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Before a feature ships: new auth flows, uploads, payments, admin actions.</li>
          <li>After an incident: ensure similar paths are covered across the product.</li>
          <li>Vendor integration review: understand the new trust boundary.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>System summary</strong>: what it does, key users, and critical assets.
          </li>
          <li>
            <strong>Entry points</strong>: APIs, web UI, jobs, imports/exports, admin panels.
          </li>
          <li>
            <strong>Trust boundaries</strong>: where data crosses teams/systems/vendors.
          </li>
        </ul>
        <p>Common mistakes: modelling “hackers” generically, skipping abuse cases, and forgetting operational threats (secrets, logging, backups).</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Threat list</strong>: grouped by STRIDE (spoofing, tampering, repudiation, information disclosure, DoS, elevation).
          </li>
          <li>
            <strong>Actions</strong>: concrete mitigations with owners and validation steps.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Feature: CSV import to create users
Entry points: upload endpoint, background processing job

Output:
Threats: DoS via large files; tampering via formula injection; elevation via role field abuse
Actions: file size limits; sanitize CSV; validate role assignments server-side; add audit logs.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Not a formal threat model; use alongside deeper review for high-risk systems.</li>
          <li>No diagramming or automated scanning — it’s a structured checklist approach.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


