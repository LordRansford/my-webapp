import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function ArchitectureTradeoffAnalysisWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Architecture trade-off analysis",
        description: "Compare architecture options against constraints and non-functional requirements.",
        level: "Tools",
        slug: "/tools/software-architecture/architecture-tradeoff-analysis",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Architecture trade-off analysis</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Architecture trade-off analysis</h1>
        <p className="lead">A browser-only workspace for structured, auditable option comparison — without diagrams.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to compare two or three architecture approaches against your constraints and non-functional requirements (NFRs) such as latency,
          reliability, security, operability, and cost. The goal is to make trade-offs explicit and defensible.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Choosing between build vs buy, or managed service vs self-hosted.</li>
          <li>Picking an integration style: event-driven vs API orchestration.</li>
          <li>Design review: justifying a choice to peers, security, or leadership.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Options</strong>: 2–3 named candidates (keep the set small).
          </li>
          <li>
            <strong>Constraints</strong>: things you cannot change (regulatory, platform, team skills, deadlines).
          </li>
          <li>
            <strong>NFR criteria</strong>: 6–10 criteria with a brief definition and importance.
          </li>
        </ul>
        <p>Common mistakes: too many options, vague criteria (“scalable”), or scoring without evidence.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Trade-off table</strong>: how each option performs per criterion with short evidence notes.
          </li>
          <li>
            <strong>Decision summary</strong>: recommended option + risks + follow-up validations.
          </li>
        </ul>
        <p>Use outputs to support a decision record. Do not treat a score as a substitute for engineering judgement.</p>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Options: (A) Monolith on managed PaaS, (B) Microservices on Kubernetes
Criteria: delivery speed, operability, cost predictability, fault isolation

Output:
Pick A for near-term delivery + simpler ops; accept reduced isolation.
Follow-ups: load test critical paths; define scale triggers for revisiting B.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only: no live benchmarking, tracing, or cost estimation.</li>
          <li>Produces structured thinking, not “the correct” architecture.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


