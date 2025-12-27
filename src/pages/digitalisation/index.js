import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

const corePath = [
  {
    id: "foundations",
    label: "Foundations",
    title: "Digitalisation Foundations",
    summary: "Language, fundamentals, and the habits that keep delivery grounded in outcomes.",
    href: "/digitalisation/beginner",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Applied Digitalisation",
    summary: "Operating models, platforms, governance, and realistic roadmaps.",
    href: "/digitalisation/intermediate",
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Digital strategy at scale",
    summary: "Ecosystems, regulation, funding models, risk, and stewardship.",
    href: "/digitalisation/advanced",
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    summary: "Recap, games, and dashboards to test strategy thinking.",
    href: "/digitalisation/summary",
  },
];

const furtherPractice = [
  {
    id: "practice",
    title: "Further practice",
    summary: "Hands on labs to make the strategy tangible before the summary.",
    href: "/digitalisation/dashboards",
  },
];

const capstones = [
  {
    id: "capstone-booktrack",
    title: "BookTrack capstone journey",
    summary: "A full journey that connects architecture, cybersecurity, digitalisation and AI using the BookTrack example.",
    href: "/notes/capstone/booktrack",
  },
  {
    id: "capstone-gridlens",
    title: "GridLens capstone journey",
    summary: "A full journey that connects architecture, CIM based network data, cybersecurity, digitalisation and AI using GridLens.",
    href: "/notes/capstone/gridlens",
  },
];

export default function DigitalisationHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "path", title: "Core path", depth: 2 },
    { id: "practice", title: "Further practice", depth: 2 },
    { id: "capstones", title: "Capstones", depth: 2 },
    { id: "cpd", title: "CPD", depth: 2 },
    { id: "references", title: "References", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes",
        description: "Digitalisation notes with a clear path. Foundations, intermediate, advanced, then a short summary with practice.",
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
            Follow the core path in order. Foundations, intermediate, advanced, then a short summary with games and practice.
          </p>
          <div className="actions">
            <Link href="/digitalisation/beginner" className="button primary">
              Start with Foundations
            </Link>
            <Link href="/my-cpd" className="button ghost">
              Track CPD
            </Link>
            <Link href="/my-cpd/evidence" className="button ghost">
              Export CPD evidence
            </Link>
            <Link href="/dashboards/digitalisation" className="button ghost">
              Open dashboards
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

        <section id="practice" className="space-y-4">
          <h2>Further practice</h2>
          <div className="course-grid">
            {furtherPractice.map((item) => (
              <Link key={item.id} href={item.href} className="course-card">
                <div className="course-card__meta">
                  <span className="chip chip--accent">Practice</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-base text-slate-800">{item.summary}</p>
                <div className="course-card__footer">
                  <span className="text-sm text-slate-700">Open</span>
                  <span aria-hidden="true">{">"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="capstones" className="space-y-4">
          <h2>Capstones</h2>
          <div className="course-grid">
            {capstones.map((item) => (
              <Link key={item.id} href={item.href} className="course-card">
                <div className="course-card__meta">
                  <span className="chip chip--accent">Capstone</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-base text-slate-800">{item.summary}</p>
                <div className="course-card__footer">
                  <span className="text-sm text-slate-700">Open</span>
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

