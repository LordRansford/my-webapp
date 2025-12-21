import fs from "node:fs";
import path from "node:path";
import Layout from "@/components/Layout";

type MappingSummary = {
  courseId: string;
  status: string;
  generatedAt?: string;
  levels?: Array<{
    levelId: string;
    estimatedHours?: number;
    sections?: any[];
    quizzesPresent?: boolean;
    toolsPresent?: boolean;
  }>;
};

type Props = {
  enabled: boolean;
  status: Record<string, string>;
  mappings: MappingSummary[];
};

export default function InternalCpdPage({ enabled, status, mappings }: Props) {
  if (!enabled) {
    return (
      <Layout title="Not found" description="">
        <main className="page">
          <h1>Not found</h1>
        </main>
      </Layout>
    );
  }
  return (
    <Layout title="Internal CPD preview" description="Internal CPD status and pack links.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Internal</p>
          <h1>CPD preview</h1>
          <p className="lead">Status and mapping summary for each course (internal only).</p>
        </header>

        <section className="section">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Levels</th>
                <th>Packs</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((m) => (
                <tr key={m.courseId}>
                  <td>{m.courseId}</td>
                  <td>{status[m.courseId] || "Unknown"}</td>
                  <td>{m.generatedAt ? new Date(m.generatedAt).toLocaleString() : "n/a"}</td>
                  <td>
                    {m.levels?.map((l) => (
                      <div key={l.levelId}>
                        {l.levelId}: {l.estimatedHours || 0}h | Quiz {l.quizzesPresent ? "✓" : "✗"} | Tool {l.toolsPresent ? "✓" : "✗"}
                      </div>
                    )) || "n/a"}
                  </td>
                  <td>
                    <a href={`/cpd/courses/${m.courseId}/cpd-pack.md`}>pack</a>{" | "}
                    <a href={`/cpd/courses/${m.courseId}/mapping.md`}>mapping</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  if (process.env.INTERNAL_TOOLS_ENABLED !== "true") {
    return { props: { enabled: false, status: {}, mappings: [] }, notFound: true };
  }

  const statusPath = path.join(process.cwd(), "cpd", "courses", "course-status.json");
  const status = fs.existsSync(statusPath) ? JSON.parse(fs.readFileSync(statusPath, "utf8")) : {};

  const coursesDir = path.join(process.cwd(), "cpd", "courses");
  const mappings: MappingSummary[] = [];
  if (fs.existsSync(coursesDir)) {
    for (const courseId of fs.readdirSync(coursesDir)) {
      const mappingPath = path.join(coursesDir, courseId, "mapping.json");
      if (fs.existsSync(mappingPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
          mappings.push({
            courseId: data.courseId || courseId,
            status: data.status || status[courseId] || "Unknown",
            generatedAt: data.generatedAt,
            levels: data.levels || [],
          });
        } catch {
          mappings.push({ courseId, status: status[courseId] || "Unknown", levels: [] });
        }
      }
    }
  }

  return { props: { enabled: true, status, mappings } };
}


