import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";

export default function Page({ source, headings, meta }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      PageNav,
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

export async function getStaticProps() {
  const { source, headings, meta } = await loadNote("capstone/gridlens.mdx");
  return { props: { source, headings, meta } };
}


