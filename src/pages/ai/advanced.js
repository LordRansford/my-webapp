import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import CPDTracker from "@/components/CPDTracker";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import DiagramBlock from "@/components/DiagramBlock";
import { aiSectionManifest } from "@/lib/aiSections";

const TokenContextLab = dynamic(
  () => import("@/components/notes/tools/ai/advanced/TokenContextLab"),
  { ssr: false }
);
const MiniDiffusionLab = dynamic(
  () => import("@/components/notes/tools/ai/advanced/MiniDiffusionLab"),
  { ssr: false }
);
const AgentFlowBuilder = dynamic(
  () => import("@/components/notes/tools/ai/advanced/AgentFlowBuilder"),
  { ssr: false }
);
const GovernanceChecklistLab = dynamic(
  () => import("@/components/notes/tools/ai/advanced/GovernanceChecklistLab"),
  { ssr: false }
);

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      PageNav,
      GlossaryTip,
      QuizBlock,
      CPDTracker,
      LevelProgressBar,
      SectionProgressToggle,
      DiagramBlock,
      TokenContextLab,
      MiniDiffusionLab,
      AgentFlowBuilder,
      GovernanceChecklistLab,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "AI Advanced",
        description: "We dive into transformers, agents, generative models and the reality of running AI safely.",
        level: "Advanced",
        slug: "/ai/advanced",
        section: "ai",
        page: 3,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("ai/advanced.mdx", { aiSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
