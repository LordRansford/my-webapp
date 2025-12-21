import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";

export default function Page({ source, headings }) {
  return (
    <NotesLayout meta={{ title: "Progression map", description: "How I move from beginner to expert", level: "Roadmap" }} headings={headings}>
      <MDXRenderer source={source} components={{ Callout, ToolCard, QuizBlock }} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("roadmap.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
