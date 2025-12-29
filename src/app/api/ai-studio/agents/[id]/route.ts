/**
 * AI Studio Agent API
 * 
 * GET /api/ai-studio/agents/[id] - Get agent
 * PUT /api/ai-studio/agents/[id] - Update agent
 * DELETE /api/ai-studio/agents/[id] - Delete agent
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { getAgent, updateAgent, deleteAgent } from "@/lib/ai-studio/db";
import { z } from "zod";

const agentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  config: z.object({
    model: z.string().optional(),
    tools: z.array(z.string()).optional(),
    memory: z.record(z.string(), z.unknown()).optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(100000).optional(),
  }).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { id } = await context.params;
    const agentId = id;

    const agent = await getAgent(agentId, auth.user!.id);

    if (!agent) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Agent not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify access
    if ((agent as any).userId !== auth.user!.id) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        data: {
          agent,
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get agent error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching agent",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { id } = await context.params;
    const agentId = id;

    const body = await request.json();
    const validated = agentSchema.parse(body);

    // Verify agent exists and user has access
    const existingAgent = await getAgent(agentId, auth.user!.id);
    if (!existingAgent) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Agent not found",
          },
        },
        { status: 404 }
      );
    }

    if ((existingAgent as any).userId !== auth.user!.id) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
          },
        },
        { status: 403 }
      );
    }

    const agent = await updateAgent(agentId, auth.user!.id, validated);

    return NextResponse.json(
      {
        data: {
          agent,
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
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

    console.error("Update agent error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while updating agent",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { id } = await context.params;
    const agentId = id;

    // Verify agent exists and user has access
    const existingAgent = await getAgent(agentId, auth.user!.id);
    if (!existingAgent) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Agent not found",
          },
        },
        { status: 404 }
      );
    }

    if ((existingAgent as any).userId !== auth.user!.id) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Access denied",
          },
        },
        { status: 403 }
      );
    }

    await deleteAgent(agentId, auth.user!.id);

    return NextResponse.json(
      {
        data: {
          message: "Agent deleted successfully",
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete agent error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while deleting agent",
        },
      },
      { status: 500 }
    );
  }
}
