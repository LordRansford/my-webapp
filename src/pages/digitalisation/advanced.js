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
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";

const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });
const EcosystemMapper = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/EcosystemMapper"), { ssr: false });
const RegulationExplorer = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/RegulationExplorer"), { ssr: false });
const RiskHeatmap = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/RiskHeatmap"), { ssr: false });
const FundingModelLab = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/FundingModelLab"), { ssr: false });
const ScenarioSimulator = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/ScenarioSimulator"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      PageNav,
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      DigitalisationDashboard,
      EcosystemMapper,
      RegulationExplorer,
      RiskHeatmap,
      FundingModelLab,
      ScenarioSimulator,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes - Advanced",
        description: "Digitalisation at scale across ecosystems, regulation, risk, funding, and long-term stewardship.",
        level: "Advanced",
        slug: "/digitalisation/advanced",
        section: "digitalisation",
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
  const { source, headings } = await loadNote("digitalisation/advanced.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
