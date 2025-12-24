import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import PageNav from "@/components/notes/PageNav";
import QuizBlock from "@/components/notes/QuizBlock";
import DiagramBlock from "@/components/DiagramBlock";

export default function Page({ source, headings, meta }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      PageNav,
      QuizBlock,
      DiagramBlock,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: meta?.title || "BookTrack capstone journey",
        description: meta?.description || "An end to end journey that connects architecture, cybersecurity, digitalisation and AI.",
        level: "Capstone",
        slug: "/notes/capstone/booktrack",
        section: "capstone",
      }}
      headings={headings}
      showStepper={false}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings, meta } = await loadNote("capstone/booktrack.mdx");
  const safeMeta = {
    title: meta?.title || "",
    description: meta?.description || "",
  };
  return { props: { source, headings, meta: safeMeta } };
}


