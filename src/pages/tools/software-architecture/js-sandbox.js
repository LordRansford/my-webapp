import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function JsSandboxWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "JavaScript sandbox",
        description: "Test JavaScript behaviour and parsing safely in a dedicated workspace.",
        level: "Tools",
        slug: "/tools/software-architecture/js-sandbox",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>JavaScript sandbox</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>JavaScript sandbox</h1>
        <p className="lead">A safe place to experiment with core JS concepts without wiring up a project.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to explore JavaScript behaviour in a controlled way: data transforms, edge cases, parsing, and small async patterns. It is
          useful for learning and for producing small, reviewable snippets.
        </p>
        <p>
          It is not a browser app runtime and not a full IDE. It is not intended for DOM-heavy work or for performance benchmarking.
        </p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: test a transformation or edge case before you propose it in code review.</li>
          <li>Incident response: reproduce parsing logic for log lines or payload fragments.</li>
          <li>Training: demonstrate async/await, promises, and common pitfalls.</li>
          <li>Pre-decision analysis: validate assumptions about data shapes (arrays, objects, nulls).</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>JavaScript code</strong>: small scripts are ideal. Keep it focused and print intermediate values.
          </li>
          <li>
            <strong>Sample data</strong>: paste a small JSON sample if needed. Avoid sensitive data.
          </li>
        </ul>
        <p>Common mistakes: assuming a DOM is available, or pasting huge payloads that make the browser slow.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Console output</strong>: logs you write for debugging and results.
          </li>
          <li>
            <strong>Runtime errors</strong>: exceptions that highlight incorrect assumptions.
          </li>
        </ul>
        <p>Use outputs to validate correctness and clarify edge cases. Do not use this for performance claims.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Prepare a small input example.</li>
          <li>Write a minimal script and include console logs.</li>
          <li>Run and observe output and errors.</li>
          <li>Change one thing at a time and rerun.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`const raw = " 42 ";
const n = Number(raw);
console.log({ raw, n, isFinite: Number.isFinite(n) });`}
        </pre>
        <p>Example output:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`{ raw: " 42 ", n: 42, isFinite: true }`}
        </pre>
        <p>Why it looks like this: Number() trims whitespace and converts to a numeric value.</p>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only execution. Treat it as a learning sandbox, not a runtime guarantee.</li>
          <li>Not designed for UI or DOM work. Keep scripts focused on logic.</li>
          <li>Outputs are local. Do not paste secrets or personal data.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


