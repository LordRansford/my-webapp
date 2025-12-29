/**
 * AI Studio Agents API
 * 
 * GET /api/ai-studio/agents - List agents
 * POST /api/ai-studio/agents - Create agent
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { listAgents, createAgent } from "@/lib/ai-studio/db";
import { z } from "zod";

const agentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  config: z.object({
    model: z.string(),
    tools: z.array(z.string()).optional(),
    memory: z.record(z.string(), z.unknown()).optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(100000).optional(),
  }),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    const agents = await listAgents(auth.user!.id, {
      limit,
      offset,
      status,
    });

    return NextResponse.json(
      {
        data: {
          agents,
          pagination: {
            limit,
            offset,
            total: agents.length, // TODO: Get actual total from DB
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
    const validated = agentSchema.parse(body);

    const agent = await createAgent({
      userId: auth.user!.id,
      name: validated.name,
      description: validated.description,
      config: validated.config,
      status: "created",
      version: "1.0.0",
    });

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
