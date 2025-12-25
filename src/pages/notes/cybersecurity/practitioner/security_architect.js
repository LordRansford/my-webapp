import { useMemo } from "react";
import dynamic from "next/dynamic";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import Callout from "@/components/notes/Callout";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";

const ControlSelectionTool = dynamic(() => import("@/components/notes/tools/cybersecurity/practitioner/ControlSelectionTool"), { ssr: false });
const EvidenceChecklistTool = dynamic(() => import("@/components/notes/tools/cybersecurity/practitioner/EvidenceChecklistTool"), { ssr: false });
const IncidentTimelineTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/IncidentTimelineTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      ProgressBar,
      PageNav,
      ToolCard,
      QuizBlock,
      ControlSelectionTool,
      EvidenceChecklistTool,
      IncidentTimelineTool,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Practitioner - Security Architect", description: "Role based notes", level: "Practitioner" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/practitioner/security_architect.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
