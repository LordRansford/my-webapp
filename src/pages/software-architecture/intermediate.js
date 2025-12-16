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
const StyleSelector = dynamic(() => import("@/components/notes/tools/architecture/intermediate/StyleSelector"), { ssr: false });
const DecompositionLab = dynamic(() => import("@/components/notes/tools/architecture/intermediate/DecompositionLab"), { ssr: false });
const DecisionRecordBuilder = dynamic(() => import("@/components/notes/tools/architecture/intermediate/DecisionRecordBuilder"), { ssr: false });

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
      StyleSelector,
      DecompositionLab,
      DecisionRecordBuilder,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes - Intermediate",
        description: "Designing real systems with styles, decomposition, quality-driven choices, and decision records.",
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
  const { source, headings } = await loadNote("software-architecture/intermediate.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
