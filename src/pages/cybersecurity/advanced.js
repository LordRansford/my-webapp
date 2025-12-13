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

const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });
const ThreatModelCanvasTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ThreatModelCanvasTool"), { ssr: false });
const AttackChainTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/AttackChainTool"), { ssr: false });
const ControlMappingTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ControlMappingTool"), { ssr: false });
const ZeroTrustPolicyTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ZeroTrustPolicyTool"), { ssr: false });
const LogStoryTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/LogStoryTool"), { ssr: false });
const IncidentTriageTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/IncidentTriageTool"), { ssr: false });
const VulnerabilityLifecycleTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/VulnerabilityLifecycleTool"), { ssr: false });
const BackupRansomwareRecoveryTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/BackupRansomwareRecoveryTool"), { ssr: false });

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
      Quiz,
      ThreatModelCanvasTool,
      AttackChainTool,
      ControlMappingTool,
      ZeroTrustPolicyTool,
      LogStoryTool,
      IncidentTriageTool,
      VulnerabilityLifecycleTool,
      BackupRansomwareRecoveryTool,
      Recap,
    }),
    []
  );

  return (
    <NotesLayout title="Cybersecurity Notes" subtitle="Chapter 3 – Systems, attackers, and resilience" pageKey="cybersecurity-ch3">
      <MDXRenderer source={source} components={mdxComponents} />
      <NotesPager
        prev={{ href: "/cybersecurity/intermediate", label: "Chapter 2" }}
        next={null}
      />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch3.mdx");
  return {
    props: {
      source: note.source,
    },
  };
}
