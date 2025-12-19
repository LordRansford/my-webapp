import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import PageNav from "@/components/notes/PageNav";
import Callout from "@/components/Callout";
import ToolCard from "@/components/notes/ToolCard";
import DiagramBlock from "@/components/DiagramBlock";
import QuizBlock from "@/components/notes/QuizBlock";
import { dataSectionManifest } from "@/lib/dataSections";

const DataPipelineDesignerTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/DataPipelineDesignerTool"),
  { ssr: false }
);
const GovernancePolicySimulatorTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/GovernancePolicySimulatorTool"),
  { ssr: false }
);
const SchemaMappingLabTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/SchemaMappingLabTool"),
  { ssr: false }
);
const AnalysisPlaygroundTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/AnalysisPlaygroundTool"),
  { ssr: false }
);
const DataRiskScenariosTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/DataRiskScenariosTool"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      PageNav,
      Callout,
      ToolCard,
      DiagramBlock,
      QuizBlock,
      DataPipelineDesignerTool,
      GovernancePolicySimulatorTool,
      SchemaMappingLabTool,
      AnalysisPlaygroundTool,
      DataRiskScenariosTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Data Intermediate",
        description: "How data systems are designed, governed, trusted, and analysed in real organisations.",
        level: "Intermediate",
        slug: "/data/intermediate",
        section: "data",
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
  const { source, headings } = await loadNote(
    "data/intermediate.mdx",
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
