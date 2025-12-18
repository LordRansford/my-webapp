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
import DiagramBlock from "@/components/DiagramBlock";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";

const DataFlowMapperLab = dynamic(() => import("@/components/tools/digitalisation/DataFlowMapperLab").then((mod) => mod.DataFlowMapperLab), { ssr: false });
const ApiContractExplorer = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/ApiContractExplorer"), { ssr: false });
const SchemaMappingSandbox = dynamic(() => import("@/components/notes/tools/digitalisation/intermediate/SchemaMappingSandbox"), { ssr: false });
const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });

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
      DiagramBlock,
      DataFlowMapperLab,
      ApiContractExplorer,
      SchemaMappingSandbox,
      DigitalisationDashboard,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Digitalisation Intermediate",
        description: "We go deeper into data models, APIs, platforms and real energy data flows.",
        level: "Intermediate",
        slug: "/digitalisation/intermediate",
        section: "digitalisation",
        page: 2,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("digitalisation/intermediate.mdx", { digitalisationSectionManifest }, { contentRoot: "courses" });
  return {
    props: {
      source,
      headings,
    },
  };
}
