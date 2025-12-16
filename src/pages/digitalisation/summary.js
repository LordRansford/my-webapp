import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/learn/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";

const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });
const DigiConceptMatchGame = dynamic(() => import("@/components/games/digitalisation/DigiConceptMatchGame"), { ssr: false });
const ValueChainBuilderGame = dynamic(() => import("@/components/games/digitalisation/ValueChainBuilderGame"), { ssr: false });
const OperatingModelDesignerGame = dynamic(() => import("@/components/games/digitalisation/OperatingModelDesignerGame"), { ssr: false });
const MaturityPathGame = dynamic(() => import("@/components/games/digitalisation/MaturityPathGame"), { ssr: false });
const DigiQuickFireQuizGame = dynamic(() => import("@/components/games/digitalisation/DigiQuickFireQuizGame"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      PageNav,
      DigitalisationDashboard,
      DigiConceptMatchGame,
      ValueChainBuilderGame,
      OperatingModelDesignerGame,
      MaturityPathGame,
      DigiQuickFireQuizGame,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Strategy Notes - Summary",
        description: "Consolidation of digitalisation strategy with interactive games, dashboards, and reflection.",
        level: "Summary",
        slug: "/digitalisation/summary",
        section: "digitalisation",
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
  const { source, headings } = await loadNote("digitalisation/summary.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
