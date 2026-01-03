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
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import DiagramBlock from "@/components/DiagramBlock";
import { networkSectionManifest } from "@/lib/networkSections";

const TcpHandshakeTimelineTool = dynamic(() => import("@/components/notes/tools/network-models/applied/TcpHandshakeTimelineTool"), { ssr: false });

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
      SectionHeader,
      SubsectionHeader,
      BodyText,
      DiagramBlock,
      TcpHandshakeTimelineTool,
    }),
    []
  );

  return (
    <CourseLessonTemplate
      meta={{
        title: "Applied OSI and TCP IP",
        description: "TCP, UDP, routing, NAT, and TLS, with realistic troubleshooting.",
        level: "Applied",
        slug: "/network-models/intermediate",
        page: 2,
        totalPages: 4,
      }}
      activeLevelId="applied"
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
  const note = await loadNote("network-models/intermediate.mdx", { networkSectionManifest });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}

