import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";

const StrategyRoadmapCanvas = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/StrategyRoadmapCanvas"), { ssr: false });
const OperatingModelLab = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/OperatingModelLab"), { ssr: false });
const CapabilityMapper = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/CapabilityMapper"), { ssr: false });
const PortfolioPrioritiser = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/PortfolioPrioritiser"), { ssr: false });
const PolicyImpactSimulator = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/PolicyImpactSimulator"), { ssr: false });
const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      PageNav,
      StrategyRoadmapCanvas,
      OperatingModelLab,
      CapabilityMapper,
      PortfolioPrioritiser,
      PolicyImpactSimulator,
      DigitalisationDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes - Intermediate",
        description: "Designing and executing digitalisation strategy, from vision and operating models to platforms, governance, and roadmaps.",
        level: "Intermediate",
        slug: "/digitalisation/intermediate",
        section: "digitalisation",
        page: 2,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("digitalisation/intermediate.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
