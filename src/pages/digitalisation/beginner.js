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

const DigitalMaturityGauge = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/DigitalMaturityGauge"), { ssr: false });
const DataValueChain = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/DataValueChain"), { ssr: false });
const ChangeImpactSimulator = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/ChangeImpactSimulator"), { ssr: false });
const StrategyRoadmapCanvas = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/StrategyRoadmapCanvas"), { ssr: false });
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
      DigitalMaturityGauge,
      DataValueChain,
      ChangeImpactSimulator,
      StrategyRoadmapCanvas,
      DigitalisationDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes - Beginner",
        description: "Foundations of digitalisation, why it matters, and how data, people, process, and technology fit together.",
        level: "Beginner",
        slug: "/digitalisation/beginner",
        section: "digitalisation",
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
  const { source, headings } = await loadNote("digitalisation/beginner.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
