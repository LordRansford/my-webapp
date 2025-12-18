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

const PlatformMap = dynamic(() => import("@/components/notes/tools/architecture/advanced/PlatformMap"), { ssr: false });
const ResilienceSimulator = dynamic(() => import("@/components/notes/tools/architecture/advanced/ResilienceSimulator"), { ssr: false });
const GovernanceDesigner = dynamic(() => import("@/components/notes/tools/architecture/advanced/GovernanceDesigner"), { ssr: false });
const DigitalisationDashboard = dynamic(() => import("@/components/notes/tools/architecture/advanced/DigitalisationDashboard"), { ssr: false });

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
      PlatformMap,
      ResilienceSimulator,
      GovernanceDesigner,
      DigitalisationDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes - Advanced",
        description: "Architecture at organisational scale, platforms, resilience, and governance.",
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
  const { source, headings } = await loadNote("software-architecture/advanced.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
