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
      <ProgressBar mode="static" value={100} label="Summary" />

      <h1>Cybersecurity Notes, Summary and Games</h1>
      <p className="text-base text-gray-800 leading-relaxed">
        Security becomes easier to talk about than to do. This page is built to make the gaps obvious in a safe way, then close them with practice.
      </p>
      <p className="text-base text-gray-800 leading-relaxed">
        The point is not to feel clever. The point is to build judgement. The kind that holds up when someone is tired, rushed, or under pressure.
      </p>

      <section data-note-block="true" className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">A quick reset</h2>
        <p>Most security failures are not caused by exotic attacks. They are caused by normal design decisions that quietly created the wrong trust assumptions.</p>
        <p>Cryptography is powerful. It does not rescue weak system design.</p>
        <p>Detection matters because prevention always fails eventually.</p>
      </section>

      <hr />

      <h2 className="text-xl font-semibold text-gray-900 mt-8">Concept map</h2>
      <p className="text-sm text-gray-700 mb-2">
        Tap a node. If one node feels vague, it usually means you are about to confuse a control with a guarantee.
      </p>
      <ToolCard title="Cybersecurity mental model map">
        <ConceptMapExplorer
          storageKey="cyber_summary_concept_map"
          nodes={[
            { id: "data", title: "Data", body: "Security begins with what data is, where it lives, and who can touch it. Data is the asset. Everything else is a story we tell to protect it." },
            { id: "trust", title: "Trust", body: "Trust is a decision, not a feeling. Systems fail when trust is implied instead of enforced." },
            { id: "surface", title: "Attack surface", body: "Attack surface is where inputs enter and assumptions get tested. Complexity expands it. Defaults expand it." },
            { id: "identity", title: "Identity", body: "Identity is how systems decide who can do what. Mistakes here spread everywhere." },
            { id: "detection", title: "Detection", body: "If you cannot see, you cannot defend. Detection is about signals, not certainty." },
            { id: "response", title: "Response", body: "Incidents are not rare. What is rare is being ready. Response is practice plus clarity." },
          ]}
        />
      </ToolCard>

      <hr />

      <h2 className="text-xl font-semibold text-gray-900 mt-8">Game hub</h2>
      <GameHub
        storageKey="cyber_summary_games"
        title="Cybersecurity game hub"
        subtitle="Choose a game. Make the call. See the consequences."
        games={[
          {
            id: "crypto_misuse",
            title: "The Encryption Misuse Trap",
            level: "Warm up",
            minutes: 5,
            summary: "You will choose between hashing, encryption, and signing. Some choices feel right and still fail.",
            component: <CryptoMisuseSimulator storageKey="cyber_game_crypto_misuse" />,
          },
          {
            id: "trust_boundary",
            title: "Spot the Trust Boundary",
            level: "Core",
            minutes: 6,
            summary: "Mark where trust changes. Hidden attacker paths will be revealed when you get it wrong.",
            component: <TrustBoundaryExplorer storageKey="cyber_game_trust_boundary" />,
          },
          {
            id: "logging_blind_spot",
            title: "The Silent Logging Failure",
            level: "Core",
            minutes: 6,
            summary: "Configure logging. An attack happens. You will discover what you cannot see.",
            component: <LoggingBlindSpotSimulator storageKey="cyber_game_logging_blind_spot" />,
          },
          {
            id: "privilege_escalation",
            title: "The Overconfident Control",
            level: "Stretch",
            minutes: 7,
            summary: "Assign roles. Then watch how small privilege mistakes become big breaches.",
            component: <PrivilegeEscalationGame storageKey="cyber_game_privilege_escalation" />,
          },
        ]}
      />

      <hr />

      <h2 className="text-xl font-semibold text-gray-900 mt-8">Cross topic games</h2>
      <CrossDomainGames />

      <hr />

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

      <PageNav
        prevHref="/cybersecurity/advanced"
        prevLabel="Advanced"
        nextHref="/ai/beginner"
        nextLabel="AI Beginner"
        showTop
        showBottom
      />
    </NotesLayout>
  );
}
