import dynamic from "next/dynamic";

export const metadata = {
  title: "Architecture Diagram Studio Editor",
  description: "Direct input editor for architecture diagrams. Validated locally, no data leaves your browser.",
};

const EditorClient = dynamic(() => import("./page.client"));

export default function ArchitectureDiagramEditorPage() {
  return <EditorClient />;
}


