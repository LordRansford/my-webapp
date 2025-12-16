import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { MathInline, MathBlock } from "@/components/notes/Math";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";

const DataNoiseTool = dynamic(() => import("@/components/notes/tools/ai/beginner/DataNoiseTool"), { ssr: false });
const FeatureLeakageTool = dynamic(() => import("@/components/notes/tools/ai/beginner/FeatureLeakageTool"), { ssr: false });
const ThresholdPlaygroundTool = dynamic(() => import("@/components/notes/tools/ai/beginner/ThresholdPlaygroundTool"), { ssr: false });
const ClusteringIntuitionTool = dynamic(() => import("@/components/notes/tools/ai/beginner/ClusteringIntuitionTool"), { ssr: false });
const OverfitExplorerTool = dynamic(() => import("@/components/notes/tools/ai/beginner/OverfitExplorerTool"), { ssr: false });
const GradientStepTool = dynamic(() => import("@/components/notes/tools/ai/beginner/GradientStepTool"), { ssr: false });
const ResponsibleAIPlannerTool = dynamic(() => import("@/components/notes/tools/ai/beginner/ResponsibleAIPlannerTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      DeeperDive,
      MathInline,
      MathBlock,
      PageNav,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      DataNoiseTool,
      FeatureLeakageTool,
      ThresholdPlaygroundTool,
      ClusteringIntuitionTool,
      OverfitExplorerTool,
      GradientStepTool,
      ResponsibleAIPlannerTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Notes - Beginner",
        description: "My beginner AI notes with intuition, maths, tools, and responsible practice.",
        level: "Beginner",
        slug: "/ai/beginner",
        section: "ai",
        page: 1,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("ai/beginner.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
