import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function SqlSandboxWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "SQL sandbox (SQLite)",
        description: "Practise SQL queries and joins locally in your browser.",
        level: "Tools",
        slug: "/tools/data/sql-sandbox",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>SQL sandbox</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>SQL sandbox (SQLite)</h1>
        <p className="lead">A small workspace for practising core SQL patterns without installing a database.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to practise SQL thinking: joins, grouping, filtering, and basic schema design. It is useful for learning, for rehearsing a query
          before you run it on production, and for explaining query intent in reviews.
        </p>
        <p>It is not intended for production-scale datasets, performance tuning, or vendor-specific SQL features.</p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: draft a query and make its logic easy to explain.</li>
          <li>Training: demonstrate joins, group by, window-like thinking (conceptually).</li>
          <li>Pre-decision analysis: validate KPI definitions on a tiny example dataset.</li>
          <li>Incident response: reproduce a query that explains an anomaly in a small sample.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>SQL statements</strong>: create table, insert, and select statements.
          </li>
          <li>
            <strong>Sample data</strong>: keep it small and representative. Avoid sensitive data.
          </li>
        </ul>
        <p>Common mistakes: forgetting primary keys, mixing types inconsistently, or writing a query without a clear question.</p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Query results</strong>: typically the final SELECT output.
          </li>
          <li>
            <strong>Errors</strong>: syntax errors and constraint issues that help you improve the query.
          </li>
        </ul>
        <p>Interpretation: results support reasoning about correctness. They are not evidence of performance.</p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Create a minimal schema for the question you want to answer.</li>
          <li>Insert a tiny dataset with edge cases (nulls, duplicates, missing rows).</li>
          <li>Write the query and confirm the results match your expectation.</li>
          <li>Document the intent of each clause so it survives code review.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`create table events(user_id text, action text);
insert into events values ("u1","login"), ("u1","purchase"), ("u2","login");

select action, count(*) as c
from events
group by action
order by c desc;`}
        </pre>
        <p>Example output:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`action    c
login     2
purchase  1`}
        </pre>
        <p>Why it looks like this: grouping counts per action, so login occurs twice and purchase once.</p>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only. Data is in-memory and temporary.</li>
          <li>Not intended for large datasets or performance work.</li>
          <li>SQL dialect differences exist. Treat this as conceptual practice.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


