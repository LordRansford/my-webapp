import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type NodeType = "source" | "transform" | "filter" | "aggregate" | "destination";
type TransformType = "map" | "join" | "group" | "sort" | "deduplicate";

interface PipelineNode {
  id: string;
  name: string;
  type: NodeType;
  transformType?: TransformType;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

interface PipelineConnection {
  from: string;
  to: string;
}

function validatePipeline(nodes: PipelineNode[], connections: PipelineConnection[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (nodes.length === 0) {
    errors.push("Pipeline must contain at least one node");
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
    errors.push("Pipeline must have at least one source node");
  }
  if (destinationNodes.length === 0) {
    errors.push("Pipeline must have at least one destination node");
  }

  connections.forEach((conn, index) => {
    const fromNode = nodes.find((n) => n.id === conn.from);
    const toNode = nodes.find((n) => n.id === conn.to);

    if (!fromNode) {
      errors.push(`Connection ${index + 1} references non-existent source node: ${conn.from}`);
    }
    if (!toNode) {
      errors.push(`Connection ${index + 1} references non-existent destination node: ${conn.to}`);
    }

    if (fromNode && toNode && fromNode.type === "destination") {
      warnings.push(`Connection from "${fromNode.name}" (destination) may be invalid`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function buildPipelineGraph(nodes: PipelineNode[], connections: PipelineConnection[]): Record<string, any> {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      transformType: node.transformType,
      config: node.config,
      position: node.position,
    })),
    edges: connections.map((conn) => ({
      from: conn.from,
      to: conn.to,
    })),
  };
}

function generatePipelineConfig(pipelineName: string, nodes: PipelineNode[], connections: PipelineConnection[]): string {
  const config = {
    pipeline: {
      name: pipelineName,
      version: "1.0",
      generatedAt: new Date().toISOString(),
    },
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      transformType: node.transformType,
      config: node.config,
    })),
    connections: connections.map((conn) => ({
      from: conn.from,
      to: conn.to,
    })),
    execution: {
      estimatedStages: nodes.filter((n) => n.type === "transform" || n.type === "filter" || n.type === "aggregate").length + 1,
      sourceCount: nodes.filter((n) => n.type === "source").length,
      destinationCount: nodes.filter((n) => n.type === "destination").length,
    },
  };

  return JSON.stringify(config, null, 2);
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-pipelines",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const pipelineName = body.pipelineName || body.name || "Untitled Pipeline";
    const pipelineType = body.pipelineType || "ETL";
    const nodes: PipelineNode[] = body.nodes || body.stages || [];
    const connections: PipelineConnection[] = body.connections || [];

    const validation = validatePipeline(nodes, connections);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          pipeline: {
            name: pipelineName,
            type: pipelineType,
            nodes,
            connections,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 150,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const graph = buildPipelineGraph(nodes, connections);
    const config = generatePipelineConfig(pipelineName, nodes, connections);

    const summary = {
      totalNodes: nodes.length,
      totalConnections: connections.length,
      byType: nodes.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sourceNodes: nodes.filter((n) => n.type === "source").length,
      transformNodes: nodes.filter((n) => n.type === "transform" || n.type === "filter" || n.type === "aggregate").length,
      destinationNodes: nodes.filter((n) => n.type === "destination").length,
    };

    await new Promise((resolve) => setTimeout(resolve, 240));

    return {
      result: {
        success: true,
        pipeline: {
          name: pipelineName,
          type: pipelineType,
          nodes,
          connections,
          graph,
          config,
          summary,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-pipelines",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 150,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
