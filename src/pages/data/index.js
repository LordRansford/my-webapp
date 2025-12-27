import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import dataCourse from "../../../content/courses/data.json";

const corePath = [
  {
    id: "foundations",
    label: "Foundations",
    title: "Data Foundations",
    summary: "Start with the language, formats, and habits that make data useful across teams.",
    href: "/data/foundations",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Applied Data",
    summary: "Models, pipelines, and analytics that keep data reliable and ready for use.",
    href: "/data/intermediate",
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Advanced Data Systems",
    summary: "Architecture, streaming, governance, and data products at scale.",
    href: "/data/advanced",
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    summary: "Recap, scenarios, and playful practice for the data course.",
    href: "/data/summary",
  },
];

export default function DataHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "path", title: "Core path", depth: 2 },
    { id: "cpd", title: "CPD", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: dataCourse.title || "Data course",
        description:
          dataCourse.description ||
          "A practical course on data from formats and models to governance, architecture, and real-world use.",
        slug: "/data",
        section: "data",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview" className="space-y-3">
          <p className="eyebrow">Data course</p>
          <h1>Data as a practice</h1>
          <p className="lead">
            Follow the core path in order. Foundations, intermediate, advanced, then a short summary with games and practice.
          </p>
          <div className="actions">
            <Link href="/data/foundations" className="button primary">
              Start with Foundations
            </Link>
            <Link href="/my-cpd" className="button ghost">
              Track CPD
            </Link>
            <Link href="/my-cpd/evidence" className="button ghost">
              Export CPD evidence
            </Link>
            <Link href="/tools" className="button ghost">
              Open the labs
            </Link>
          </div>
        </section>

        <section id="path" className="space-y-4">
          <h2>Core path</h2>
          <div className="course-grid">
            {corePath.map((level) => (
              <Link key={level.id} href={level.href} className="course-card">
                <div className="course-card__meta">
                  <span className="chip chip--accent">{level.label}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{level.title}</h3>
                <p className="text-base text-slate-800">{level.summary}</p>
                <div className="course-card__footer">
                  <span className="text-sm text-slate-700">Open notes</span>
                  <span aria-hidden="true">{">"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="cpd" className="space-y-3">
          <h2>CPD</h2>
          <p className="text-base text-slate-800">
            Log minutes as you study and practise. Your records stay in this browser. Use the export view when you need a clean summary for your CPD system.
          </p>
          <div className="actions">
            <Link href="/my-cpd" className="button ghost">
              Track CPD
            </Link>
            <Link href="/my-cpd/evidence" className="button ghost">
              Export CPD evidence
            </Link>
          </div>
        </section>
      </div>
    </NotesLayout>
  );
}
