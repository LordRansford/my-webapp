import { useMemo } from "react";
import dynamic from "next/dynamic";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      ProgressBar,
      PageNav,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Practitioner track", description: "Role based map", level: "Practitioner" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/practitioner/index.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
