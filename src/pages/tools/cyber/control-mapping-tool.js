import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function ControlMappingToolWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Control mapping tool",
        description: "Map controls to standards at a conceptual level (ISO, NIST, SOC 2).",
        level: "Tools",
        slug: "/tools/cyber/control-mapping-tool",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Control mapping tool</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Control mapping tool</h1>
        <p className="lead">A practical mapping aid: connect what you do to what frameworks ask for.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to map your real controls (policies, technical measures, processes) to common frameworks at a high level. It helps reduce duplicate work
          and makes gaps visible before audits or customer questionnaires.
        </p>

        <h2>When to use it</h2>
        <ul>
          <li>Preparing for ISO 27001 / SOC 2: build an initial crosswalk.</li>
          <li>Customer security review: answer questionnaires consistently.</li>
          <li>Roadmapping: decide which control investments cover multiple requirements.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Control inventory</strong>: short list of what you actually have (e.g. MFA, logging, backups, change review).
          </li>
          <li>
            <strong>Target framework(s)</strong>: pick one primary and optionally a second for comparison.
          </li>
          <li>
            <strong>Evidence notes</strong>: where proof lives (tickets, runbooks, configs).
          </li>
        </ul>
        <p>Common mistakes: mapping “intent” instead of implementation, and treating mapping as compliance.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Crosswalk table</strong>: control → framework clause/theme → evidence pointers.
          </li>
          <li>
            <strong>Gap list</strong>: missing or weakly evidenced areas to strengthen.
          </li>
        </ul>

        <h2>Example</h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Input:
Control: MFA for admin accounts
Framework: SOC 2 CC6 (logical access)
Evidence: IdP policy screenshot + access review ticket template

Output:
Mapped: CC6.1/CC6.2 (access controls)
Gap: add periodic admin access review cadence + record retention.`}
        </pre>

        <h2>Limits</h2>
        <ul>
          <li>Not an audit report; mapping must be verified by implementation and evidence.</li>
          <li>Frameworks vary; use your auditor/customer’s exact wording for final mapping.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


