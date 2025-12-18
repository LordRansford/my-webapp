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
import { softwareArchitectureSectionManifest } from "@/lib/softwareArchitectureSections";

const ArchitectureStyleExplorer = dynamic(() => import("@/components/notes/tools/architecture/intermediate/ArchitectureStyleExplorer"), { ssr: false });
const IntegrationFlowLab = dynamic(() => import("@/components/notes/tools/architecture/intermediate/IntegrationFlowLab"), { ssr: false });
const QualityTradeoffExplorer = dynamic(() => import("@/components/notes/tools/architecture/intermediate/QualityTradeoffExplorer"), { ssr: false });
const ConsistencySimulator = dynamic(() => import("@/components/notes/tools/architecture/intermediate/ConsistencySimulator"), { ssr: false });

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
      ArchitectureStyleExplorer,
      IntegrationFlowLab,
      QualityTradeoffExplorer,
      ConsistencySimulator,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Development and Architecture Intermediate",
        description: "We move from simple boxes and arrows to real world architecture styles, integration patterns and trade offs.",
        level: "Intermediate",
        slug: "/software-architecture/intermediate",
        section: "architecture",
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
  const { source, headings } = await loadNote(
    "software-architecture/intermediate.mdx",
    { softwareArchitectureSectionManifest },
    { contentRoot: "courses" }
  );
  return {
    props: {
      source,
      headings,
    },
  };
}
