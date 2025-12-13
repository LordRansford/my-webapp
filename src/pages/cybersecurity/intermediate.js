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
      Recap,
    }),
    []
  );

  return (
    <NotesLayout title="Cybersecurity Notes" subtitle="Chapter 2 – How information moves and trust is built" pageKey="cybersecurity-ch2">
      <MDXRenderer source={source} components={mdxComponents} />
      <NotesPager
        prev={{ href: "/cybersecurity/beginner", label: "Chapter 1" }}
        next={{ href: "/cybersecurity/advanced", label: "Chapter 3" }}
      />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/ch2.mdx");
  return {
    props: {
      source: note.source,
    },
  };
}
