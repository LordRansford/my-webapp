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
import QuizBlock from "@/components/notes/QuizBlock";
import { dataSectionManifest } from "@/lib/dataSections";

const DataPipelineDesignerTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/DataPipelineDesignerTool"),
  { ssr: false }
);
const DataRiskScenariosTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/DataRiskScenariosTool"),
  { ssr: false }
);
const AnalysisPlaygroundTool = dynamic(
  () => import("@/components/notes/tools/data/intermediate/AnalysisPlaygroundTool"),
  { ssr: false }
);
const DistributionExplorerTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/DistributionExplorerTool"),
  { ssr: false }
);
const SamplingBiasSimulatorTool = dynamic(
  () => import("@/components/notes/tools/data/advanced/SamplingBiasSimulatorTool"),
  { ssr: false }
);
const EthicsScenarioTool = dynamic(
  () => import("@/components/notes/tools/data/foundations/EthicsScenarioTool"),
  { ssr: false }
);
const CorrelationMythsGame = dynamic(
  () => import("@/components/notes/tools/data/summary/CorrelationMythsGame"),
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
      QuizBlock,
      DataPipelineDesignerTool,
      DataRiskScenariosTool,
      AnalysisPlaygroundTool,
      DistributionExplorerTool,
      SamplingBiasSimulatorTool,
      EthicsScenarioTool,
      CorrelationMythsGame,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Data Summary and games",
        description: "Recap, scenarios, and playful practice for the data course.",
        level: "Summary",
        slug: "/data/summary",
        section: "data",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Warm up</p>
            <p className="text-sm text-slate-800">Quick logic warm up before diving into the data recap.</p>
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
    "data/summary.mdx",
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
