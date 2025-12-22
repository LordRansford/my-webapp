import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function LogicGatesWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Logic gate simulator",
        description: "Explore AND, OR, XOR and truth tables in a clean workspace.",
        level: "Tools",
        slug: "/tools/software-architecture/logic-gates",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Logic gate simulator</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Logic gate simulator</h1>
        <p className="lead">A simple workspace for digital logic fundamentals and clear mental models.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to build intuition for Boolean logic: gates, truth tables, and how complex decisions can be composed from simple rules. It is
          useful for beginners and for engineers who want to sharpen foundational reasoning.
        </p>
        <p>It is not an electronics simulator. It does not model timing, propagation delays, or hardware constraints.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Training: teach AND, OR, XOR and basic truth tables.</li>
          <li>Design review: explain how a decision rule can be decomposed into simple conditions.</li>
          <li>Pre-decision analysis: sanity check edge cases in a boolean rule set.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Gate selection</strong>: choose the logical operation.
          </li>
          <li>
            <strong>Input values</strong>: toggle inputs between 0 and 1.
          </li>
        </ul>
        <p>Common mistakes: confusing XOR with OR, or forgetting that truth tables cover all combinations.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Gate output</strong>: the result for the current input combination.
          </li>
          <li>
            <strong>Truth table</strong>: the full mapping of input combinations to outputs.
          </li>
        </ul>
        <p>Use outputs to support reasoning and teaching. Do not treat it as hardware verification.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Select a gate (AND, OR, XOR).</li>
          <li>Toggle inputs through combinations and observe output changes.</li>
          <li>Read the truth table and confirm your intuition matches it.</li>
          <li>Write a plain-English rule that corresponds to the truth table.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Gate: XOR
Inputs: A=1, B=1`}
        </pre>
        <p>Example output:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Output: 0
Reason: XOR is true only when inputs differ`}
        </pre>
        <p>Why it looks like this: XOR represents “one or the other, but not both”.</p>

        <h2>Limits</h2>
        <ul>
          <li>Educational only. No timing or hardware constraints are modelled.</li>
          <li>Focuses on simple gates, not complex circuits.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


