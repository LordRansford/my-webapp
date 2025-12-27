import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import PageNav from "@/components/notes/PageNav";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import DiagramBlock from "@/components/DiagramBlock";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";

const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });
const SchemaMappingSandbox = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/SchemaMappingSandbox"), { ssr: false });
const DigitalMaturityGauge = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/DigitalMaturityGauge"), { ssr: false });
const RiskRoadmapPlannerTool = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/RiskRoadmapPlannerTool"), { ssr: false });
const DigiConceptMatchGame = dynamic(() => import("@/components/games/digitalisation/DigiConceptMatchGame"), { ssr: false });
const ValueChainBuilderGame = dynamic(() => import("@/components/games/digitalisation/ValueChainBuilderGame"), { ssr: false });
const OperatingModelDesignerGame = dynamic(() => import("@/components/games/digitalisation/OperatingModelDesignerGame"), { ssr: false });
const MaturityPathGame = dynamic(() => import("@/components/games/digitalisation/MaturityPathGame"), { ssr: false });
const DigiQuickFireQuizGame = dynamic(() => import("@/components/games/digitalisation/DigiQuickFireQuizGame"), { ssr: false });
const DigitalisationGameHub = dynamic(() => import("@/components/notes/summary/DigitalisationGameHub"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      PageNav,
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      DiagramBlock,
      DigitalisationDashboard,
      SchemaMappingSandbox,
      DigitalMaturityGauge,
      RiskRoadmapPlannerTool,
      DigiConceptMatchGame,
      ValueChainBuilderGame,
      OperatingModelDesignerGame,
      MaturityPathGame,
      DigiQuickFireQuizGame,
      DigitalisationGameHub,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation summary and games",
        description: "Quick recap, games and reflections to pull together your digitalisation understanding.",
        level: "Summary",
        slug: "/digitalisation/summary",
        section: "digitalisation",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Warm up</p>
            <p className="text-sm text-slate-800">Visit the Thinking Gym for a short logic puzzle before the summary.</p>
          </div>
          <a className="button" href="/thinking-gym">
            Thinking Gym
          </a>
        </div>
      </div>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote(
    "digitalisation/summary.mdx",
    { digitalisationSectionManifest },
    { contentRoot: "courses" }
  );
  return {
    props: {
      source,
      headings,
    },
  };
}
