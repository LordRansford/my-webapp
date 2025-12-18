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

const DomainContextMapperTool = dynamic(() => import("@/components/notes/tools/architecture/advanced/DomainContextMapperTool"), { ssr: false });
const CqrsEventLab = dynamic(() => import("@/components/notes/tools/architecture/advanced/CqrsEventLab"), { ssr: false });
const ResilienceLatencySimulator = dynamic(() => import("@/components/notes/tools/architecture/advanced/ResilienceLatencySimulator"), { ssr: false });
const AdrWorkbench = dynamic(() => import("@/components/notes/tools/architecture/advanced/AdrWorkbench"), { ssr: false });

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
      DomainContextMapperTool,
      CqrsEventLab,
      ResilienceLatencySimulator,
      AdrWorkbench,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Development and Architecture Advanced",
        description: "We move into big system thinking, advanced patterns and how to keep complex software fast, safe and changeable over time.",
        level: "Advanced",
        slug: "/software-architecture/advanced",
        section: "architecture",
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
  const { source, headings } = await loadNote(
    "software-architecture/advanced.mdx",
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
