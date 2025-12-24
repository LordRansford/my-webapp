import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function PythonPlaygroundWorkspace() {
  return (
    <NotesLayout
      meta={{
        title: "Python playground",
        description: "Run small Python experiments in your browser with Pyodide.",
        level: "Tools",
        slug: "/tools/ai/python-playground",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/tools">Tools</Link>
        <span aria-hidden="true"> / </span>
        <span>Python playground</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">Tool workspace</p>
        <h1>Python playground</h1>
        <p className="lead">A safe space for quick Python experiments, teaching, and tiny data transforms.</p>

        <p className="text-sm">
          <Link href="/tools" className="font-semibold text-emerald-700 hover:underline">
            Back to tools
          </Link>
        </p>

        <h2>What this tool is for</h2>
        <p>
          Use this workspace to explore Python ideas without setting up a project. It is suitable for learning, quick checks, small transformations, and
          writing tiny snippets you later move into a real codebase.
        </p>
        <p>
          It is not trying to be a full development environment. It will not replicate your production dependencies, your data volumes, or your network
          environment.
        </p>

        <h2>When to use this tool</h2>
        <ul>
          <li>Design review: validate a data transform on a small sample before you propose it.</li>
          <li>Training: demonstrate a concept (lists, dicts, loops, functions) with immediate feedback.</li>
          <li>Pre-decision analysis: sanity check units, thresholds, or simple heuristics.</li>
          <li>Incident response: reproduce a small parsing task on log fragments or exported rows.</li>
        </ul>

        <h2>Inputs</h2>
        <ul>
          <li>
            <strong>Python code</strong>: paste a short script. Ideal is under 100 lines and focused on one purpose.
          </li>
          <li>
            <strong>Data samples</strong>: if you paste data, keep it small and representative. Avoid sensitive data.
          </li>
        </ul>
        <p>
          Common mistakes: pasting large datasets, expecting network access, or assuming installed libraries from your workstation will be available.
        </p>

        <h2>Outputs</h2>
        <ul>
          <li>
            <strong>Console output</strong>: what your script prints (for example results, summaries, or debug lines).
          </li>
          <li>
            <strong>Errors</strong>: syntax and runtime errors that help you refine logic.
          </li>
        </ul>
        <p>
          Interpretation: use the output to confirm the shape of data, the behaviour of logic, and basic correctness on a small sample. Do not treat it as
          evidence of performance or scalability.
        </p>

        <h2>Step-by-step usage guide</h2>
        <ol>
          <li>Prepare a small, non-sensitive input example.</li>
          <li>Paste code that prints intermediate values, not only the final result.</li>
          <li>Run the script and read the output like a trace.</li>
          <li>Make one change at a time and rerun so you can attribute cause and effect.</li>
        </ol>

        <h2>Worked example (static)</h2>
        <p>Example input:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`nums = [1, 2, 3, 4]
avg = sum(nums) / len(nums)
print("avg=", avg)
print("above_avg=", [n for n in nums if n > avg])`}
        </pre>
        <p>Example output:</p>
        <pre className="mono" style={{ whiteSpace: "pre-wrap" }}>
{`avg= 2.5
above_avg= [3, 4]`}
        </pre>
        <p>Why it looks like this: the average of 1,2,3,4 is 2.5, so only 3 and 4 are above it.</p>

        <h2>Limits</h2>
        <ul>
          <li>Browser-only execution. No network access is assumed.</li>
          <li>Library support is limited. Some native or heavy packages may not be available.</li>
          <li>Performance is not representative of production. Use it for correctness and learning only.</li>
          <li>Do not paste secrets or personal data.</li>
        </ul>
      </article>
    </NotesLayout>
  );
}


