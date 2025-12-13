import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { MathInline, MathBlock } from "@/components/notes/Math";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import Recap from "@/components/notes/Recap";

const NoteImage = dynamic(() => import("@/components/notes/NoteMedia").then((m) => m.NoteImage));
const NoteVideo = dynamic(() => import("@/components/notes/NoteMedia").then((m) => m.NoteVideo));
const ThreatModelCanvasTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ThreatModelCanvasTool"), { ssr: false });
const AttackChainTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/AttackChainTool"), { ssr: false });
const ControlMappingTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ControlMappingTool"), { ssr: false });
const ZeroTrustPolicyTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/ZeroTrustPolicyTool"), { ssr: false });
const LogStoryTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/LogStoryTool"), { ssr: false });
const IncidentTriageTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/IncidentTriageTool"), { ssr: false });
const VulnerabilityLifecycleTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/VulnerabilityLifecycleTool"), { ssr: false });
const BackupRansomwareRecoveryTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch3/BackupRansomwareRecoveryTool"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      DeeperDive,
      MathInline,
      MathBlock,
      GlossaryTip,
      QuizBlock,
      Recap,
      NoteImage,
      NoteVideo,
      ThreatModelCanvasTool,
      AttackChainTool,
      ControlMappingTool,
      ZeroTrustPolicyTool,
      LogStoryTool,
      IncidentTriageTool,
      VulnerabilityLifecycleTool,
      BackupRansomwareRecoveryTool,
      Quiz,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Cybersecurity Notes – Advanced", description: "Chapter 3 – Systems, attackers, and resilience", level: "Advanced" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch3.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
