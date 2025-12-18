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

const ArchitectureCanvas = dynamic(() => import("@/components/notes/tools/architecture/beginner/ArchitectureCanvas"), { ssr: false });
const RoleMapTool = dynamic(() => import("@/components/notes/tools/architecture/beginner/RoleMapTool"), { ssr: false });
const DesignKataTool = dynamic(() => import("@/components/notes/tools/architecture/beginner/DesignKataTool"), { ssr: false });
const DeploySafetySandbox = dynamic(() => import("@/components/notes/tools/architecture/beginner/DeploySafetySandbox"), { ssr: false });

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
      ArchitectureCanvas,
      RoleMapTool,
      DesignKataTool,
      DeploySafetySandbox,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Development and Architecture Foundations",
        description: "A practical tour of how we design and build software that is simple, secure and kind to future you.",
        level: "Foundations",
        slug: "/software-architecture/beginner",
        section: "architecture",
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
  const { source, headings } = await loadNote(
    "software-architecture/foundations.mdx",
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
