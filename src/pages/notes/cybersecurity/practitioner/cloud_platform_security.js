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

const ZeroTrustPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/ZeroTrustPlannerTool"), { ssr: false });
const SupplyChainRiskTool = dynamic(() => import("@/components/notes/tools/cybersecurity/advanced/SupplyChainRiskTool"), { ssr: false });
const EvidenceChecklistTool = dynamic(() => import("@/components/notes/tools/cybersecurity/practitioner/EvidenceChecklistTool"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      Callout,
      ProgressBar,
      PageNav,
      ToolCard,
      QuizBlock,
      ZeroTrustPlannerTool,
      SupplyChainRiskTool,
      EvidenceChecklistTool,
    }),
    []
  );

  return (
    <NotesLayout meta={{ title: "Practitioner - Cloud and Platform Security", description: "Role based notes", level: "Practitioner" }} headings={headings}>
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/practitioner/cloud_platform_security.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
