import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import PageNav from "@/components/notes/PageNav";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import DiagramBlock from "@/components/DiagramBlock";
import { softwareArchitectureSectionManifest } from "@/lib/softwareArchitectureSections";

const ArchitectureBingoTool = dynamic(
  () => import("@/components/notes/tools/architecture/summary/ArchitectureBingoTool"),
  { ssr: false }
);
const StyleMatcherTool = dynamic(
  () => import("@/components/notes/tools/architecture/summary/StyleMatcherTool"),
  { ssr: false }
);
const FailureStoryExplorer = dynamic(
  () => import("@/components/notes/tools/architecture/summary/FailureStoryExplorer"),
  { ssr: false }
);
const SequenceDiagramPuzzleTool = dynamic(
  () => import("@/components/notes/tools/architecture/summary/SequenceDiagramPuzzleTool"),
  { ssr: false }
);
const TradeoffSliderTool = dynamic(
  () => import("@/components/notes/tools/architecture/summary/TradeoffSliderTool"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      PageNav,
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      SectionHeader,
      SubsectionHeader,
      BodyText,
      DiagramBlock,
      ArchitectureBingoTool,
      StyleMatcherTool,
      FailureStoryExplorer,
      SequenceDiagramPuzzleTool,
      TradeoffSliderTool,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Development and Architecture: Summary and games",
        description:
          "A relaxed recap of the key ideas in software development and architecture, with games, labs, and extra practice.",
        level: "Summary",
        slug: "/software-architecture/summary",
        section: "architecture",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Warm up</p>
            <p className="text-sm text-slate-800">Take a quick logic break in the Thinking Gym before the recap.</p>
          </div>
          <a className="button" href="/thinking-gym">
            Thinking Gym
          </a>
        </div>
      </div>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote(
    "software-architecture/summary.mdx",
    { softwareArchitectureSectionManifest },
    { contentRoot: "courses" }
  );
  return {
    props: {
      source,
      headings,
    },
  };
}
