import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { MathInline, MathBlock } from "@/components/notes/Math";
import { FlowDiagram, LayerDiagram, TimelineDiagram, BoundaryDiagram, ComparisonDiagram } from "@/components/notes/diagrams";
import { Figure, Diagram, Icon, Table } from "@/components/content";
import Recap from "@/components/notes/Recap";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";

const BitChangeTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/BitChangeTool"), { ssr: false });
const EncodingExplorerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EncodingExplorerTool"), { ssr: false });
const UnicodeBytesTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/UnicodeBytesTool"), { ssr: false });
const CIAClassifierTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/CIAClassifierTool"), { ssr: false });
const TrustBoundaryTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/TrustBoundaryTool"), { ssr: false });
const IntegrityChainTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/IntegrityChainTool"), { ssr: false });
const PacketJourneyTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/PacketJourneyTool"), { ssr: false });
const MetadataLeakTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/MetadataLeakTool"), { ssr: false });
const EncryptionPlacementTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/EncryptionPlacementTool"), { ssr: false });
const PasswordEntropyTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/PasswordEntropyTool"), { ssr: false });
const HashFingerprintTool = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/HashFingerprintTool"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });

export default function Page({ source, headings }) {
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
      Figure,
      Diagram,
      Icon,
      Table,
      BitChangeTool,
      EncodingExplorerTool,
      UnicodeBytesTool,
      CIAClassifierTool,
      TrustBoundaryTool,
      IntegrityChainTool,
      PacketJourneyTool,
      MetadataLeakTool,
      EncryptionPlacementTool,
      PasswordEntropyTool,
      HashFingerprintTool,
      Quiz,
      Recap,
      PageNav,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity Notes - Beginner",
        description: "Chapter 1 - Foundations",
        level: "Beginner",
        slug: "/cybersecurity/beginner",
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
  const note = await loadNote("cybersecurity/ch1.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
