import dynamic from "next/dynamic";
import NotesLayout from "@/components/notes/Layout";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import SummaryHero from "@/components/notes/summary/SummaryHero";
import NotesStepper from "@/components/notes/summary/NotesStepper";
import RecapPanel from "@/components/notes/summary/RecapPanel";
import NextSteps from "@/components/notes/summary/NextSteps";
import ToolCard from "@/components/learn/ToolCard";

const ConceptMatchGame = dynamic(() => import("@/components/games/cybersecurity/ConceptMatchGame"), { ssr: false });
const LogHuntGame = dynamic(() => import("@/components/games/cybersecurity/LogHuntGame"), { ssr: false });
const PhishingSpotterGame = dynamic(() => import("@/components/games/cybersecurity/PhishingSpotterGame"), { ssr: false });
const RiskBalancingGame = dynamic(() => import("@/components/games/cybersecurity/RiskBalancingGame"), { ssr: false });
const QuickFireQuizGame = dynamic(() => import("@/components/games/cybersecurity/QuickFireQuizGame"), { ssr: false });

export const metadata = {
  title: "Cybersecurity Notes – Summary",
  description: "A recap of the cybersecurity notes with concise prompts to reinforce learning.",
};

export default function CybersecuritySummaryPage() {
  const meta = {
    title: "Cybersecurity Notes – Summary",
    level: "Summary",
    slug: "/notes/cybersecurity/summary",
    page: 4,
    totalPages: 4,
  };

  return (
    <NotesLayout meta={meta}>
      <ProgressBar mode="static" value={100} label="Summary" />

      <SummaryHero title="Cybersecurity Notes" subtitle="A quick recap with prompts to make the ideas stick." />

      <NotesStepper
        items={[
          { label: "Beginner", href: "/cybersecurity/beginner" },
          { label: "Intermediate", href: "/cybersecurity/intermediate" },
          { label: "Advanced", href: "/cybersecurity/advanced" },
          { label: "Summary", href: "/notes/cybersecurity/summary", active: true },
        ]}
      />

      <RecapPanel />

      <section className="rn-section" aria-labelledby="games-title">
        <h2 id="games-title" className="rn-h2">
          Practice games
        </h2>

        <ToolCard
          title="Concept match: core ideas"
          description="Match plain language descriptions to key cybersecurity terms."
        >
          <ConceptMatchGame />
        </ToolCard>

        <ToolCard
          title="Log hunt game"
          description="Scan a mini log list and pick out events that look suspicious."
        >
          <LogHuntGame />
        </ToolCard>

        <ToolCard
          title="Phishing spotter"
          description="Review short synthetic emails and decide whether to trust them."
        >
          <PhishingSpotterGame />
        </ToolCard>

        <ToolCard
          title="Risk balancing game"
          description="Distribute a small security budget across controls and see how risk changes."
        >
          <RiskBalancingGame />
        </ToolCard>
      </section>

      <section className="rn-section" aria-labelledby="quiz-title">
        <h2 id="quiz-title" className="rn-h2">
          Recap challenge
        </h2>
        <ToolCard
          title="Quick fire recap quiz"
          description="A short timed quiz that mixes questions from beginner, intermediate and advanced notes."
        >
          <QuickFireQuizGame />
        </ToolCard>
      </section>

      <NextSteps />

      <PageNav prevHref="/cybersecurity/advanced" prevLabel="Advanced" showTop showBottom />
    </NotesLayout>
  );
}
