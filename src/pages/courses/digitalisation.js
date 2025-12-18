import Link from "next/link";
import Layout from "@/components/Layout";
import CourseStepper from "@/components/course/CourseStepper";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";
import { getTotalCpdHours } from "@/components/CPDTracker";
import digiCourse from "../../../content/courses/digitalisation.json";

const levelRoutes = {
  foundations: "/digitalisation/beginner",
  applied: "/digitalisation/intermediate",
  "practice-strategy": "/digitalisation/advanced",
};

const summaryRoute = "/digitalisation/summary";

const levelDescriptions = {
  foundations:
    "Start with what digitalisation means, how data, people, processes and systems fit together, and how to read basic diagrams and operating models.",
  applied:
    "Platforms, integration, data sharing, capabilities, and how organisations design digital journeys and services in practice.",
  "practice-strategy":
    "Digital roadmaps, operating models, governance, regulation and how to align data, architecture and people at sector or enterprise scale.",
};

export default function DigitalisationCourseOverview() {
  const levels = (digiCourse.levels || []).map((lvl) => ({
    ...lvl,
    route: levelRoutes[lvl.id] || `/digitalisation/${lvl.slug}`,
    description: lvl.summary || levelDescriptions[lvl.id],
  }));

  const steps = levels.map((lvl) => ({
    title: lvl.title,
    description: lvl.description,
    href: lvl.route,
  }));

  return (
    <Layout title="Digitalisation Notes – full course" description={digiCourse.description}>
      <nav className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span aria-hidden="true"> / </span>
        <span>Digitalisation</span>
      </nav>

      <header className="mt-2 space-y-3">
        <div className="flex items-center gap-2">
          <span className="chip chip--accent">Digitalisation</span>
          <span className="pill pill--ghost">CPD-ready</span>
        </div>
        <h1>Digitalisation Notes – full course</h1>
        <p className="lead">
          I think of digitalisation as the boring but beautiful work of joining up data, people, processes and technology so that
          real life gets easier instead of harder.
        </p>
        <p className="lead">
          These notes start from first principles about what digitalisation is and why it matters, then move towards platforms,
          data sharing, operating models and strategy. The aim is to help you talk confidently to engineers, policy people, business
          leaders and regulators without getting lost in jargon.
        </p>
        <div className="actions">
          <Link href={levelRoutes.foundations} className="button primary">
            Start with Digitalisation Foundations
          </Link>
          <Link href={summaryRoute} className="button ghost">
            Jump to summary & games
          </Link>
        </div>
      </header>

      <CourseProgressBar courseId="digitalisation" manifest={digitalisationSectionManifest} />

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Your recorded CPD hours for Digitalisation</p>
        <p className="text-base font-semibold text-gray-800">{getTotalCpdHours("digitalisation").toFixed(1)} hours</p>
        <p className="text-xs text-gray-700">
          This stays in your browser only. If you need official CPD credit, log your time with your professional body as well.
        </p>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>Course structure</h2>
          <span className="hint">Three levels, one journey</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {levels.map((level) => (
            <div key={level.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="eyebrow mb-1 text-gray-700">{level.title}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {level.estimatedHours ? `${level.estimatedHours} hrs` : "Self paced"}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-800">{level.description}</p>
              <div className="mt-auto pt-3">
                <Link
                  href={level.route}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Go to {level.title} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-700">
          You can move through this like a course or jump to the level that matches your role. If you are new to digital work, start
          with Foundations. If you already lead projects or programmes, skim the basics and spend more time in Applied and Digital
          Strategy and Enterprise Scale.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Progression map</h2>
          <span className="hint">Matches the stepper in the notes</span>
        </div>
        <CourseStepper steps={steps} />
        <p className="mt-4 text-sm text-gray-700">
          You do not need to follow this perfectly in order. Foundations helps if you are new; if you already drive digital work,
          dip into Applied and Digital Strategy and Enterprise Scale and use the tools as refreshers.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>How this fits into professional development</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            These notes support CPD for digital, data and transformation roles. They are calm, practical, and written from doing the
            work, not selling a framework.
          </p>
          <p>
            The structure lines up with ideas you see in digital government, platform thinking and data-centric regulation, but this
            is my view rather than official guidance.
          </p>
          <p>
            Use it for CPD logs, to prepare for digital roles, or to have more grounded conversations with vendors and consultants.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Tools, labs and dashboards</h2>
        </div>
        <p className="text-sm text-gray-800">
          The digitalisation notes include interactive tools to map simple processes, explore capabilities and platforms, think
          about data sharing, consent and governance, and play with small what-if scenarios. Dashboards pull these views together so
          you can see data, flows and decisions in one place.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link className="card-link" href="/digitalisation/beginner">
            <div className="card-link__body">
              <p className="eyebrow">Level 1</p>
              <h3>Digitalisation Foundations</h3>
              <p className="muted">Map a basic process to a digital journey and see where data and people interact.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/digitalisation/intermediate">
            <div className="card-link__body">
              <p className="eyebrow">Level 2</p>
              <h3>Applied Digitalisation</h3>
              <p className="muted">Explore capability or platform maps and how integration patterns shape delivery.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/digitalisation/advanced">
            <div className="card-link__body">
              <p className="eyebrow">Level 3</p>
              <h3>Digital Strategy and Enterprise Scale</h3>
              <p className="muted">Look at roadmap and operating model views to see how strategy, governance and data align.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href={summaryRoute}>
            <div className="card-link__body">
              <p className="eyebrow">Recap</p>
              <h3>Summary and games</h3>
              <p className="muted">Join up platforms, data and strategy with small applied challenges.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
