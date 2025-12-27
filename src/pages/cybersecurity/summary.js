import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/notes/ToolCard";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import DiagramBlock from "@/components/DiagramBlock";
import SafeIcon from "@/components/content/SafeIcon";
import ConceptMapExplorer from "@/components/ConceptMapExplorer";
import ProgressInsights from "@/components/ProgressInsights";
import CybersecuritySummaryGameHub from "@/components/notes/summary/CybersecuritySummaryGameHub";
import CrossTopicGameHub from "@/components/notes/summary/CrossTopicGameHub";

const recapCards = [
  {
    title: "Foundations",
    body: "You built the shared language: how data moves, how people get tricked, where accounts fail, and what basic controls actually do. The surprise for many people is that most incidents start as normal work, not movie hacking.",
    href: "/cybersecurity/beginner",
    icon: "shield",
    ring: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Intermediate",
    body: "You moved from facts to judgement: threat modelling, identity flows, common vulnerabilities, and how logs turn into a story you can act on. What gets misunderstood in real teams is that scanning is not security. It is just a list until you make trade offs and fix things.",
    href: "/cybersecurity/intermediate",
    icon: "target",
    ring: "border-amber-100 bg-amber-50 text-amber-700",
  },
  {
    title: "Advanced",
    body: "You connected the system view: architecture choices, crypto in practice, detection and response, and governance that makes improvements stick. The most useful shift here is this: security becomes a set of decisions you can explain, not a pile of tools you can buy.",
    href: "/cybersecurity/advanced",
    icon: "layers",
    ring: "border-blue-100 bg-blue-50 text-blue-700",
  },
];

const courseMap = [
  {
    title: "Foundations",
    summary: "Shared language, habits, and everyday defences.",
    icon: "shield",
    chip: "chip--mint",
  },
  {
    title: "Intermediate",
    summary: "Threat models, attack surfaces, and identity flows.",
    icon: "target",
    chip: "chip--amber",
  },
  {
    title: "Advanced",
    summary: "Architecture, detection, and governance in context.",
    icon: "layers",
    chip: "chip--accent",
  },
  {
    title: "Summary and games",
    summary: "Recap, games, and confidence checks.",
    icon: "award",
    chip: "chip--accent",
  },
];

const progressSegments = [
  { label: "Foundations", href: "/cybersecurity/beginner", state: "Viewed", tone: "bg-blue-100 text-blue-800" },
  { label: "Intermediate", href: "/cybersecurity/intermediate", state: "Viewed", tone: "bg-emerald-100 text-emerald-800" },
  { label: "Advanced", href: "/cybersecurity/advanced", state: "Viewed", tone: "bg-indigo-100 text-indigo-800" },
];

const challenges = [
  {
    title: "Challenge: Explain an attack and a defence",
    scenario: "Pick a system you touch daily, like work email, a social login, cloud file sharing, or a kids gaming account. Describe one likely attack and the defence you would choose.",
    questions: [
      "Which assumption is the attacker breaking?",
      "How would you spot it early, and what log or alert would you use?",
      "Which control limits blast radius if you are wrong?",
    ],
    link: "/cybersecurity/beginner#module-2-networks-packets-and-ports",
  },
  {
    title: "Challenge: Walk through a small incident",
    scenario: "A work email account is used at 2am from a new location, then a cloud file share is created. Treat it as a mini incident.",
    questions: [
      "What is your first containment move?",
      "What evidence do you capture before changing anything?",
      "Who needs to know, and when do you tell customers?",
    ],
    link: "/cybersecurity/advanced#module-4-security-operations-monitoring-and-incident-response",
  },
  {
    title: "Challenge: Design a safer small setup",
    scenario: "A three-person team ships a small web app. They use email, a repo, a team chat, and a cloud file share.",
    questions: [
      "Where do you draw trust boundaries and why?",
      "Which two logs must exist to sleep at night?",
      "How do you rotate secrets without stopping work?",
    ],
    link: "/cybersecurity/intermediate",
  },
];

export default function CyberSummary() {
  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity summary and games",
        description: "Hands on games that stress test your security intuition.",
        level: "Summary",
        slug: "/cybersecurity/summary",
        section: "cybersecurity",
        page: 4,
        totalPages: 4,
      }}
      activeLevelId="summary"
    >
      <ProgressBar mode="scroll" />

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Warm up</p>
            <p className="text-sm text-slate-800">Try the Thinking Gym for a quick logic puzzle before you recap.</p>
          </div>
          <Link className="button" href="/thinking-gym">
            Thinking Gym
          </Link>
        </div>
      </div>

      <header className="mb-6 space-y-4">
        <Link
          href="/cybersecurity"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Back to Cybersecurity overview
        </Link>
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700"
              role="img"
              aria-label="Completion badge"
            >
              <SafeIcon name="award" size={20} color="currentColor" style={{ marginRight: 0 }} />
            </span>
            <div>
              <p className="eyebrow m-0 text-gray-600">Summary and games</p>
              <h1 className="text-2xl font-semibold leading-tight text-gray-900">Cybersecurity summary and games</h1>
            </div>
            <span className="chip chip--mint">Well done</span>
          </div>
          <p className="mt-3 text-base text-gray-800 leading-relaxed">
            Well done for reaching the end of the core track. This page is your recap and a playful assessment hub. The goal is not perfect recall. The goal is a calmer, faster &quot;what matters here&quot; instinct.
          </p>
          <p className="text-base text-gray-800 leading-relaxed">
            Drop in after each level or months later to reconnect the dots between data, systems, attackers, defenders and everyday decisions. When time and budget are limited, the winning move is usually clarity: what you are protecting, who owns it, and which few controls buy you the most risk reduction.
          </p>
        </div>
      </header>

      <DiagramBlock
        title="Course map in one glance"
        subtitle="Four stops that build the same habits"
        description="Use this as a quick reminder of how the levels connect."
      >
        <div className="grid gap-3 md:grid-cols-4">
          {courseMap.map((step) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <div className="flex items-start gap-2">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                  role="img"
                  aria-label={`${step.title} icon`}
                >
                  <SafeIcon name={step.icon} size={16} color="currentColor" style={{ marginRight: 0 }} />
                </span>
                <div>
                  <div className={`chip ${step.chip}`}>{step.title}</div>
                  <p className="mt-2 text-sm text-slate-700">{step.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DiagramBlock>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700" role="img" aria-label="Recap notes">
            <SafeIcon name="book-open" size={16} color="currentColor" style={{ marginRight: 0 }} />
          </span>
          <h2 className="text-xl font-semibold text-gray-900">Quick recap of the journey</h2>
        </div>
        <p className="text-base text-gray-700">
          Here is a one paragraph recap of each level. Notice how the thinking evolves from &quot;what is this thing&quot; to &quot;what decision do I make next&quot;. Click through if you want to revisit details.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {recapCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${card.ring}`}
                  role="img"
                  aria-label={`${card.title} badge`}
                >
                  <SafeIcon name={card.icon} size={16} color="currentColor" style={{ marginRight: 0 }} />
                </span>
                <p className="text-sm font-semibold text-gray-900">{card.title}</p>
              </div>
              <p className="mt-2 text-sm text-gray-800">{card.body}</p>
              <Link
                href={card.href}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Revisit this level <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700" role="img" aria-label="Progress tracker">
            <SafeIcon name="trending" size={16} color="currentColor" style={{ marginRight: 0 }} />
          </span>
          <h2 className="text-xl font-semibold text-gray-900">Your progress across the three levels</h2>
        </div>
        <p className="text-base text-gray-700">
          I am not tracking your personal data or building a profile. This view is a gentle reminder of the path, not a strict tracker. Use it with a team or class by agreeing what done means, such as finishing labs or being able to explain the ideas aloud.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-3">
            {progressSegments.map((seg) => (
              <Link
                key={seg.label}
                href={seg.href}
                className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white/90 p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring focus:ring-blue-200"
              >
                <div className="text-sm font-semibold text-gray-900">{seg.label}</div>
                <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${seg.tone}`}>
                  {seg.state}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-full bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700" role="img" aria-label="Challenge prompts">
            <SafeIcon name="target" size={16} color="currentColor" style={{ marginRight: 0 }} />
          </span>
          <h2 className="text-xl font-semibold text-gray-900">Cross level revision challenges</h2>
        </div>
        <p className="text-base text-gray-700">
          Friendly prompts that stitch the three levels together. Use them solo, or as warm ups with a team.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {challenges.map((challenge) => (
            <ToolCard key={challenge.title} title={challenge.title} description={challenge.scenario}>
              <ul className="list-disc space-y-1 pl-4 text-sm text-gray-800">
                {challenge.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <Link
                href={challenge.link}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Jump to the notes <span aria-hidden="true">-&gt;</span>
              </Link>
            </ToolCard>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700"
              role="img"
              aria-label="Games section"
            >
              <SafeIcon name="activity" size={20} color="currentColor" style={{ marginRight: 0 }} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Games and playful practice</h2>
              <p className="text-base text-gray-700">
                These games are here to help you revisit key ideas in a low pressure way. None record scores or personal details. Just play, notice what feels fuzzy, and jump back to the notes if needed.
              </p>
              <p className="text-base text-gray-700">
                The point is purposeful repetition. Each game reinforces a decision you will make in the real world: what control to choose, where trust changes, what to log, and how to limit privilege.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <CybersecuritySummaryGameHub />
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-base text-slate-800 leading-relaxed">
              Quick nudge: when a game result surprises you, that is not failure. It is a signal. Go find the assumption you were using, then decide what control, log, or process would protect you when that assumption is wrong.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
                role="img"
                aria-label="Tool links"
              >
                <SafeIcon name="tool" size={16} color="currentColor" style={{ marginRight: 0 }} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Try the tools with real inputs</h3>
                <p className="text-sm text-slate-700">Use safe examples to see signals show up for real.</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/tools/cybersecurity#email-auth-title"
                className="chip chip--amber focus:outline-none focus:ring focus:ring-blue-200"
              >
                Email header check
              </Link>
              <Link
                href="/tools/cybersecurity#password-strength-title"
                className="chip chip--mint focus:outline-none focus:ring focus:ring-blue-200"
              >
                Password strength
              </Link>
              <Link
                href="/tools/cybersecurity#cookie-inspector-title"
                className="chip chip--accent focus:outline-none focus:ring focus:ring-blue-200"
              >
                Cookie inspector
              </Link>
              <Link
                href="/tools/cybersecurity#url-safety-title"
                className="chip chip--amber focus:outline-none focus:ring focus:ring-blue-200"
              >
                URL safety check
              </Link>
              <Link
                href="/cyber-studios"
                className="chip chip--ghost focus:outline-none focus:ring focus:ring-blue-200"
              >
                Open the cybersecurity studio
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              role="img"
              aria-label="Cross topic games"
            >
              <SafeIcon name="globe" size={16} color="currentColor" style={{ marginRight: 0 }} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cross topic games</h3>
              <p className="text-base text-gray-700">Broader prompts that mix cybersecurity with other domains.</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-base text-gray-700">
              Skill focus: spotting when a problem is not purely technical. These prompts reinforce decision making under uncertainty, where you balance safety, speed, user impact, and evidence.
            </p>
            <CrossTopicGameHub />
            <p className="mt-3 text-base text-gray-700">
              Reflection: what did you prioritise, and why. If you were advising a team, what would you write down as the rule of thumb so others can make the same call.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700" role="img" aria-label="Capstone journeys">
            <SafeIcon name="layers" size={16} color="currentColor" style={{ marginRight: 0 }} />
          </span>
          <h2 className="text-xl font-semibold text-gray-900">Capstone journeys</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ToolCard
            title="BookTrack capstone journey"
            description="Connect architecture, cybersecurity, digitalisation and AI using the BookTrack example."
          >
            <Link className="text-sm font-semibold text-blue-700 hover:underline" href="/notes/capstone/booktrack">
              Open the BookTrack capstone journey
            </Link>
          </ToolCard>
          <ToolCard
            title="GridLens capstone journey"
            description="Explore CIM-based network data with architecture, security, digitalisation and AI threads."
          >
            <Link className="text-sm font-semibold text-blue-700 hover:underline" href="/notes/capstone/gridlens">
              Open the GridLens capstone journey
            </Link>
          </ToolCard>
        </div>
      </section>

      <section className="mt-10">
        <ProgressInsights
          namespace="cyber_summary"
          sources={[
            "cyber_game_crypto_misuse",
            "cyber_game_trust_boundary",
            "cyber_game_logging_blind_spot",
            "cyber_game_privilege_escalation",
            "cross_game_hallucination_trust",
            "cross_game_autonomous_defence",
          ]}
        />
      </section>

      <section className="mt-10 space-y-3">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700"
              role="img"
              aria-label="Reflection prompt"
            >
              <SafeIcon name="book" size={20} color="currentColor" style={{ marginRight: 0 }} />
            </span>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">CPD reflection prompt</h2>
              <p className="text-base text-gray-800 leading-relaxed">
                If you had one hour next week to make a real organisation safer, what would you change first, and what would you deliberately not do yet.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base text-gray-800">
                <li>Which two controls would you prioritise because they reduce real risk quickly.</li>
                <li>Which risk would you now notice immediately in a meeting or design review.</li>
                <li>What evidence or logs would you insist on so incidents become manageable, not mysterious.</li>
              </ul>
              <p className="text-base text-gray-800 leading-relaxed">
                Bonus: write the decision in one sentence, then write the trade off you are accepting. That is the skill that scales.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <PageNav
          prevHref="/cybersecurity/advanced"
          prevLabel="Advanced"
          nextHref="/cybersecurity"
          nextLabel="Back to overview"
          showTop
          showBottom
        />
      </div>
    </NotesLayout>
  );
}
