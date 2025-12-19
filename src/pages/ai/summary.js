import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import QuizBlock from "@/components/notes/QuizBlock";
import PageNav from "@/components/notes/PageNav";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import DiagramBlock from "@/components/DiagramBlock";
import { aiSectionManifest } from "@/lib/aiSections";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";

const ConceptMatchGame = dynamic(() => import("@/components/notes/tools/ai/summary/ConceptMatchGame"), { ssr: false });
const OddOneOutGame = dynamic(() => import("@/components/notes/tools/ai/summary/OddOneOutGame"), { ssr: false });
const ScenarioClinicGame = dynamic(() => import("@/components/notes/tools/ai/summary/ScenarioClinicGame"), { ssr: false });
const MiniProjectDesigner = dynamic(() => import("@/components/notes/tools/ai/summary/MiniProjectDesigner"), { ssr: false });
const BuildYourOwnQuiz = dynamic(() => import("@/components/notes/tools/ai/summary/BuildYourOwnQuiz"), { ssr: false });

export default function AISummary({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      QuizBlock,
      PageNav,
      LevelProgressBar,
      CPDTracker,
      DiagramBlock,
      SectionProgressToggle,
      ConceptMatchGame,
      OddOneOutGame,
      ScenarioClinicGame,
      MiniProjectDesigner,
      BuildYourOwnQuiz,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Summary and games",
        description: "A recap of the whole AI track with games, scenarios and labs to see what you really remember.",
        level: "Summary",
        slug: "/ai/summary",
        section: "ai",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("ai/summary.mdx", { aiSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
