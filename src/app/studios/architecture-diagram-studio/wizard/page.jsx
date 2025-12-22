import WizardPageClient from "./page.client";

export const metadata = {
  title: "Architecture Diagram Studio Wizard",
  description: "Guided wizard for capturing architecture inputs. Diagram generation comes next.",
};

export default function ArchitectureDiagramWizardPage() {
  return <WizardPageClient />;
}
