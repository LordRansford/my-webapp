import dynamic from "next/dynamic";
import { useMemo } from "react";
import { NotesLayout } from "@/components/notes/NotesLayout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import { Callout } from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { MathInline, MathBlock } from "@/components/notes/Math";
import { FlowDiagram, LayerDiagram, TimelineDiagram, BoundaryDiagram, ComparisonDiagram } from "@/components/notes/diagrams";
import Recap from "@/components/notes/Recap";
import NotesPager from "@/components/notes/NotesPager";

const SecurityGoalsSorter = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/SecurityGoalsSorter"), { ssr: false });
const RiskDial = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/RiskDial"), { ssr: false });
const BitFlipVisualizer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BitFlipVisualizer"), { ssr: false });
const BitPositionExplorer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BitPositionExplorer"), { ssr: false });
const BinaryCarryTrainer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BinaryCarryTrainer"), { ssr: false });
const EncodingInspector = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EncodingInspector"), { ssr: false });
const HashAvalancheVisualizer = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/HashAvalancheVisualizer"), { ssr: false });
const EntropySimulator = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EntropySimulator"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });

export default function Page({ source }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      DeeperDive,
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
      Recap,
    }),
    []
  );

  return (
    <NotesLayout title="Cybersecurity Notes" subtitle="Chapter 1 – Foundations" pageKey="cybersecurity-ch1">
      <MDXRenderer source={source} components={mdxComponents} />
      <NotesPager
        prev={null}
        next={{ href: "/cybersecurity/intermediate", label: "Chapter 2" }}
      />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch1.mdx");
  return {
    props: {
      source: note.source,
    },
  };
}
