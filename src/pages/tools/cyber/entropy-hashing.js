import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function EntropyHashingWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Entropy and hashing",
        description: "Explore randomness, hashing, and the avalanche effect in a safe workspace.",
        level: "Tools",
        slug: "/tools/cyber/entropy-hashing",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Entropy and hashing</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Entropy and hashing</h1>
        <p className="lead">A lightweight workspace for understanding hashing and randomness, without pretending it is a key manager.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to build intuition for two ideas: entropy (how unpredictable something is) and hashing (a one-way fingerprint of data). It is
          useful for training, and for explaining why small changes can produce very different hashes.
        </p>
        <p>It is not a password manager, not a key vault, and not a secure random number generator audit tool.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Training: demonstrate the avalanche effect and why hashing is not encryption.</li>
          <li>Design review: explain why secrets need strong randomness and careful handling.</li>
          <li>Pre-decision analysis: sanity check what should be hashed (passwords) vs encrypted (data at rest).</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Text input</strong>: a short string to hash.
          </li>
          <li>
            <strong>Randomness generation</strong>: where exposed, generate sample bytes locally.
          </li>
        </ul>
        <p>Common mistakes: assuming a hash can be reversed, or confusing hashing with encryption.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Hash digest</strong>: typically hex or base64.
          </li>
          <li>
            <strong>Random bytes</strong>: illustrative sample output.
          </li>
        </ul>
        <p>
          Interpretation: a hash tells you whether data changed, not what the original data was. Random bytes illustrate unpredictability, not key
          management.
        </p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Hash a short input and record the digest.</li>
          <li>Change one character and hash again.</li>
          <li>Compare outputs and explain the avalanche effect.</li>
          <li>Write down where hashing is appropriate in your system design.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input A: "hello"
Input B: "hello!"`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Hash(A): 2cf24d... (hex)
Hash(B): ce0609... (hex)`}
        </pre>
        <p>Why it looks like this: cryptographic hashes are designed so small changes scramble the output.</p>

        <h2>Limits</h2>
        <ul>
          <li>Educational only. This does not validate your production crypto choices.</li>
          <li>Real security depends on threat modelling, key handling, and correct primitives.</li>
          <li>Do not paste secrets. Treat everything you type as potentially exposed to your local environment.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


