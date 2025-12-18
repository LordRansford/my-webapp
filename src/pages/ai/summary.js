import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import QuizBlock from "@/components/notes/QuizBlock";
import PageNav from "@/components/notes/PageNav";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import DiagramBlock from "@/components/DiagramBlock";
import GameHub from "@/components/GameHub";
import { aiSectionManifest } from "@/lib/aiSections";

const AIExamplesExplorerTool = dynamic(() => import("@/components/notes/tools/ai/beginner/AIExamplesExplorerTool"), { ssr: false });
const TrainingLoopVisualizerTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/TrainingLoopVisualizerTool"), { ssr: false });
const TransformerAttentionExplorerTool = dynamic(() => import("@/components/notes/tools/ai/advanced/TransformerAttentionExplorerTool"), { ssr: false });
const ConceptMatchGame = dynamic(() => import("@/components/notes/tools/ai/summary/ConceptMatchGame"), { ssr: false });
const ScenarioClinicGame = dynamic(() => import("@/components/notes/tools/ai/summary/ScenarioClinicGame"), { ssr: false });
const PipelineBuilderGame = dynamic(() => import("@/components/notes/tools/ai/summary/PipelineBuilderGame"), { ssr: false });
const SafetyGuardianGame = dynamic(() => import("@/components/notes/tools/ai/summary/SafetyGuardianGame"), { ssr: false });

export default function AISummary({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      QuizBlock,
      PageNav,
      LevelProgressBar,
      CPDTracker,
      DiagramBlock,
      GameHub,
      AIExamplesExplorerTool,
      TrainingLoopVisualizerTool,
      TransformerAttentionExplorerTool,
      ConceptMatchGame,
      ScenarioClinicGame,
      PipelineBuilderGame,
      SafetyGuardianGame,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Summary and games",
        description: "A relaxed wrap up of the AI journey with quick recaps, games and labs to lock the learning in.",
        level: "Summary",
        slug: "/ai/summary",
        section: "ai",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("ai/summary.mdx", { aiSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
