import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function TechnicalDebtQualifierWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Technical debt qualifier",
        description: "Describe and prioritise technical debt with impact, cost, and risk.",
        level: "Tools",
        slug: "/tools/software-architecture/technical-debt-qualifier",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Technical debt qualifier</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Technical debt qualifier</h1>
        <p className="lead">A practical way to describe debt so it can compete fairly for roadmap time.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to turn “we should refactor this” into an actionable, evidence-backed entry: what’s broken, what it costs, what risk it creates, and
          what a reasonable fix looks like. It’s optimized for decision-making, not blame.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Planning: decide what debt to tackle in the next quarter.</li>
          <li>After incidents: capture contributing factors and preventative work.</li>
          <li>Before scaling: fix structural constraints that will slow delivery.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Debt description</strong>: what it is and where it lives (service/module).
          </li>
          <li>
            <strong>Impact</strong>: user pain, delivery slowdown, reliability issues, security exposure.
          </li>
          <li>
            <strong>Cost to fix</strong>: rough effort range + dependencies + rollout risk.
          </li>
        </ul>
        <p>Common mistakes: writing vague entries, skipping evidence, and underestimating rollout/testing effort.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Debt card</strong>: problem, symptoms, impact, evidence, recommended approach.
          </li>
          <li>
            <strong>Priority suggestion</strong>: now / next / later with rationale and triggers.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Debt: Shared database schema coupling 4 services
Evidence: weekly incidents from migrations; delivery blocked on coordination

Output:
Priority: Next
Approach: introduce contract tests + migration pipeline; split schemas by bounded context over 6–10 weeks; add feature flags for rollout.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Not an estimation tool; effort ranges are directional.</li>
          <li>Does not replace incident analysis or architecture review for complex systems.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


