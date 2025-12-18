import dynamic from "next/dynamic";
import Link from "next/link";
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
import CPDTracker from "@/components/CPDTracker";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import { cyberSectionManifest } from "@/lib/cyberSections";

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
const RiskDial = dynamic(() => import("@/components/notes/tools/cybersecurity/ch1/RiskDial"), { ssr: false });
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
      RiskDial,
      Quiz,
      Recap,
      PageNav,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      CPDTracker,
      LevelProgressBar,
      SectionProgressToggle,
    }),
    []
  );

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "pages/cybersecurity/beginner.js:mdxComponents",
      message: "mdxComponents keys",
      data: { keys: Object.keys(mdxComponents) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  // #region agent log
  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const logLine = JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "pages/cybersecurity/beginner.js:ssr",
        message: "SSR mdxComponents keys",
        data: { keys: Object.keys(mdxComponents) },
        timestamp: Date.now(),
      });
      fs.appendFileSync("c:\\Users\\sager\\my-webapp\\.cursor\\debug.log", `${logLine}\n`);
    } catch {}
  }
  // #endregion agent log

  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity Foundations",
        description: "Level 1 of my cybersecurity course. Data, networks, attackers, and everyday defences with hands-on labs.",
        level: "Foundations",
        slug: "/cybersecurity/beginner",
        page: 1,
        totalPages: 4,
      }}
      headings={headings}
    >
      <div className="mb-4">
        <Link
          href="/cybersecurity"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
        >
          ← Back to Cybersecurity overview
        </Link>
      </div>
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
