/**
 * API Route: Model Operations
 * 
 * GET /api/ai-studio/models/:id
 * PUT /api/ai-studio/models/:id
 * DELETE /api/ai-studio/models/:id
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, checkResourceAccess } from "@/lib/ai-studio/auth";
import { getModel, updateModel, deleteModel } from "@/lib/ai-studio/db";
import { z } from "zod";

const updateModelSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  architecture: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { id } = await context.params;
    const modelId = id;

    const model = await getModel(modelId, auth.user!.id);

    if (!model) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Model not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify access
    if (!checkResourceAccess(auth.user!.id, (model as any).userId)) {
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
          model,
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get model error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching model",
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
    const modelId = id;

    const model = await getModel(modelId, auth.user!.id);

    if (!model) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Model not found",
          },
        },
        { status: 404 }
      );
    }

    const modelObj = model as any;

    // Verify access
    if (!checkResourceAccess(auth.user!.id, modelObj.userId)) {
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
    const validated = updateModelSchema.parse(body);

    const updated = await updateModel(modelId, auth.user!.id, {
      ...(validated.name && { name: validated.name }),
      ...(validated.description !== undefined && { description: validated.description }),
      ...(validated.architecture && { architecture: validated.architecture }),
    });
    
    if (!updated) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Model not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: {
          model: updated,
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

    console.error("Update model error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while updating model",
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
    const modelId = id;

    const model = await getModel(modelId, auth.user!.id);

    if (!model) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Model not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify access
    if (!checkResourceAccess(auth.user!.id, (model as any).userId)) {
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

    await deleteModel(modelId, auth.user!.id);

    return NextResponse.json(
      {
        data: {
          message: "Model deleted successfully",
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete model error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while deleting model",
        },
      },
      { status: 500 }
    );
  }
}

