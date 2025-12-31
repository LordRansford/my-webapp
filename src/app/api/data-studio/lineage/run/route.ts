import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type DataNodeType = "source" | "transform" | "destination";
type TransformType = "filter" | "aggregate" | "join" | "enrich" | "validate";

interface DataNode {
  id: string;
  name: string;
  type: DataNodeType;
  transformType?: TransformType;
  description: string;
  location: string;
}

interface DataFlow {
  from: string;
  to: string;
  transformation?: string;
}

function validateLineage(nodes: DataNode[], flows: DataFlow[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (nodes.length === 0) {
    errors.push("Lineage must contain at least one data node");
  }

  const nodeIds = new Set<string>();
  nodes.forEach((node, index) => {
    if (!node.name || node.name.trim() === "") {
      errors.push(`Node ${index + 1} must have a name`);
    } else if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    } else {
      nodeIds.add(node.id);
    }

    if (node.type === "transform" && !node.transformType) {
      warnings.push(`Transform node "${node.name}" should specify a transform type`);
    }
  });

  const sourceNodes = nodes.filter((n) => n.type === "source");
  const destinationNodes = nodes.filter((n) => n.type === "destination");

  if (sourceNodes.length === 0) {
    warnings.push("No source nodes defined");
  }
  if (destinationNodes.length === 0) {
    warnings.push("No destination nodes defined");
  }

  flows.forEach((flow, index) => {
    const fromNode = nodes.find((n) => n.id === flow.from);
    const toNode = nodes.find((n) => n.id === flow.to);

    if (!fromNode) {
      errors.push(`Flow ${index + 1} references non-existent source node: ${flow.from}`);
    }
    if (!toNode) {
      errors.push(`Flow ${index + 1} references non-existent destination node: ${flow.to}`);
    }

    if (fromNode && toNode && fromNode.type === "destination") {
      warnings.push(`Flow from "${fromNode.name}" (destination) to "${toNode.name}" may be invalid`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function buildLineageGraph(nodes: DataNode[], flows: DataFlow[]): Record<string, any> {
  const graph: Record<string, any> = {
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      transformType: node.transformType,
      description: node.description,
      location: node.location,
    })),
    edges: flows.map((flow) => ({
      from: flow.from,
      to: flow.to,
      transformation: flow.transformation,
    })),
  };

  return graph;
}

function generateLineageReport(lineageName: string, nodes: DataNode[], flows: DataFlow[]): string {
  let report = `DATA LINEAGE REPORT\n`;
  report += `===================\n\n`;
  report += `Lineage Name: ${lineageName}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  report += `SUMMARY\n`;
  report += `-------\n`;
  report += `Total Nodes: ${nodes.length}\n`;
  report += `Total Flows: ${flows.length}\n\n`;

  const byType = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  report += `Nodes by Type:\n`;
  Object.entries(byType).forEach(([type, count]) => {
    report += `  ${type}: ${count}\n`;
  });

  report += `\n\nNODES\n`;
  report += `=====\n\n`;

  const typeOrder: DataNodeType[] = ["source", "transform", "destination"];
  typeOrder.forEach((type) => {
    const typeNodes = nodes.filter((n) => n.type === type);
    if (typeNodes.length > 0) {
      report += `${type.toUpperCase()} NODES\n`;
      report += `${"-".repeat(type.length + 6)}\n\n`;

      typeNodes.forEach((node) => {
        report += `${node.name}\n`;
        report += `  ID: ${node.id}\n`;
        report += `  Location: ${node.location || "Not specified"}\n`;
        if (node.transformType) {
          report += `  Transform Type: ${node.transformType}\n`;
        }
        if (node.description) {
          report += `  Description: ${node.description}\n`;
        }
        report += `\n`;
      });
    }
  });

  report += `\nDATA FLOWS\n`;
  report += `==========\n\n`;

  flows.forEach((flow, index) => {
    const fromNode = nodes.find((n) => n.id === flow.from);
    const toNode = nodes.find((n) => n.id === flow.to);
    report += `${index + 1}. ${fromNode?.name || flow.from} → ${toNode?.name || flow.to}\n`;
    if (flow.transformation) {
      report += `   Transformation: ${flow.transformation}\n`;
    }
    report += `\n`;
  });

  report += `\n--- END OF REPORT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-lineage",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const lineageName = body.lineageName || body.name || "Untitled Lineage";
    const nodes: DataNode[] = body.nodes || [];
    const flows: DataFlow[] = body.flows || [];

    const validation = validateLineage(nodes, flows);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          lineage: {
            name: lineageName,
            nodes,
            flows,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 160,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const graph = buildLineageGraph(nodes, flows);
    const report = generateLineageReport(lineageName, nodes, flows);

    await new Promise((resolve) => setTimeout(resolve, 280));

    return {
      result: {
        success: true,
        lineage: {
          name: lineageName,
          nodes,
          flows,
          graph,
          report,
          summary: {
            totalNodes: nodes.length,
            totalFlows: flows.length,
            sourceNodes: nodes.filter((n) => n.type === "source").length,
            transformNodes: nodes.filter((n) => n.type === "transform").length,
            destinationNodes: nodes.filter((n) => n.type === "destination").length,
          },
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-lineage",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 160,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
