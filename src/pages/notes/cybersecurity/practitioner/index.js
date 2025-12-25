import { useMemo } from "react";
import dynamic from "next/dynamic";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      ProgressBar,
      PageNav,
      ToolCard,
      QuizBlock,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Practitioner track", description: "Role based map", level: "Practitioner" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/practitioner/index.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
