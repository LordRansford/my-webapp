import dynamic from "next/dynamic";
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
import Recap from "@/components/notes/Recap";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";

const TrustGraphTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/TrustGraphTool"), { ssr: false });
const ProtocolAssumptionsTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/ProtocolAssumptionsTool"), { ssr: false });
const CertificateChainTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/CertificateChainTool"), { ssr: false });
const ZeroTrustPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/ZeroTrustPlannerTool"), { ssr: false });
const DetectionCoverageTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/DetectionCoverageTool"), { ssr: false });
const SupplyChainRiskTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/SupplyChainRiskTool"), { ssr: false });
const IncidentTimelineTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/IncidentTimelineTool"), { ssr: false });
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
      PageNav,
      TrustGraphTool,
      ProtocolAssumptionsTool,
      CertificateChainTool,
      ZeroTrustPlannerTool,
      DetectionCoverageTool,
      SupplyChainRiskTool,
      IncidentTimelineTool,
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
        title: "Cybersecurity Notes - Advanced",
        description: "Advanced systems, adversaries, and resilience",
        level: "Advanced",
        slug: "/cybersecurity/advanced",
        page: 3,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/advanced.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
