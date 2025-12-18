import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import PageNav from "@/components/notes/PageNav";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import DiagramBlock from "@/components/DiagramBlock";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";

const DigitalMaturityGauge = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/DigitalMaturityGauge"), { ssr: false });
const DataValueChain = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/DataValueChain"), { ssr: false });
const ChangeImpactSimulator = dynamic(() => import("@/components/notes/tools/digitalisation/beginner/ChangeImpactSimulator"), { ssr: false });
const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      PageNav,
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      DiagramBlock,
      DigitalMaturityGauge,
      DataValueChain,
      ChangeImpactSimulator,
      DigitalisationDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Foundations",
        description: "A practical introduction to data, platforms and journeys in a digital energy world.",
        level: "Foundations",
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
  const { source, headings } = await loadNote("digitalisation/foundations.mdx", { digitalisationSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
