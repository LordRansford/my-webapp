import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of systems, structure, boundaries, and architectural thinking.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Designing real systems, styles, decomposition, quality driven design, and decisions.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Architecture at organisational scale, platforms, resilience, and governance.",
  },
  {
    slug: "dashboards",
    title: "Further practice",
    summary: "Dashboards and labs to make latency, availability, and architecture trade-offs concrete.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, games, dashboards, and reflection to consolidate architecture thinking.",
  },
  {
    slug: "capstone",
    title: "BookTrack capstone journey",
    summary: "An end to end journey that connects architecture, cybersecurity, digitalisation and AI using the BookTrack example.",
    href: "/notes/capstone/booktrack",
  },
  {
    slug: "capstone-gridlens",
    title: "GridLens capstone journey",
    summary: "An end to end journey that connects architecture, CIM based network data, cybersecurity, digitalisation and AI using the GridLens example.",
    href: "/notes/capstone/gridlens",
  },
];

export default function ArchitectureHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "levels", title: "Levels", depth: 2 },
    { id: "references", title: "References", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes",
        description: "Choose your level: beginner, intermediate, advanced, further practice, or summary with games.",
        slug: "/software-architecture",
        section: "architecture",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview" className="space-y-3">
          <p className="eyebrow">Software Architecture Notes</p>
          <h1>Read, design, and steward systems</h1>
          <p className="lead">
            Pick the stage that fits you. Beginner for core structure, intermediate for design and decisions, advanced for platforms and governance, a further practice page with dashboards and labs, and a summary page with games.
          </p>
        </section>

        <section id="levels" className="space-y-4">
          <h2>Levels</h2>
          <div className="course-grid">
            {pages.map((page) => (
              <Link key={page.slug} href={page.href || `/software-architecture/${page.slug}`} className="course-card">
                <div className="course-card__meta">
                  <span className="chip chip--accent">{page.title}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{page.title}</h3>
                <p className="text-base text-slate-800">{page.summary}</p>
                <div className="course-card__footer">
                  <span className="text-sm text-slate-700">Open notes</span>
                  <span aria-hidden="true">{">"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="references" className="space-y-3">
          <h2>References and further reading</h2>
          <p className="muted">
            These notes draw on a wide range of sources. A few starting points are listed here so that you can explore the official material in more depth.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base text-slate-800">
            <li>Architecture handbooks and open course materials from recognised universities and industry leaders</li>
            <li>Documentation and guidance on cloud architecture, reliability, and security from major vendors</li>
            <li>Standards and playbooks on software design, observability, and operational excellence</li>
          </ul>
        </section>
      </div>
    </NotesLayout>
  );
}

