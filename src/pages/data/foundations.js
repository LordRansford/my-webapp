import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import DiagramBlock from "@/components/DiagramBlock";
import QuizBlock from "@/components/notes/QuizBlock";
import Callout from "@/components/Callout";
import { dataSectionManifest } from "@/lib/dataSections";

const DataAroundYouTool = dynamic(() => import("@/components/notes/tools/data/foundations/DataAroundYouTool"), { ssr: false });
const TextToBytesVisualizer = dynamic(() => import("@/components/notes/tools/data/foundations/TextToBytesVisualizer"), { ssr: false });
const DataQualityCheckerTool = dynamic(() => import("@/components/notes/tools/data/foundations/DataQualityCheckerTool"), { ssr: false });
const LifecycleMapperTool = dynamic(() => import("@/components/notes/tools/data/foundations/LifecycleMapperTool"), { ssr: false });
const RoleMatcherTool = dynamic(() => import("@/components/notes/tools/data/foundations/RoleMatcherTool"), { ssr: false });
const EthicsScenarioTool = dynamic(() => import("@/components/notes/tools/data/foundations/EthicsScenarioTool"), { ssr: false });
const SharedDataInterpretationTool = dynamic(
  () => import("@/components/notes/tools/data/foundations/SharedDataInterpretationTool"),
  { ssr: false }
);
const SharedLifecycleRisksTool = dynamic(
  () => import("@/components/notes/tools/data/foundations/SharedLifecycleRisksTool"),
  { ssr: false }
);
const SharedDataToDecisionTool = dynamic(
  () => import("@/components/notes/tools/data/foundations/SharedDataToDecisionTool"),
  { ssr: false }
);
const DataFormatExplorer = dynamic(
  () => import("@/components/notes/tools/data/foundations/DataFormatExplorer"),
  { ssr: false }
);
const DataQualitySandbox = dynamic(
  () => import("@/components/notes/tools/data/foundations/DataQualitySandbox"),
  { ssr: false }
);
const DataFlowVisualizer = dynamic(
  () => import("@/components/notes/tools/data/foundations/DataFlowVisualizer"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      SectionHeader,
      SubsectionHeader,
      BodyText,
      PageNav,
      Callout,
      ToolCard,
      DiagramBlock,
      QuizBlock,
      DataAroundYouTool,
      TextToBytesVisualizer,
      DataQualityCheckerTool,
      LifecycleMapperTool,
      RoleMatcherTool,
      EthicsScenarioTool,
      SharedDataInterpretationTool,
      SharedLifecycleRisksTool,
      SharedDataToDecisionTool,
      DataFormatExplorer,
      DataQualitySandbox,
      DataFlowVisualizer,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Data Foundations",
        description: "Start with the language, formats, and habits that make data useful across teams.",
        level: "Foundations",
        slug: "/data/foundations",
        section: "data",
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
  const { source, headings } = await loadNote(
    "data/foundations.mdx",
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
