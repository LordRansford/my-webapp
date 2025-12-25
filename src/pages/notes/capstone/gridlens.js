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
        title: meta?.title || "GridLens capstone journey",
        description: meta?.description || "An end to end journey that connects architecture, CIM network data, cybersecurity, digitalisation and AI.",
        level: "Capstone",
        slug: "/notes/capstone/gridlens",
        section: "capstone",
      }}
      headings={headings}
      showStepper={false}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const { source, headings, meta } = await loadNote("capstone/gridlens.mdx");
  // Avoid Next.js serialization errors: omit undefined values.
  const safeMeta = {
    title: meta?.title || "",
    description: meta?.description || "",
  };
  return { props: { source, headings, meta: safeMeta } };
}


