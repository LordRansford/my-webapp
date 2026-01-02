import dynamic from "next/dynamic";
import { useMemo } from "react";
import CourseLessonTemplate from "@/components/course/CourseLessonTemplate";
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
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
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
const SecureSdlcGatePlannerTool = dynamic(
  () => import("@/components/notes/tools/cybersecurity/advanced/SecureSdlcGatePlannerTool"),
  { ssr: false }
);
const VulnerabilityTriagePlannerTool = dynamic(
  () => import("@/components/notes/tools/cybersecurity/advanced/VulnerabilityTriagePlannerTool"),
  { ssr: false }
);
const OperationalSecurityPackTool = dynamic(
  () => import("@/components/notes/tools/cybersecurity/advanced/OperationalSecurityPackTool"),
  { ssr: false }
);

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
      SectionHeader,
      SubsectionHeader,
      BodyText,
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
      SecureSdlcGatePlannerTool,
      VulnerabilityTriagePlannerTool,
      OperationalSecurityPackTool,
    }),
    []
  );

  return (
    <CourseLessonTemplate
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
      courseHref="/cybersecurity"
      courseLabel="Cybersecurity"
      dashboardHref="/dashboards/cybersecurity"
      labsHref="/tools/cybersecurity"
      studiosHref="/cyber-studios"
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </CourseLessonTemplate>
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
