import Link from "next/link";
import Layout from "@/components/Layout";
import CourseStepper from "@/components/course/CourseStepper";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import { aiSectionManifest } from "@/lib/aiSections";
import { getTotalCpdHours } from "@/components/CPDTracker";
import aiCourse from "../../../content/courses/ai.json";

const levelRoutes = {
  beginner: "/ai/beginner",
  intermediate: "/ai/intermediate",
  advanced: "/ai/advanced",
};

const summaryRoute = "/ai/summary";

const levelDescriptions = {
  beginner:
    "We start from what data is, how simple models learn patterns, and how to think clearly about accuracy, bias and basic model behaviour.",
  intermediate:
    "We move into evaluation, feature thinking, vector representations, and how to use and tune models in practice without getting lost in buzzwords.",
  advanced:
    "We explore transformers, agents, diffusion models and how real AI systems are designed, deployed, governed and misused.",
};

export default function AICourseOverview() {
  const levels = (aiCourse.levels || []).map((lvl) => ({
    ...lvl,
    route: levelRoutes[lvl.id] || `/ai/${lvl.slug}`,
    description: lvl.summary || levelDescriptions[lvl.id],
  }));

  const steps = levels.map((lvl) => ({
    title: lvl.title,
    description: lvl.description,
    href: lvl.route,
  }));

  return (
    <Layout title="AI Notes – full course" description={aiCourse.description}>
      <nav className="breadcrumb">
        <Link href="/courses">Courses</Link>
        <span aria-hidden="true"> / </span>
        <span>AI Notes</span>
      </nav>

      <header className="mt-2 space-y-3">
        <div className="flex items-center gap-2">
          <span className="chip chip--accent">AI</span>
          <span className="pill pill--ghost">CPD-ready</span>
        </div>
        <h1>AI Notes – full course</h1>
        <p className="lead">
          I built these AI notes because I wanted a single place that explains AI from first principles all the way through to
          transformers, agents and real systems, without assuming you already speak in equations.
        </p>
        <p className="lead">
          We start with “what is data and what is a model” and slowly climb towards how modern AI systems actually work and how
          they are governed. You can work through this on your own or use it with students, colleagues or friends.
        </p>
        <div className="actions">
          <Link href={levelRoutes.beginner} className="button primary">
            Start with AI Foundations
          </Link>
          <Link href={summaryRoute} className="button ghost">
            Jump to summary & games
          </Link>
        </div>
      </header>

      <CourseProgressBar courseId="ai" manifest={aiSectionManifest} />

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Your recorded CPD hours for AI</p>
        <p className="text-base font-semibold text-gray-800">{getTotalCpdHours("ai").toFixed(1)} hours</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {level.title}
                  </h3>
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
          You do not have to follow this perfectly in order. If you already use AI at work, skim Foundations and spend more time
          in Applied and Modern AI Systems. If you are new, move steadily and play with the tools as you go.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Progression map</h2>
          <span className="hint">Matches the stepper in the notes</span>
        </div>
        <CourseStepper steps={steps} />
        <p className="mt-4 text-sm text-gray-700">
          You do not have to work through this in order, but it usually helps. If you are completely new to AI, start with
          Foundations. If you are already a practitioner, you can dip into Applied and Modern AI Systems and use the games and
          tools as a refresher.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>How this supports CPD and exam prep</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            I wrote these AI notes to build real, transferable understanding. They are serious CPD-style learning rather than
            quick tips.
          </p>
          <p>
            The structure loosely follows the ideas you see in AI fundamentals courses—data, models, evaluation, responsible AI
            and real systems—but this is not official training material and I am not claiming certification status.
          </p>
          <p>
            The goal is to make formal training, vendor platforms, and research papers feel less intimidating so you can apply AI
            responsibly in real work.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Tools, labs and AI dashboards</h2>
        </div>
        <p className="text-sm text-gray-800">
          The AI notes include browser-based tools so you can play with simple models, explore evaluation metrics, and visualise
          embeddings without installing anything. The summary and games page gathers lighter exercises, and the AI tools area lets
          you go deeper when you are ready.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link className="card-link" href="/ai/beginner">
            <div className="card-link__body">
              <p className="eyebrow">Level 1</p>
              <h3>AI Foundations</h3>
              <p className="muted">Try the simple model intuition lab and see how basic models learn patterns.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/ai/intermediate">
            <div className="card-link__body">
              <p className="eyebrow">Level 2</p>
              <h3>Applied AI</h3>
              <p className="muted">Work with evaluation and embeddings tools to see how model signals change.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/ai/advanced">
            <div className="card-link__body">
              <p className="eyebrow">Level 3</p>
              <h3>Modern AI Systems</h3>
              <p className="muted">Look at transformer and agent flows and how real systems are stitched together.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href={summaryRoute}>
            <div className="card-link__body">
              <p className="eyebrow">Recap</p>
              <h3>AI summary and games</h3>
              <p className="muted">Play small games and thought experiments to connect ideas across all three levels.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="card-link" href="/tools/ai">
            <div className="card-link__body">
              <p className="eyebrow">Labs</p>
              <h3>AI tools</h3>
              <p className="muted">Jump straight to the AI tool hub when you want to experiment.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
