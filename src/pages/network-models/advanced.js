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
    }),
    []
  );

  return (
    <CourseLessonTemplate
      meta={{
        title: "Network Models for Security and Operations",
        description: "Security, monitoring, and operations thinking built on correct network foundations.",
        level: "Practice & Strategy",
        slug: "/network-models/advanced",
        page: 3,
        totalPages: 4,
      }}
      activeLevelId="practice"
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
  const note = await loadNote("network-models/advanced.mdx", { networkSectionManifest });
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}

