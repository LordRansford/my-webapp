import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/learn/ToolCard";
import Callout from "@/components/notes/Callout";
import { DeeperDive } from "@/components/notes/DeeperDive";
import { MathInline, MathBlock } from "@/components/notes/Math";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import { FlowDiagram, LayerDiagram, TimelineDiagram, BoundaryDiagram, ComparisonDiagram } from "@/components/notes/diagrams";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import DiagramBlock from "@/components/DiagramBlock";
import CPDTracker from "@/components/CPDTracker";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import { cyberSections } from "@/lib/cyberSections";

const ThreatScenarioMapper = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/ThreatScenarioMapper"), { ssr: false });
const AttackSurfaceExplorer = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/AttackSurfaceExplorer"), { ssr: false });
const AuthSessionFlowLab = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/AuthSessionFlowLab"), { ssr: false });
const SessionHijackConceptDemo = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/SessionHijackConceptDemo"), { ssr: false });
const LogSignalExplorer = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/LogSignalExplorer"), { ssr: false });
const RiskTradeoffVisualizer = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/RiskTradeoffVisualizer"), { ssr: false });
const IntermediateQuizBoard = dynamic(() => import("@/components/dashboards/cybersecurity/intermediate/IntermediateQuizBoard"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });
const Recap = dynamic(() => import("@/components/notes/Recap"), { ssr: false });

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
      ProgressBar,
      DiagramBlock,
      FlowDiagram,
      LayerDiagram,
      TimelineDiagram,
      BoundaryDiagram,
      ComparisonDiagram,
      CPDTracker,
      LevelProgressBar,
      SectionProgressToggle,
      ThreatScenarioMapper,
      AttackSurfaceExplorer,
      AuthSessionFlowLab,
      SessionHijackConceptDemo,
      LogSignalExplorer,
      RiskTradeoffVisualizer,
      IntermediateQuizBoard,
      Quiz,
      PageNav,
      Recap,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Applied Cybersecurity",
        description: "How systems fail and how we defend them",
        level: "Applied",
        slug: "/cybersecurity/intermediate",
        page: 2,
        totalPages: 4,
      }}
      activeLevelId="applied"
      headings={headings}
    >
      <div className="mb-4">
        <Link
          href="/cybersecurity"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Back to Cybersecurity overview
        </Link>
      </div>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/intermediate.mdx", { cyberSections });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
