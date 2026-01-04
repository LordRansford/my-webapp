import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";
import ProgressBar from "@/components/notes/ProgressBar";
import { networkSectionManifest } from "@/lib/networkSections";

export default function NetworkModelsSummaryPage({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      QuizBlock,
      Callout,
      PageNav,
      ProgressBar,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Network models summary",
        description: "A tight recap of OSI and TCP IP with a practice checklist.",
        level: "Summary",
        slug: "/network-models/summary",
        section: "network-models",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("network-models/summary.mdx", { networkSectionManifest });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}

