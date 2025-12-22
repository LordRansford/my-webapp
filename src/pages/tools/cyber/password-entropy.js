import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function PasswordEntropyWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Password entropy meter",
        description: "Understand length vs complexity trade-offs with an illustrative entropy estimate.",
        level: "Tools",
        slug: "/tools/cyber/password-entropy",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Password entropy meter</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Password entropy meter</h1>
        <p className="lead">A teaching workspace for password strength thinking. Illustrative only.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to explain and compare password strategies in a calm, evidence-led way. It helps you demonstrate that length often matters more
          than “clever” complexity, and that password policy needs to match real user behaviour.
        </p>
        <p>It is not a cracking simulator and not a promise of real-world attack time. It is an illustrative teaching aid.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: evaluate a password policy change before rolling it out.</li>
          <li>Training: explain entropy and why predictable patterns reduce security.</li>
          <li>Pre-decision analysis: compare passphrases vs shorter complex passwords.</li>
          <li>Incident response: explain why credential stuffing is a policy and detection problem, not only a user problem.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Length</strong>: longer is generally better.
          </li>
          <li>
            <strong>Character set assumptions</strong>: letters, digits, symbols, and whether patterns are likely.
          </li>
        </ul>
        <p>Common mistakes: assuming all characters are equally likely, or treating a single number as a guarantee of safety.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Estimated entropy</strong>: a simplified estimate of unpredictability.
          </li>
          <li>
            <strong>Illustrative guidance</strong>: what the number suggests about policy direction.
          </li>
        </ul>
        <p>Use outputs to support policy conversations. Do not use them to claim compliance or to estimate breach likelihood.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Decide what user behaviour looks like (realistic patterns, not idealised randomness).</li>
          <li>Compare two candidate policies, especially around length and reset rules.</li>
          <li>Explain the trade-offs: usability, support burden, and account takeover risk.</li>
          <li>Pair the policy with controls: MFA, rate limiting, and monitoring.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Option A: 12 characters, mixed types
Option B: 4-word passphrase (longer overall)`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Option A: medium strength if user behaviour is random
Option B: often stronger in practice because length increases search space`}
        </pre>
        <p>Why it looks like this: length usually increases unpredictability more reliably than adding symbols users choose predictably.</p>

        <h2>Limits</h2>
        <ul>
          <li>Educational only. Real attack cost depends on attacker resources and user behaviour.</li>
          <li>Does not account for password reuse, credential stuffing, or phishing directly.</li>
          <li>Use alongside MFA, rate limiting, and monitoring for a robust posture.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


