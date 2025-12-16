import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";
import { MathInline, MathBlock } from "@/components/notes/Math";

const TrustGraphTool = dynamic(() => import("@/components/notes/tools/ai/advanced/TrustGraphTool"), { ssr: false });
const ProtocolAssumptionsTool = dynamic(() => import("@/components/notes/tools/ai/advanced/ProtocolAssumptionsTool"), { ssr: false });
const CertificateChainTool = dynamic(() => import("@/components/notes/tools/ai/advanced/CertificateChainTool"), { ssr: false });
const ZeroTrustPlannerTool = dynamic(() => import("@/components/notes/tools/ai/advanced/ZeroTrustPlannerTool"), { ssr: false });
const DetectionCoverageTool = dynamic(() => import("@/components/notes/tools/ai/advanced/DetectionCoverageTool"), { ssr: false });
const SupplyChainRiskTool = dynamic(() => import("@/components/notes/tools/ai/advanced/SupplyChainRiskTool"), { ssr: false });
const IncidentTimelineTool = dynamic(() => import("@/components/notes/tools/ai/advanced/IncidentTimelineTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      PageNav,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      MathInline,
      MathBlock,
      TrustGraphTool,
      ProtocolAssumptionsTool,
      CertificateChainTool,
      ZeroTrustPlannerTool,
      DetectionCoverageTool,
      SupplyChainRiskTool,
      IncidentTimelineTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Notes - Advanced",
        description: "Systems-level AI thinking: architecture, risk, governance, and operating at scale.",
        level: "Advanced",
        slug: "/ai/advanced",
        section: "ai",
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
  const { source, headings } = await loadNote("ai/advanced.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
