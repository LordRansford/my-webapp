import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function RegexTesterWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Regex tester",
        description: "Test patterns and capture groups against sample text.",
        level: "Tools",
        slug: "/tools/software-architecture/regex-tester",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Regex tester</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Regex tester</h1>
        <p className="lead">A small workspace for log parsing and pattern thinking.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to build and validate regular expressions against real examples: triage logs, extract identifiers, and capture structured values.
          It is designed for learning and for producing patterns you can confidently paste into code or tooling.
        </p>
        <p>It is not a SIEM and not a substitute for structured logging. Use regex when you have to, and prefer structured data when you can.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Incident response: extract request IDs, user IDs, and error codes from log fragments.</li>
          <li>Design review: propose a parsing rule with proof that it matches real samples.</li>
          <li>Training: teach capture groups and common pitfalls.</li>
          <li>Pre-decision analysis: verify that a pattern is safe enough to run repeatedly.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Pattern</strong>: a regular expression.
          </li>
          <li>
            <strong>Flags</strong>: for example global and case-insensitive.
          </li>
          <li>
            <strong>Sample text</strong>: a few real lines that include edge cases.
          </li>
        </ul>
        <p>Common mistakes: writing patterns that match too broadly, missing edge cases, or using catastrophic backtracking patterns.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Matches</strong>: what the pattern matched.
          </li>
          <li>
            <strong>Groups</strong>: captured values you can use downstream.
          </li>
        </ul>
        <p>Interpretation: outputs validate correctness on examples. They do not prove the pattern is safe on all input sizes.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Collect 5 to 10 representative sample lines, including edge cases.</li>
          <li>Write a minimal pattern that matches only what you need.</li>
          <li>Add capture groups for values you will use (IDs, codes).</li>
          <li>Test failures: confirm it does not match when it should not.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Sample text:
user=alice action=login status=200
user=bob action=logout status=403

Pattern:
user=(\\w+)\\s+action=(\\w+)\\s+status=(\\d+)`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Match 1 groups: ["alice","login","200"]
Match 2 groups: ["bob","logout","403"]`}
        </pre>
        <p>Why it looks like this: each capture group extracts one token from a structured log line.</p>

        <h2>Limits</h2>
        <ul>
          <li>Regex is brittle on evolving log formats. Prefer structured logging when possible.</li>
          <li>Some patterns can be slow on large inputs. Keep patterns simple and anchored where possible.</li>
          <li>Outputs depend on the regex engine and flags.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


