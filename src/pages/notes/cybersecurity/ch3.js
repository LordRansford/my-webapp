import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import Recap from "@/components/notes/Recap";

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      ProgressBar,
      PageNav,
      ToolCard,
      QuizBlock,
      Recap,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Chapter 3",
        description: "Building secure systems that survive real attackers",
        level: "Advanced",
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/ch3.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
