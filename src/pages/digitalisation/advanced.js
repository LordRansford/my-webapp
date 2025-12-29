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
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";

const TargetStateCanvasTool = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/TargetStateCanvasTool"), { ssr: false });
const EcosystemMapperTool = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/EcosystemMapperTool"), { ssr: false });
const RiskRoadmapPlannerTool = dynamic(() => import("@/components/notes/tools/digitalisation/advanced/RiskRoadmapPlannerTool"), { ssr: false });
const SchemaMappingSandbox = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/SchemaMappingSandbox"), { ssr: false });

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
      TargetStateCanvasTool,
      EcosystemMapperTool,
      RiskRoadmapPlannerTool,
      SchemaMappingSandbox,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Advanced",
        description: "We zoom out to strategy, governance and whole energy system data sharing, with lots of real world examples.",
        level: "Advanced",
        slug: "/digitalisation/advanced",
        section: "digitalisation",
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
  const { source, headings } = await loadNote("digitalisation/advanced.mdx", { digitalisationSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
