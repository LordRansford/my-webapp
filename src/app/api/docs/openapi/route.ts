/**
 * OpenAPI Documentation Endpoint
 * 
 * Generates OpenAPI 3.0 specification for all tool execution APIs
 * to enable API documentation, client generation, and testing.
 */

import { NextResponse } from "next/server";
import { getToolDefinition, getToolsByCategory } from "@/lib/tools/registry";

export async function GET() {
  try {
    // Get all tools from all categories
    const allCategories = ["dev-studio", "cyber-studio", "data-studio", "ai-studio"];
    const tools = allCategories.flatMap(category => getToolsByCategory(category));
    const paths: Record<string, any> = {};
    const schemas: Record<string, any> = {};

    // Generate paths for each tool
    for (const tool of tools) {
      if (tool.executionMode === "client_only") continue;

      const path = `/api/${tool.toolId}/run`;
      
      // Generate request schema from tool definition
      const requestSchema = generateRequestSchema(tool);
      const responseSchema = generateResponseSchema();

      paths[path] = {
        post: {
          summary: tool.title || tool.toolId,
          description: tool.description || `Execute ${tool.toolId} tool`,
          operationId: `execute_${tool.toolId.replace(/-/g, "_")}`,
          tags: [tool.category || "tools"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: requestSchema,
              },
            },
          },
          responses: {
            "200": {
              description: "Tool execution successful",
              content: {
                "application/json": {
                  schema: responseSchema,
                },
              },
            },
            "400": {
              description: "Invalid request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      code: { type: "string" },
                      requestId: { type: "string" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                    },
                  },
                },
              },
            },
            "402": {
              description: "Insufficient credits",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      code: { type: "string" },
                      balance: { type: "number" },
                      required: { type: "number" },
                    },
                  },
                },
              },
            },
            "429": {
              description: "Rate limit exceeded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      requestId: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      };
    }

    // Generate OpenAPI 3.0 specification
    const openApiSpec = {
      openapi: "3.0.3",
      info: {
        title: "Tool Execution API",
        description: "API for executing various tools and utilities",
        version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "dev",
        contact: {
          name: "API Support",
        },
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
          description: "Production server",
        },
      ],
      paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          ...schemas,
          Error: {
            type: "object",
            properties: {
              error: { type: "string", description: "Error message" },
              code: { type: "string", description: "Error code" },
              requestId: { type: "string", description: "Request ID for tracing" },
            },
          },
        },
      },
      tags: [
        { name: "tools", description: "General tools" },
        { name: "data-studio", description: "Data Studio tools" },
        { name: "cyber-studio", description: "Cyber Studio tools" },
        { name: "dev-studio", description: "Dev Studio tools" },
        { name: "ai-studio", description: "AI Studio tools" },
      ],
    };

    return NextResponse.json(openApiSpec, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("OpenAPI generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate API documentation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Generate request schema from tool definition
 */
function generateRequestSchema(toolDef: any): any {
  // Default to object schema
  return {
    type: "object",
    description: "Tool execution parameters",
    properties: {},
    additionalProperties: true,
  };
}

/**
 * Generate response schema
 */
function generateResponseSchema(): any {
  return {
    type: "object",
    properties: {
      success: { type: "boolean" },
      runId: { type: "string", description: "Unique run identifier" },
      requestId: { type: "string", description: "Request ID for tracing" },
      result: {
        type: "object",
        description: "Tool execution result",
        additionalProperties: true,
      },
      credits: {
        type: "object",
        properties: {
          estimated: { type: "number" },
          charged: { type: "number" },
          balance: { type: "number" },
        },
      },
      executionTime: { type: "number", description: "Execution time in milliseconds" },
      metrics: {
        type: "object",
        properties: {
          phaseDurations: { type: "object" },
          totalDuration: { type: "number" },
        },
      },
    },
    required: ["success", "runId", "result"],
  };
}
