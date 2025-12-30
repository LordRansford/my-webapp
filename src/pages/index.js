import Link from "next/link";
import Layout from "@/components/Layout";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";
import {
  Shield,
  Brain,
  Boxes,
  Database,
  Compass,
  FlaskConical,
  LayoutDashboard,
  FileText,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  BookOpenText,
  Settings,
  Volume2,
  Highlighter,
  Contrast,
  Minimize,
  GraduationCap,
  Map,
} from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { siteStructure } from "@/lib/sitemap";

const subjects = [
  {
    title: "Cybersecurity",
    description: "Practical security thinking, from foundations to strategy.",
    href: "/cybersecurity",
    Icon: Shield,
  },
  {
    title: "AI",
    description: "Models, evaluation, and responsible use without the hype.",
    href: "/ai",
    Icon: Brain,
  },
  {
    title: "Software architecture",
    description: "Make trade-offs explicit and design systems that survive reality.",
    href: "/software-architecture",
    Icon: Boxes,
  },
  {
    title: "Data",
    description: "Data quality, governance, and decision pipelines that work.",
    href: "/data",
    Icon: Database,
  },
  {
    title: "Digitalisation",
    description: "Strategy, operating models, and delivery with clear outcomes.",
    href: "/digitalisation",
    Icon: Compass,
  },
];

const platformItems = [
  { title: "Studios", description: "Guided spaces for deeper experiments.", href: "/studios", Icon: FlaskConical, cta: "Explore" },
  { title: "Dashboards", description: "Interactive boards that turn concepts into decisions.", href: "/dashboards/ai", Icon: LayoutDashboard, cta: "Try" },
  { title: "Templates", description: "Evidence-friendly templates for planning and reporting.", href: "/templates", Icon: FileText, cta: "Browse" },
  { title: "Tools", description: "Small labs and helpers you can run quickly.", href: "/tools", Icon: Wrench, cta: "Open" },
  { title: "Games", description: "Offline-friendly mini games for practice and fun.", href: "/games/hub", Icon: Gamepad2, cta: "Play" },
];

const audiences = [
  { title: "Students", description: "Build intuition first, then learn the formal names.", Icon: Users },
  { title: "Professionals", description: "Refresh core ideas and keep decision notes close.", Icon: CheckCircle2 },
  { title: "Career switchers", description: "Get a map of the territory, not a wall of jargon.", Icon: Compass },
  { title: "Engineers", description: "Use tools to test assumptions and see trade-offs.", Icon: Boxes },
  { title: "Curious learners", description: "Explore safely with small experiments and prompts.", Icon: FlaskConical },
];

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts }, revalidate: 300 };
}

export default function Home({ posts }) {
  return (
    <Layout
      title="Ransford's Notes | Labs first"
      description="Browser-first labs for security, architecture, and AI. Practical, calm, and built for learning by doing."
    >
      <MarketingPageTemplate>
      {/* 1) Hero section */}
      <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Early access, free to use</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">Ransford&apos;s Notes</h1>
            <p className="text-base text-slate-700">
              Calm, hands-on learning for cybersecurity, AI, architecture, data, and digitalisation. Notes you can reuse. Tools you can test in minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Start learning <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/tools" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                Explore tools and studios <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="text-xs text-slate-600">Free to use during early access.</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">What you can do right now</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-800">
                <li className="flex gap-2"><span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Follow structured courses.</li>
                <li className="flex gap-2"><span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Run labs and dashboards for practical intuition.</li>
                <li className="flex gap-2"><span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Use templates for evidence-friendly outputs.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Why it is different</p>
              <p className="mt-2 text-sm text-slate-700">
                Less theory theatre. More decision notes, concrete examples, and tools with boundaries that match real work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Featured Article</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                <Link href="/posts/ai-fundamentals-explained" className="hover:text-slate-700">
                  AI Fundamentals Explained: From Data to Decisions
                </Link>
              </h2>
              <p className="mt-2 text-base text-slate-700">
                A clear, practical guide to understanding AI from first principles. Learn what data is, how models learn patterns, and how to make sense of AI systems in real work.
              </p>
              <Link
                href="/posts/ai-fundamentals-explained"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600"
              >
                Read the article <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Brain className="h-16 w-16 text-slate-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 2) What this site is */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">What</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Personal notes turned into a platform</h2>
            <p className="mt-2 text-sm text-slate-700">Structured courses, labs, and templates built to be reused and improved over time.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Why</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Learning that respects your time</h2>
            <p className="mt-2 text-sm text-slate-700">A map first, then depth. The goal is confidence and judgement, not memorisation.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Different</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Tools with context and boundaries</h2>
            <p className="mt-2 text-sm text-slate-700">Every tool explains what it does, what it cannot do, and how to interpret the output.</p>
          </div>
        </div>
      </section>

      {/* 3) What you can learn and do */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Topics</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">What you can learn and do</h2>
            <p className="mt-2 text-sm text-slate-700">Pick a subject, learn the foundations, then use tools to turn concepts into decisions.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {subjects.map(({ title, description, href, Icon }) => (
            <Link key={title} href={href} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              <Icon className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-700">{description}</p>
              <p className="mt-3 text-xs font-semibold text-slate-700">Open</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4) Studios, labs, and tools */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Platform</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Studios, labs, and tools</h2>
          <p className="mt-2 text-sm text-slate-700">Quick experiments when you need clarity, not another tab of theory.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {platformItems.map(({ title, description, href, Icon, cta }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <Icon className="h-6 w-6 text-slate-900" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-700">{description}</p>
                <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
                  {cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5) Who this is for */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Audience</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Who this is for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map(({ title, description, Icon }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-700">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6) How to get started */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Getting started</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">A simple path</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { step: "1", title: "Pick a topic", text: "Choose the subject that matches your current work or curiosity." },
              { step: "2", title: "Learn the foundations", text: "Get the mental model and language without the noise." },
              { step: "3", title: "Try tools and labs", text: "Run small experiments to make ideas concrete." },
              { step: "4", title: "Go deeper when ready", text: "Move into intermediate and advanced thinking at your pace." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{s.step}</div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) Trust and credibility */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Trust</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Built for credible learning</h2>
            <p className="mt-2 text-sm text-slate-700">
              This started as personal notes for real work, then evolved into a platform. The goal is accuracy, clarity, and decision-ready thinking.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              It is designed to align with CPD expectations and professional standards, without claiming accreditation unless explicitly stated.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Early access</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Improving quickly</h2>
            <p className="mt-2 text-sm text-slate-700">
              The site is in an early access phase. Content and tools improve based on feedback and careful review.
            </p>
            <Link href="/feedback" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
              Leave feedback <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8) Blog Posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Articles</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Blog Posts & Articles</h2>
              <p className="mt-2 text-sm text-slate-700">In-depth articles and guides to deepen your understanding.</p>
            </div>
            <Link href="/posts" className="text-sm font-semibold text-slate-900 hover:text-slate-700">
              View all posts →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition"
              >
                <BookOpenText className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-slate-700 line-clamp-2">{post.excerpt}</p>}
                <span className="mt-4 inline-block text-sm font-semibold text-slate-900">Read article →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 9) Accessibility Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50/60 to-slate-50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-slate-900" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Accessibility</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Built for Everyone</h2>
            </div>
          </div>
          <p className="text-base text-slate-700 mb-6 max-w-3xl">
            This website is designed to be accessible to all users, including children, neurodivergent individuals, and people with disabilities. All accessibility features are free, browser-only, and privacy-preserving.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <Volume2 className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">Read Aloud</h3>
              <p className="mt-2 text-sm text-slate-700">
                Have any page read to you using your browser&apos;s built-in speech. Works on any device, no account needed.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <Highlighter className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">Text Highlighting</h3>
              <p className="mt-2 text-sm text-slate-700">
                See words as they&apos;re read. Toggle highlighting on or off without affecting page layout.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <Contrast className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">High Contrast</h3>
              <p className="mt-2 text-sm text-slate-700">
                Switch to high contrast mode for better visibility. Your preference is saved automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <Minimize className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">Reduce Motion</h3>
              <p className="mt-2 text-sm text-slate-700">
                Respects your motion preferences. Animations are minimized when you prefer reduced motion.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/accessibility" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
              Learn more about accessibility <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Look for the accessibility settings icon (⚙️) in the bottom-right corner of any page to customize your experience.
          </p>
        </div>
      </section>

      {/* 10) Complete Discovery */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Map className="h-6 w-6 text-slate-900" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Navigation</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Find Everything</h2>
            </div>
          </div>
          <p className="text-base text-slate-700 mb-6 max-w-3xl">
            Every page on this website is accessible through links. Nothing is hidden. Use the site map for a complete overview of all available content.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/sitemap"
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-slate-100 transition"
            >
              <Map className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">Complete Site Map</h3>
              <p className="mt-2 text-sm text-slate-700">See every page organized by category.</p>
            </Link>
            <Link
              href="/courses"
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-slate-100 transition"
            >
              <GraduationCap className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">All Courses</h3>
              <p className="mt-2 text-sm text-slate-700">Browse all learning paths and courses.</p>
            </Link>
            <Link
              href="/studios"
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-slate-100 transition"
            >
              <FlaskConical className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">All Studios</h3>
              <p className="mt-2 text-sm text-slate-700">Explore interactive workspaces and labs.</p>
            </Link>
            <Link
              href="/games/hub"
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-slate-300 hover:bg-slate-100 transition"
            >
              <Gamepad2 className="h-6 w-6 text-slate-900 mb-3" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">All Games</h3>
              <p className="mt-2 text-sm text-slate-700">Find all games and practice activities.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 11) Footer CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">Ready</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Start with something small and real</h2>
            <p className="mt-2 text-sm text-slate-100">Pick a topic, run a tool, and write down one decision you would make differently tomorrow.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Start learning <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/sitemap" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Explore everything <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      </MarketingPageTemplate>
    </Layout>
  );
}
