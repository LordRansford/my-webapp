import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import { dataSectionManifest } from "@/lib/dataSections";

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      PageNav,
      ToolCard,
      QuizBlock,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Data Summary and games",
        description: "Recap, scenarios, and playful practice for the data course.",
        level: "Summary",
        slug: "/data/summary",
        section: "data",
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
  const { source, headings } = await loadNote(
    "data/summary.mdx",
    { dataSectionManifest },
    { contentRoot: "courses" }
  );
  return {
    props: {
      source,
      headings,
    },
  };
}
