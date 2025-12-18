import Link from "next/link";
import Layout from "@/components/Layout";
import CourseStepper from "@/components/course/CourseStepper";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import { softwareArchitectureSectionManifest } from "@/lib/softwareArchitectureSections";
import { getTotalCpdHours } from "@/components/CPDTracker";
import saCourse from "../../../content/courses/software-architecture.json";

const levelRoutes = {
  beginner: "/software-architecture/beginner",
  intermediate: "/software-architecture/intermediate",
  advanced: "/software-architecture/advanced",
};

const summaryRoute = "/software-architecture/summary";

const levelDescriptions = {
  beginner:
    "Start from what software architecture is for, and how to think about components, boundaries and responsibilities in small systems.",
  intermediate:
    "Layered patterns, microservices, events, data ownership and the real trade offs between coupling, performance and changeability.",
  advanced:
    "Event driven systems, CQRS, integration patterns, observability and digitalisation strategy across whole organisations.",
};

export default function SoftwareArchitectureCourseOverview() {
  const levels = (saCourse.levels || []).map((lvl) => ({
    ...lvl,
    route: levelRoutes[lvl.id] || `/software-architecture/${lvl.slug}`,
    description: lvl.summary || levelDescriptions[lvl.id],
  }));

  const steps = levels.map((lvl) => ({
    title: lvl.title,
    description: lvl.description,
    href: lvl.route,
  }));

  return (
    <Layout title="Software Architecture Notes – full course" description={saCourse.description}>
      <nav className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span aria-hidden="true"> / </span>
        <span>Software Architecture</span>
      </nav>

      <header className="mt-2 space-y-3">
        <div className="flex items-center gap-2">
          <span className="chip chip--accent">Software Architecture</span>
          <span className="pill pill--ghost">CPD-ready</span>
        </div>
        <h1>Software Architecture Notes – full course</h1>
        <p className="lead">
          I built these software architecture notes because I kept bumping into the same problem: resources that drown you in
          buzzwords or skip straight to cloud diagrams with no story.
        </p>
        <p className="lead">
          Here we start from “what is architecture and why should I care” and move towards the decisions real architects and
          digital leaders need to make. It is not about pretty boxes; it is about clear thinking on responsibilities, boundaries,
          change and risk in real systems.
        </p>
        <div className="actions">
          <Link href={levelRoutes.foundations} className="button primary">
            Start with Architecture Foundations
          </Link>
          <Link href={summaryRoute} className="button ghost">
            Jump to summary & games
          </Link>
        </div>
      </header>

      <CourseProgressBar courseId="software-architecture" manifest={softwareArchitectureSectionManifest} />

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Your recorded CPD hours for Software Architecture</p>
        <p className="text-base font-semibold text-gray-800">{getTotalCpdHours("software-architecture").toFixed(1)} hours</p>
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
          You can read these notes in order like a course or dip into the parts you need. If you are new to architecture, start
          with Architecture Foundations. If you already lead systems or digital programmes, skim the basics and spend more time in
          Applied and Digital and Cloud Scale Architecture.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Progression map</h2>
          <span className="hint">Matches the stepper in the notes</span>
        </div>
        <CourseStepper steps={steps} />
        <p className="mt-4 text-sm text-gray-700">
          You do not have to follow this perfectly in order. Start at Foundations if you are new; if you already run systems, feel
          free to hop into Applied and Digital and Cloud Scale Architecture and use the tools as refreshers.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>How this fits into professional development</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            These notes are designed to support real professional work in software architecture and digitalisation. They are calm,
            practical, and meant for CPD, not quick tips.
          </p>
          <p>
            They lean on ideas you see in layered and hexagonal architectures, domain driven design thinking, cloud native patterns
            and integration guidance, but they are my view rather than an official training manual.
          </p>
          <p>
            The aim is to make it easier to talk to architects, engineers, vendors and regulators, and to give you something solid
            to point to for CPD logs and performance reviews.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Tools, labs and dashboards</h2>
        </div>
        <p className="text-sm text-gray-800">
          The architecture notes include interactive tools to sketch systems, explore request flows, reason about data ownership
          and boundaries, and visualise quality attributes, trade offs and risk. Dashboards add more hands-on scenarios around
          performance, resilience and change.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link className="card-link" href="/software-architecture/beginner">
            <div className="card-link__body">
              <p className="eyebrow">Level 1</p>
              <h3>Architecture Foundations</h3>
              <p className="muted">Sketch a simple system and practice drawing clear boundaries and responsibilities.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/software-architecture/intermediate">
            <div className="card-link__body">
              <p className="eyebrow">Level 2</p>
              <h3>Applied Architecture</h3>
              <p className="muted">Explore microservice and event flows, plus data ownership and coupling trade offs.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/software-architecture/advanced">
            <div className="card-link__body">
              <p className="eyebrow">Level 3</p>
              <h3>Digital and Cloud Scale</h3>
              <p className="muted">Look at CQRS, integration patterns, observability and large scale trade off dashboards.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href={summaryRoute}>
            <div className="card-link__body">
              <p className="eyebrow">Recap</p>
              <h3>Summary and games</h3>
              <p className="muted">Join up diagrams, patterns and digitalisation ideas with small applied challenges.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
