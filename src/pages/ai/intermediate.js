import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import CPDTracker from "@/components/CPDTracker";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import { aiSectionManifest } from "@/lib/aiSections";
import DiagramBlock from "@/components/DiagramBlock";

const DataProfilerTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/DataProfilerTool"), { ssr: false });
const TrainingLoopVisualizerTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/TrainingLoopVisualizerTool"), { ssr: false });
const MetricsLabTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/MetricsLabTool"), { ssr: false });
const ServingMonitorSimulatorTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/ServingMonitorSimulatorTool"), { ssr: false });
const AiRiskScenarioSimulatorTool = dynamic(() => import("@/components/notes/tools/ai/intermediate/AiRiskScenarioSimulatorTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      PageNav,
      GlossaryTip,
      QuizBlock,
      CPDTracker,
      LevelProgressBar,
      SectionProgressToggle,
      SectionHeader,
      SubsectionHeader,
      BodyText,
      DiagramBlock,
      DataProfilerTool,
      TrainingLoopVisualizerTool,
      MetricsLabTool,
      ServingMonitorSimulatorTool,
      AiRiskScenarioSimulatorTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Intermediate",
        description: "We go from friendly intuition to shaping data, training small models, and judging quality.",
        level: "Intermediate",
        slug: "/ai/intermediate",
        section: "ai",
        page: 2,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("ai/intermediate.mdx", { aiSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
