import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

const pages = [
  {
    slug: "beginner",
    title: "Beginner",
    summary: "Foundations of digitalisation, data discipline, people, and process.",
  },
  {
    slug: "intermediate",
    title: "Intermediate",
    summary: "Designing operating models, platforms, governance, and realistic roadmaps.",
  },
  {
    slug: "advanced",
    title: "Advanced",
    summary: "Ecosystems, regulation, funding models, risk, and stewardship.",
  },
  {
    slug: "dashboards",
    title: "Further practice",
    summary: "Dashboards and hands-on labs to make the strategy tangible before the summary.",
  },
  {
    slug: "summary",
    title: "Summary and games",
    summary: "Recap, games, and dashboards to test strategy thinking.",
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

export default function DigitalisationHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "levels", title: "Levels", depth: 2 },
    { id: "references", title: "References", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes",
        description: "Choose your level: beginner, intermediate, advanced, further practice, or summary with games.",
        slug: "/digitalisation",
        section: "digitalisation",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview" className="space-y-3">
          <p className="eyebrow">Digitalisation Strategy</p>
          <h1>Read, design, and deliver</h1>
          <p className="lead">
            Pick the stage that fits you. Beginner for language and foundations, intermediate for operating models and platforms, advanced for ecosystems and stewardship, a further practice page with dashboards and labs, plus a summary page with games.
          </p>
        </section>

        <section id="levels" className="space-y-4">
          <h2>Levels</h2>
          <div className="course-grid">
            {pages.map((page) => (
              <Link key={page.slug} href={page.href || `/digitalisation/${page.slug}`} className="course-card">
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
            <li>Official guidance from government digital services and sector regulators</li>
            <li>Research and playbooks on digital operating models, platform thinking, and service design</li>
            <li>Standards and textbooks on data governance, architecture, and programme delivery</li>
          </ul>
        </section>
      </div>
    </NotesLayout>
  );
}

