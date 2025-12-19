import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import DiagramBlock from "@/components/DiagramBlock";
import QuizBlock from "@/components/notes/QuizBlock";
import { dataSectionManifest } from "@/lib/dataSections";

const DistributionExplorerTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/DistributionExplorerTool"),
  { ssr: false }
);
const ModelAbstractionLabTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/ModelAbstractionLabTool"),
  { ssr: false }
);
const SamplingBiasSimulatorTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/SamplingBiasSimulatorTool"),
  { ssr: false }
);
const ReplicationConsistencyVisualizerTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/ReplicationConsistencyVisualizerTool"),
  { ssr: false }
);
const GovernanceDecisionSimulatorTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/GovernanceDecisionSimulatorTool"),
  { ssr: false }
);
const DataStrategySandboxTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/DataStrategySandboxTool"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      PageNav,
      ToolCard,
      DiagramBlock,
      QuizBlock,
      DistributionExplorerTool,
      ModelAbstractionLabTool,
      SamplingBiasSimulatorTool,
      ReplicationConsistencyVisualizerTool,
      GovernanceDecisionSimulatorTool,
      DataStrategySandboxTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Data Advanced",
        description: "Advanced data systems, mathematical foundations, and strategic decision making at scale.",
        level: "Advanced",
        slug: "/data/advanced",
        section: "data",
        page: 3,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote(
    "data/advanced.mdx",
    { dataSectionManifest },
    { contentRoot: "courses" }
  );
  return {
    props: {
      source,
      headings,
    },
  };
}
