import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function ProcessFrictionMapperWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Process friction mapper",
        description: "Identify where process slows delivery or creates risk.",
        level: "Tools",
        slug: "/tools/digitalisation/process-friction-mapper",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Process friction mapper</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Process friction mapper</h1>
        <p className="lead">A structured way to spot bottlenecks, rework loops, and risk hotspots.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to map a process at a practical level (steps, handoffs, queues), then identify where it creates delay, rework, or quality risk. It’s
          designed for digitalisation efforts where you need to improve flow before automating.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Before automating: make sure you’re not automating a broken workflow.</li>
          <li>Operating model review: handoffs between teams are slow or error-prone.</li>
          <li>Service improvement: frequent escalations, rework, or unclear ownership.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Process scope</strong>: start/end boundaries and the primary customer outcome.
          </li>
          <li>
            <strong>Steps & handoffs</strong>: who does what, and where work waits.
          </li>
          <li>
            <strong>Friction signals</strong>: delays, rework, defects, compliance risk, tooling gaps.
          </li>
        </ul>
        <p>Common mistakes: mapping “happy path” only and ignoring exceptions and approvals.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Top friction points</strong>: ranked by impact and frequency.
          </li>
          <li>
            <strong>Improvement actions</strong>: clarify ownership, reduce approvals, standardize inputs, simplify tooling.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Process: onboarding a new supplier
Friction: 5 approvals, missing docs cause rework, long queue for security review

Output:
Top issues: unclear doc checklist; approval bottleneck; duplicate data entry
Actions: standard checklist + intake form; risk-tiered review; single source of supplier record.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Not a BPMN tool; it captures structured notes for improvement.</li>
          <li>No workflow automation — you use outputs to drive changes.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


