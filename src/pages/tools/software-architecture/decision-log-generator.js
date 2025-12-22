import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function DecisionLogGeneratorWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Decision log generator",
        description: "Create clear, auditable records of decisions and rationale.",
        level: "Tools",
        slug: "/tools/software-architecture/decision-log-generator",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Decision log generator</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Decision log generator</h1>
        <p className="lead">A consistent format for decisions that survives staff turnover and audit questions.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>Use this workspace to write decisions with context, options, and rationale. It reduces repeated debate and clarifies trade-offs.</p>
        <p>It is not a substitute for technical review, threat modelling, or architecture validation.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: capture a decision and why alternatives were rejected.</li>
          <li>Architecture validation: record constraints and non-functional requirements.</li>
          <li>Incident learning: document decisions made during recovery and why.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Decision</strong>: what was decided, in one sentence.
          </li>
          <li>
            <strong>Context</strong>: constraints, goals, and stakeholders.
          </li>
          <li>
            <strong>Options</strong>: 2 to 4 realistic alternatives.
          </li>
        </ul>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Decision record</strong>: a short entry you can store alongside code or project docs.
          </li>
          <li>
            <strong>Audit trail</strong>: clear rationale and trade-offs.
          </li>
        </ul>

        <h2>Example (short)</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Decision: Use managed Postgres for production storage
Context: Need backups, observability, and predictable scaling
Options: SQLite, managed Postgres, self-hosted Postgres
Rationale: Operational burden and reliability
Consequences: Higher cost, simpler operations`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Static template only. Quality depends on honesty and specificity.</li>
          <li>Keep entries short. Link to deeper docs rather than duplicating them.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}



