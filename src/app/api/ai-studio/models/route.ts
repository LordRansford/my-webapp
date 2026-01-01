/**
 * API Route: List Models
 * 
 * GET /api/ai-studio/models
 * POST /api/ai-studio/models
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { listModels, createModel } from "@/lib/ai-studio/db";
import { z } from "zod";

const createModelSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["classification", "regression", "clustering", "generation", "other"]),
  architecture: z.record(z.string(), z.unknown()),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    const models = await listModels(auth.user!.id, {
      limit,
      offset,
      status,
    });

    return NextResponse.json(
      {
        data: {
          models,
          pagination: {
            limit,
            offset,
            total: models.length, // Note: For accurate total, use count query with same filters
          },
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List models error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching models",
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
    const validated = createModelSchema.parse(body);

    const model = await createModel({
      userId: auth.user!.id,
      name: validated.name,
      description: validated.description,
      type: validated.type,
      architecture: validated.architecture,
      status: "created",
      version: "1.0.0",
      metadata: {},
    });

    return NextResponse.json(
      {
        data: {
          model,
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

    console.error("Create model error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while creating model",
        },
      },
      { status: 500 }
    );
  }
}

