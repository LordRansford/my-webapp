import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function CertificateViewerWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Certificate viewer",
        description: "Inspect certificate fields and trust cues in a dedicated workspace.",
        level: "Tools",
        slug: "/tools/cyber/certificate-viewer",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Certificate viewer</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Certificate viewer</h1>
        <p className="lead">A focused workspace for learning certificate structure without live scanning.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to understand certificate structure and trust cues: subject, issuer, validity windows, and SAN entries. It helps you review
          configuration decisions and explain them in security and platform discussions.
        </p>
        <p>It is not a live scanner and does not prove that a site is secure. It focuses on interpreting certificate data you already have.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: validate what the certificate is intended to cover (SANs, wildcards, hostnames).</li>
          <li>Incident response: interpret expiry, issuer changes, or suspected mis-issuance data.</li>
          <li>Training: teach CN vs SAN and why modern clients rely on SAN.</li>
          <li>Pre-decision analysis: decide whether a certificate model (wildcard vs explicit SANs) fits operational reality.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Certificate data</strong>: a structured representation of certificate fields (for example JSON from an export).
          </li>
        </ul>
        <p>Common mistakes: confusing issuer name with trust, or ignoring validity windows and hostname coverage.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Parsed fields</strong>: subject, issuer, validity period, SANs, and key usage where present.
          </li>
          <li>
            <strong>Interpretation cues</strong>: what fields matter for hostname matching and operational risk.
          </li>
        </ul>
        <p>Use outputs to inform renewal plans, hostname coverage decisions, and platform hygiene. Do not use them as proof of compliance.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Collect certificate field data from a trusted source.</li>
          <li>Inspect validity dates and SAN coverage first.</li>
          <li>Confirm issuer and chain expectations based on your environment.</li>
          <li>Record decisions: renewal ownership, monitoring, and rotation plan.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input (illustrative JSON):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`{
  "subject": "CN=example.com",
  "issuer": "CN=Example CA",
  "notBefore": "2026-01-01",
  "notAfter": "2026-04-01",
  "san": ["example.com", "www.example.com"]
}`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Covers: example.com, www.example.com
Valid: 2026-01-01 to 2026-04-01
Issuer: Example CA`}
        </pre>
        <p>Why it looks like this: SAN entries are what clients use for hostname matching. Validity dates drive renewal urgency.</p>

        <h2>Limits</h2>
        <ul>
          <li>Not a live scanner. It cannot verify what a site currently serves.</li>
          <li>Does not validate revocation or full chain trust in a client environment.</li>
          <li>Interpretation depends on your platform, client trust store, and operational policies.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


