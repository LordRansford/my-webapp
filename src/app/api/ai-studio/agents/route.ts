/**
 * API Route: Agent Operations
 * 
 * GET /api/ai-studio/agents
 * POST /api/ai-studio/agents
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { z } from "zod";

const createAgentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["single", "multi", "hierarchical", "collaborative"]),
  modelConfig: z.record(z.string(), z.unknown()),
  tools: z.array(z.record(z.string(), z.unknown())),
  memoryConfig: z.record(z.string(), z.unknown()).optional(),
  systemPrompt: z.string().optional(),
  workflow: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    // TODO: List agents from database
    const agents: any[] = [];

    return NextResponse.json(
      {
        data: {
          agents,
          pagination: {
            limit,
            offset,
            total: agents.length,
          },
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List agents error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching agents",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const body = await request.json();
    const validated = createAgentSchema.parse(body);

    // TODO: Create agent in database
    const agent = {
      id: crypto.randomUUID(),
      userId: auth.user!.id,
      name: validated.name,
      description: validated.description,
      type: validated.type,
      modelConfig: validated.modelConfig,
      tools: validated.tools,
      memoryConfig: validated.memoryConfig,
      systemPrompt: validated.systemPrompt,
      workflow: validated.workflow,
      status: "active",
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        data: {
          agent,
        },
        requestId: crypto.randomUUID(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error("Create agent error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while creating agent",
        },
      },
      { status: 500 }
    );
  }
}

