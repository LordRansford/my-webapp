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

const ArchitectureCanvas = dynamic(() => import("@/components/notes/tools/architecture/beginner/ArchitectureCanvas"), { ssr: false });
const BoundaryMapper = dynamic(() => import("@/components/notes/tools/architecture/beginner/BoundaryMapper"), { ssr: false });
const TradeoffExplorer = dynamic(() => import("@/components/notes/tools/architecture/beginner/TradeoffExplorer"), { ssr: false });
const SystemDashboard = dynamic(() => import("@/components/notes/tools/architecture/beginner/SystemDashboard"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      PageNav,
      ArchitectureCanvas,
      BoundaryMapper,
      TradeoffExplorer,
      SystemDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes - Beginner",
        description: "Foundations of software architecture, structure, boundaries, and decision making.",
        level: "Beginner",
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
  const { source, headings } = await loadNote("software-architecture/beginner.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
