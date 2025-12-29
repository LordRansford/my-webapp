/**
 * API Route: Agent Operations
 * 
 * GET /api/ai-studio/agents/:id
 * PUT /api/ai-studio/agents/:id
 * DELETE /api/ai-studio/agents/:id
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, checkResourceAccess } from "@/lib/ai-studio/auth";
import { z } from "zod";

const updateAgentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  modelConfig: z.record(z.string(), z.unknown()).optional(),
  tools: z.array(z.record(z.string(), z.unknown())).optional(),
  memoryConfig: z.record(z.string(), z.unknown()).optional(),
  systemPrompt: z.string().optional(),
  workflow: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["active", "paused", "archived"]).optional(),
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

    // TODO: Get agent from database
    const agent: any = null;

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
    if (!checkResourceAccess(auth.user!.id, agent.userId)) {
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

    // TODO: Get agent from database
    const agent: any = null;

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
    if (!checkResourceAccess(auth.user!.id, agent.userId)) {
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

    const body = await request.json();
    const validated = updateAgentSchema.parse(body);

    // TODO: Update agent in database
    const updated = {
      ...agent,
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        data: {
          agent: updated,
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

    // TODO: Get agent from database
    const agent: any = null;

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
    if (!checkResourceAccess(auth.user!.id, agent.userId)) {
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

    // TODO: Soft delete agent in database

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

