import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/notes/ToolCard";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import ConceptMapExplorer from "@/components/ConceptMapExplorer";
import GameHub from "@/components/GameHub";
import CrossDomainGames from "@/components/CrossDomainGames";
import ProgressInsights from "@/components/ProgressInsights";

import CryptoMisuseSimulator from "@/tools/cybersecurity/CryptoMisuseSimulator";
import TrustBoundaryExplorer from "@/tools/cybersecurity/TrustBoundaryExplorer";
import LoggingBlindSpotSimulator from "@/tools/cybersecurity/LoggingBlindSpotSimulator";
import PrivilegeEscalationGame from "@/tools/cybersecurity/PrivilegeEscalationGame";

const recapCards = [
  {
    title: "Foundations",
    body: "Data, packets, phishing tells, passwords and quick risk habits with hands-on labs. Human, plain language, no jargon.",
    href: "/cybersecurity/beginner",
  },
  {
    title: "Applied",
    body: "Threat thinking, web auth flows, common vulns, logs, and risk trade-offs. More scenarios, still grounded.",
    href: "/cybersecurity/intermediate",
  },
  {
    title: "Practice and Strategy",
    body: "Secure architecture, crypto in practice, DevSecOps, ops, risk and governance tied together for real systems.",
    href: "/cybersecurity/advanced",
  },
];

const progressSegments = [
  { label: "Foundations", href: "/cybersecurity/beginner", state: "Viewed", tone: "bg-blue-100 text-blue-800" },
  { label: "Applied", href: "/cybersecurity/intermediate", state: "Viewed", tone: "bg-emerald-100 text-emerald-800" },
  { label: "Practice & Strategy", href: "/cybersecurity/advanced", state: "Viewed", tone: "bg-indigo-100 text-indigo-800" },
];

const challenges = [
  {
    title: "Challenge: Explain an attack and a defence",
    scenario: "Pick a simple system you know. Describe one likely attack and the defence you would choose.",
    questions: [
      "Which assumption is the attacker breaking?",
      "How would you spot it early, and what log or alert would you use?",
      "Which control limits blast radius if you are wrong?",
    ],
    link: "/cybersecurity/beginner#module-2-networks-packets-and-ports",
  },
  {
    title: "Challenge: Walk through a small incident",
    scenario: "A test account is used at 2am from a new location. Treat it as a mini incident.",
    questions: [
      "What is your first containment move?",
      "What evidence do you capture before changing anything?",
      "Who needs to know, and when do you tell customers?",
    ],
    link: "/cybersecurity/advanced#module-4-security-operations-monitoring-and-incident-response",
  },
  {
    title: "Challenge: Design a safer small setup",
    scenario: "A three-person team ships a small web app. They have email, a repo, a CI pipeline, and a cloud account.",
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
    >
      <ProgressBar mode="scroll" />

      <header className="mb-6 space-y-3">
        <Link
          href="/cybersecurity"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
        >
          ← Back to Cybersecurity overview
        </Link>
        <p className="eyebrow m-0 text-gray-600">Summary & games · Level 3 of 3</p>
        <h1 className="text-2xl font-semibold leading-tight text-gray-900">Cybersecurity summary and games</h1>
        <p className="text-base text-gray-800 leading-relaxed">
          I see this page as the place where we zoom out, remind ourselves what we have learned and then play. You might be here just after finishing a level, months later for a quick refresher, or with a team who wants to try out the games together.
        </p>
        <p className="text-base text-gray-800 leading-relaxed">
          The point is not to memorise lists. The point is to reconnect the dots between data, systems, attackers, defenders and everyday decisions.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick recap of the journey</h2>
        <p className="text-sm text-gray-700">Here is a one paragraph recap of each level. Click through if you want to revisit details.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {recapCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="eyebrow text-gray-600">{card.title}</p>
              <p className="mt-1 text-sm text-gray-800">{card.body}</p>
              <Link
                href={card.href}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Revisit this level <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your progress across the three levels</h2>
        <p className="text-sm text-gray-700">
          I am not tracking your personal data or building a profile. This view is a gentle reminder of the path, not a strict tracker. Use it with a team or class by agreeing what “done” means, such as finishing labs or being able to explain the ideas aloud.
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
                <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${seg.tone}`}>
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
        <h2 className="text-xl font-semibold text-gray-900">Cross level revision challenges</h2>
        <p className="text-sm text-gray-700">
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
                Jump to the notes <span aria-hidden="true">→</span>
              </Link>
            </ToolCard>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Games and playful practice</h2>
        <p className="text-sm text-gray-700">
          These games are here to help you revisit key ideas in a low pressure way. None record scores or personal details; just play, notice what feels fuzzy, and jump back to the notes if needed.
        </p>
        <p className="text-sm text-gray-700">You can play them alone, with friends, or as quick warm ups in team sessions.</p>
        <GameHub
          storageKey="cyber_summary_games"
          title="Cybersecurity game hub"
          subtitle="Choose a game. Make the call. See the consequences."
          games={[
            {
              id: "crypto_misuse",
              title: "Hash, encrypt or sign?",
              level: "Warm up",
              minutes: 5,
              summary: "Pick the right tool for the flow and see why the wrong choice fails.",
              component: <CryptoMisuseSimulator storageKey="cyber_game_crypto_misuse" />,
            },
            {
              id: "trust_boundary",
              title: "Spot the trust boundary",
              level: "Core",
              minutes: 6,
              summary: "Mark where trust changes; hidden attacker paths appear when you miss one.",
              component: <TrustBoundaryExplorer storageKey="cyber_game_trust_boundary" />,
            },
            {
              id: "logging_blind_spot",
              title: "The silent logging failure",
              level: "Core",
              minutes: 6,
              summary: "Configure logging, run a small attack, and discover what you cannot see.",
              component: <LoggingBlindSpotSimulator storageKey="cyber_game_logging_blind_spot" />,
            },
            {
              id: "privilege_escalation",
              title: "Privilege escalation quick play",
              level: "Stretch",
              minutes: 7,
              summary: "Assign roles and watch how small permission gaps become big breaches.",
              component: <PrivilegeEscalationGame storageKey="cyber_game_privilege_escalation" />,
            },
          ]}
        />

        <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold text-gray-900">Cross topic games</h3>
          <p className="text-sm text-gray-700">Broader prompts that mix cybersecurity with other domains.</p>
          <CrossDomainGames />
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Capstone journeys</h2>
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

      <div className="mt-10">
        <PageNav
          prevHref="/cybersecurity/advanced"
          prevLabel="Practice and Strategy"
          nextHref="/cybersecurity"
          nextLabel="Back to overview"
          showTop
          showBottom
        />
      </div>
    </NotesLayout>
  );
}
