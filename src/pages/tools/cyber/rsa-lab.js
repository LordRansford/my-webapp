import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function RsaLabWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "RSA lab (OAEP + SHA-256)",
        description: "A workspace for understanding RSA key pairs and safe encryption patterns.",
        level: "Tools",
        slug: "/tools/cyber/rsa-lab",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>RSA lab</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>RSA lab (OAEP + SHA-256)</h1>
        <p className="lead">A practical workspace for key generation, encryption, and explaining asymmetry.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to build correct mental models of asymmetric cryptography: public/private keys, encryption vs signing, and why padding schemes
          matter. It is designed for learning and for explaining decisions in security reviews.
        </p>
        <p>
          It is not a production key management system. It does not replace HSMs, audited key rotation, or a formal cryptographic design review.
        </p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: explain why RSA-OAEP is used for small payloads or key exchange.</li>
          <li>Training: demonstrate public vs private key responsibilities.</li>
          <li>Pre-decision analysis: check constraints like maximum message size and encoding issues.</li>
          <li>Incident response: explain what a leaked private key means and what it does not mean.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Message</strong>: a small plaintext string. Keep it short.
          </li>
          <li>
            <strong>Key parameters</strong>: key size and algorithm choices (where exposed).
          </li>
        </ul>
        <p>Common mistakes: trying to encrypt large files directly with RSA, or confusing encryption with signing.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Ciphertext</strong>: an encoded encrypted payload.
          </li>
          <li>
            <strong>Round-trip result</strong>: decrypting should reproduce the original plaintext.
          </li>
        </ul>
        <p>
          Interpretation: a successful round-trip demonstrates correct wiring, not real-world security. Security depends on correct padding, key handling, and
          threat model.
        </p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Generate a keypair and note what is public vs private.</li>
          <li>Encrypt a short message with the public key.</li>
          <li>Decrypt with the private key and confirm you get the same message back.</li>
          <li>Write down what must be protected (private key) and what can be shared (public key).</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Plaintext: "hello"
Algorithm: RSA-OAEP with SHA-256
Key size: 2048`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Ciphertext: (base64) Lh9...9Q==
Decrypted: "hello"`}
        </pre>
        <p>Why it looks like this: RSA-OAEP adds randomness, so ciphertext changes between runs even for the same plaintext.</p>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only and educational. Do not treat it as audited key storage.</li>
          <li>RSA is not for large payloads. In practice, use hybrid crypto (RSA to wrap a symmetric key).</li>
          <li>Encoding and size limits vary by key size and padding scheme.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


