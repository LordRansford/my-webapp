import dynamic from "next/dynamic";
import { useMemo } from "react";
import { NotesLayout } from "@/components/notes/NotesLayout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import { Callout } from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { PrintSummary } from "@/components/notes/PrintSummary";
import { MathInline, MathBlock } from "@/components/notes/Math";
import { FlowDiagram, LayerDiagram, TimelineDiagram, BoundaryDiagram, ComparisonDiagram } from "@/components/notes/diagrams";

const SecurityGoalsSorter = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/SecurityGoalsSorter"), { ssr: false });
const RiskDial = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/RiskDial"), { ssr: false });
const BitFlipVisualizer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BitFlipVisualizer"), { ssr: false });
const BitPositionExplorer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BitPositionExplorer"), { ssr: false });
const BinaryCarryTrainer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BinaryCarryTrainer"), { ssr: false });
const EncodingInspector = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EncodingInspector"), { ssr: false });
const HashAvalancheVisualizer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/HashAvalancheVisualizer"), { ssr: false });
const EntropySimulator = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EntropySimulator"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });

export default function Page({ source, meta }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      DeeperDive,
      PrintSummary,
      MathInline,
      MathBlock,
      FlowDiagram,
      LayerDiagram,
      TimelineDiagram,
      BoundaryDiagram,
      ComparisonDiagram,
      SecurityGoalsSorter,
      RiskDial,
      BitFlipVisualizer,
      BitPositionExplorer,
      BinaryCarryTrainer,
      EncodingInspector,
      HashAvalancheVisualizer,
      EntropySimulator,
      Quiz,
    }),
    []
  );

  return (
    <NotesLayout
      title="Cybersecurity Notes"
      subtitle="Chapter 1 – Foundations"
      pageKey="cybersecurity-ch1"
    >
      <article className="prose max-w-4xl prose-neutral text-[17px] leading-[1.85]">
        <MDXRenderer source={source} components={mdxComponents} />
      </article>
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch1.mdx");
  return {
    props: {
      source: note.source,
      meta: note.meta,
    },
  };
}
