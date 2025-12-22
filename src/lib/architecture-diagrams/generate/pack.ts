import type { ArchitectureDiagramInput } from "../schema";
import type { DiagramPack, DiagramVariant } from "../types";
import { VARIANTS } from "./variants";
import { generateContextDiagram } from "./context";
import { generateContainerDiagram } from "./container";
import { generateDeploymentDiagram } from "./deployment";
import { generateDfdDiagram } from "./dfd";
import { generateSequenceDiagram } from "./sequence";

export function generateDiagramPack(input: ArchitectureDiagramInput): DiagramPack {
  const variants: DiagramVariant[] = VARIANTS.map((variant) => {
    const a1 = generateContextDiagram(input, variant);
    const a2 = generateContainerDiagram(input, variant);
    const a3 = generateDeploymentDiagram(input, variant);
    const a4 = generateDfdDiagram(input, variant);
    const a5 = generateSequenceDiagram(input, variant);

    const assumptions = [
      ...a1.assumptions,
      ...a2.assumptions,
      ...a3.assumptions,
      ...a4.assumptions,
      ...a5.assumptions,
    ];
    const omissions = [
      ...a1.omissions,
      ...a2.omissions,
      ...a3.omissions,
      ...a4.omissions,
      ...a5.omissions,
    ];

    return {
      id: variant.id,
      label: variant.label,
      diagrams: {
        context: a1.mermaid,
        container: a2.mermaid,
        deployment: a3.mermaid,
        dfd: a4.mermaid,
        sequence: a5.mermaid,
      },
      assumptions: Array.from(new Set(assumptions)),
      omissions: Array.from(new Set(omissions)),
    };
  });

  return { input, variants };
}


