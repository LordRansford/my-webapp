import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function DataClassificationHelperWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Data classification helper",
        description: "Classify sensitivity and handling requirements in plain terms.",
        level: "Tools",
        slug: "/tools/data/data-classification-helper",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Data classification helper</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Data classification helper</h1>
        <p className="lead">A quick, practical way to classify data and choose handling controls.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to describe a dataset in business language, decide a sensible sensitivity class, and capture the minimum handling requirements (access,
          retention, sharing, logging). It’s designed to support governance conversations without needing a full GRC platform.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Before building a pipeline: decide where the data may be stored and who can access it.</li>
          <li>During vendor review: confirm whether a supplier can handle the class.</li>
          <li>After an incident: reclassify data and tighten controls if needed.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Dataset description</strong>: what it is, where it comes from, and who uses it.
          </li>
          <li>
            <strong>Data types</strong>: personal data, credentials, financial, operational, health, etc.
          </li>
          <li>
            <strong>Impact</strong>: harm if leaked/altered/unavailable.
          </li>
        </ul>
        <p>Common mistakes: classifying by gut feel, ignoring derived data, and forgetting access pathways (exports, logs, analytics).</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Suggested class</strong>: e.g. Public / Internal / Confidential / Restricted (adapt to your policy).
          </li>
          <li>
            <strong>Handling notes</strong>: access, storage, encryption expectations, retention, sharing, and auditability.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Dataset: Customer support tickets (includes names, emails, order IDs)
Impact: privacy + reputational harm

Output:
Class: Confidential
Handling: least-privilege access, encrypted at rest/in transit, 12–24mo retention, audit access, redact exports.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Educational: not legal advice and not a substitute for your org’s policy.</li>
          <li>No automated discovery or scanning — you provide the description.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


