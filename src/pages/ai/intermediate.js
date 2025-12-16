import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";

const ConfusionMatrixExplorer = dynamic(() => import("@/components/notes/tools/ai/intermediate/ConfusionMatrixExplorer"), { ssr: false });
const LeakageDetectionGame = dynamic(() => import("@/components/notes/tools/ai/intermediate/LeakageDetectionGame"), { ssr: false });
const EmbeddingSpaceExplorer = dynamic(() => import("@/components/notes/tools/ai/intermediate/EmbeddingSpaceExplorer"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      PageNav,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      ConfusionMatrixExplorer,
      LeakageDetectionGame,
      EmbeddingSpaceExplorer,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Notes - Intermediate",
        description: "How real AI systems behave, fail, and are evaluated between beginner and advanced depth.",
        level: "Intermediate",
        slug: "/ai/intermediate",
        section: "ai",
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
  const { source, headings } = await loadNote("ai/intermediate.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
