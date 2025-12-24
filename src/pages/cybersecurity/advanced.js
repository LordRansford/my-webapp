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
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import Recap from "@/components/notes/Recap";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import DiagramBlock from "@/components/DiagramBlock";
import CPDTracker from "@/components/CPDTracker";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import { cyberSections } from "@/lib/cyberSections";

const TrustGraphTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/TrustGraphTool"), { ssr: false });
const ProtocolAssumptionsTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/ProtocolAssumptionsTool"), { ssr: false });
const CertificateChainTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/CertificateChainTool"), { ssr: false });
const ZeroTrustPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/ZeroTrustPlannerTool"), { ssr: false });
const DetectionCoverageTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/DetectionCoverageTool"), { ssr: false });
const SupplyChainRiskTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/SupplyChainRiskTool"), { ssr: false });
const IncidentTimelineTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/IncidentTimelineTool"), { ssr: false });
const FrameworkMappingTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/FrameworkMappingTool"), { ssr: false });
const SecurityCareerPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/SecurityCareerPlannerTool"), { ssr: false });
const Quiz = dynamic(() => import("@/components/Quiz"), { ssr: false });
const AdvancedCryptoPlayground = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/AdvancedCryptoPlayground"), { ssr: false });
const PkiChainVisualizer = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/PkiChainVisualizer"), { ssr: false });
const ProtocolFlowExplorer = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/ProtocolFlowExplorer"), { ssr: false });
const TokenSecurityLab = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/TokenSecurityLab"), { ssr: false });
const SecureDesignTradeoffLab = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/SecureDesignTradeoffLab"), { ssr: false });
const DetectionRuleTuner = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/DetectionRuleTuner"), { ssr: false });
const AdvancedQuizBoard = dynamic(() => import("@/components/dashboards/cybersecurity/advanced/AdvancedQuizBoard"), { ssr: false });

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
      ProgressBar,
      DiagramBlock,
      PageNav,
      CPDTracker,
      LevelProgressBar,
      SectionProgressToggle,
      TrustGraphTool,
      ProtocolAssumptionsTool,
      CertificateChainTool,
      ZeroTrustPlannerTool,
      DetectionCoverageTool,
      SupplyChainRiskTool,
      IncidentTimelineTool,
      FrameworkMappingTool,
      SecurityCareerPlannerTool,
      Quiz,
      AdvancedCryptoPlayground,
      PkiChainVisualizer,
      ProtocolFlowExplorer,
      TokenSecurityLab,
      SecureDesignTradeoffLab,
      DetectionRuleTuner,
      AdvancedQuizBoard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity Practice and Strategy",
        description: "Advanced systems, adversaries, and resilience",
        level: "Practice & Strategy",
        slug: "/cybersecurity/advanced",
        page: 3,
        totalPages: 4,
      }}
      activeLevelId="practice"
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

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/advanced.mdx", { cyberSections });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
