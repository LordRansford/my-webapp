import dynamic from "next/dynamic";
import { useMemo } from "react";
import CourseLessonTemplate from "@/components/course/CourseLessonTemplate";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/notes/ToolCard";
import Callout from "@/components/notes/Callout";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import GlossaryTip from "@/components/notes/GlossaryTip";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import CPDAssessmentPromo from "@/components/course/CPDAssessmentPromo";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import DiagramBlock from "@/components/DiagramBlock";
import MermaidDiagram from "@/components/notes/MermaidDiagram";
import { networkSectionManifest } from "@/lib/networkSections";

const EncapsulationLab = dynamic(() => import("@/components/notes/tools/network-models/overview/EncapsulationLab"), { ssr: false });
const OsiTcpIpMapperTool = dynamic(() => import("@/components/notes/tools/network-models/foundations/OsiTcpIpMapperTool"), { ssr: false });
const SubnettingLab = dynamic(() => import("@/components/notes/tools/network-models/foundations/SubnettingLab"), { ssr: false });
const PortProtocolExplorerTool = dynamic(() => import("@/components/notes/tools/network-models/foundations/PortProtocolExplorerTool"), { ssr: false });
const PduStackBuilderTool = dynamic(() => import("@/components/notes/tools/network-models/foundations/PduStackBuilderTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      QuizBlock,
      ProgressBar,
      PageNav,
      GlossaryTip,
      SectionProgressToggle,
      LevelProgressBar,
      CPDTracker,
      CPDAssessmentPromo,
      SectionHeader,
      SubsectionHeader,
      BodyText,
      DiagramBlock,
      MermaidDiagram,
      EncapsulationLab,
      OsiTcpIpMapperTool,
      SubnettingLab,
      PortProtocolExplorerTool,
      PduStackBuilderTool,
    }),
    []
  );

  return (
    <CourseLessonTemplate
      meta={{
        title: "OSI and TCP IP Foundations",
        description: "Encapsulation, addressing, and layer models, explained with exact terms and safe labs.",
        level: "Foundations",
        slug: "/network-models/beginner",
        page: 1,
        totalPages: 4,
      }}
      activeLevelId="foundations"
      headings={headings}
      courseHref="/network-models"
      courseLabel="Network Models"
      dashboardHref="/dashboards/cybersecurity"
      labsHref="/tools"
      studiosHref="/studios"
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </CourseLessonTemplate>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("network-models/foundations.mdx", { networkSectionManifest });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}

