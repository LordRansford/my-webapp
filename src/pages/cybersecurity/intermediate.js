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
import { FlowDiagram, LayerDiagram, TimelineDiagram, BoundaryDiagram, ComparisonDiagram } from "@/components/notes/diagrams";

const NoteImage = dynamic(() => import("@/components/notes/NoteMedia").then((m) => m.NoteImage));
const NoteVideo = dynamic(() => import("@/components/notes/NoteMedia").then((m) => m.NoteVideo));
const PhishingSpotterTool = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.PhishingSpotterTool), { ssr: false });
const PasswordStrengthLab = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.PasswordStrengthLab), { ssr: false });
const RBACSimulator = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.RBACSimulator), { ssr: false });
const RansomwareResponseSimulator = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.RansomwareResponseSimulator), { ssr: false });
const LogAnalysisMiniLab = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.LogAnalysisMiniLab), { ssr: false });
const InputValidationSimulator = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.InputValidationSimulator), { ssr: false });
const IncidentTimelineTool = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.IncidentTimelineTool), { ssr: false });
const InlineQuizCard = dynamic(() => import("@/components/notes/cybersecurity/chapter3-tools").then((m) => m.QuizCard), { ssr: false });
const PacketJourneyTool = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.PacketJourneyTool), { ssr: false });
const LbtSimulator = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.LbtSimulator), { ssr: false });
const InterceptionExplorer = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.InterceptionExplorer), { ssr: false });
const DNSJourney = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.DNSJourney), { ssr: false });
const HandshakeExplorer = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.HandshakeExplorer), { ssr: false });
const CertificateChainExplorer = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.CertificateChainExplorer), { ssr: false });
const IntegrityLab = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.IntegrityLab), { ssr: false });
const MiniIncidentSimulator = dynamic(() => import("@/components/notes/cybersecurity/chapter2-tools").then((m) => m.MiniIncidentSimulator), { ssr: false });
const Recap = dynamic(() => import("@/components/notes/Recap"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      DeeperDive,
      ToolCard,
      Callout,
      MathInline,
      MathBlock,
      GlossaryTip,
      QuizBlock,
      FlowDiagram,
      LayerDiagram,
      TimelineDiagram,
      BoundaryDiagram,
      ComparisonDiagram,
      NoteImage,
      NoteVideo,
      PhishingSpotterTool,
      PasswordStrengthLab,
      RBACSimulator,
      RansomwareResponseSimulator,
      LogAnalysisMiniLab,
      InputValidationSimulator,
      IncidentTimelineTool,
      InlineQuizCard,
      PacketJourneyTool,
      LbtSimulator,
      InterceptionExplorer,
      DNSJourney,
      HandshakeExplorer,
      CertificateChainExplorer,
      IntegrityLab,
      MiniIncidentSimulator,
      Quiz,
      Recap,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Cybersecurity Notes – Intermediate", description: "Chapter 2 – How information moves and trust is built", level: "Intermediate" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch2.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
