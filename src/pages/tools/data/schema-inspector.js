import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function SchemaInspectorWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Schema inspector",
        description: "Explore entities, fields, and relationships in a schema.",
        level: "Tools",
        slug: "/tools/data/schema-inspector",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Schema inspector</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Schema inspector</h1>
        <p className="lead">A workspace for understanding structure before you build pipelines and dashboards.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to inspect a schema and understand what it implies: entities, fields, and relationships. It helps you reason about integration,
          governance, and the cost of change before you build pipelines or dashboards.
        </p>
        <p>It is not a full modelling tool and does not validate real data instances. It is for understanding structure and communicating it clearly.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: sanity check a proposed schema change and its knock-on effects.</li>
          <li>Architecture validation: confirm ownership boundaries and integration points.</li>
          <li>Training: teach entities, relationships, and why naming conventions matter.</li>
          <li>Pre-decision analysis: decide whether you need a canonical model or a simpler interface contract.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Schema JSON</strong>: a structured description of entities, fields, and relationships.
          </li>
        </ul>
        <p>Common mistakes: mixing domains in one entity, unclear identifiers, and relationships that hide ownership or access control constraints.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Entity list</strong>: what exists and how it is named.
          </li>
          <li>
            <strong>Field list</strong>: what data is stored and what it implies about sensitivity.</li>
          <li>
            <strong>Relationship view</strong>: how entities connect, which hints at joins and integration complexity.
          </li>
        </ul>
        <p>Use outputs to inform modelling discussions and governance decisions. Do not treat it as data quality validation.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Paste a schema that represents the part of the system you are discussing.</li>
          <li>Scan entities and identify the core identifiers first.</li>
          <li>Review relationships and ask: who owns the data, and who consumes it?</li>
          <li>Record constraints: sensitive fields, retention, and access rules.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`{
  "entities": [
    { "name": "Customer", "fields": ["id","email","created_at"] },
    { "name": "Order", "fields": ["id","customer_id","total","created_at"] }
  ],
  "relationships": [
    { "from": "Order.customer_id", "to": "Customer.id", "type": "many-to-one" }
  ]
}`}
        </pre>
        <p>Example output (illustrative):</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`Entities: Customer, Order
Key relationship: Order -> Customer (customer_id)
Note: email is personal data and needs access control and retention rules`}
        </pre>
        <p>Why it looks like this: relationships expose join paths and highlight where personal data appears.</p>

        <h2>Limits</h2>
        <ul>
          <li>Static inspection. It does not validate real records or enforce constraints.</li>
          <li>Interpretation depends on the organisation&apos;s data governance and naming conventions.</li>
          <li>Not a replacement for a modelling standard or data catalogue.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


