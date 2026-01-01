/**
 * API Route: Dataset Operations
 * 
 * GET /api/ai-studio/datasets/:id
 * PUT /api/ai-studio/datasets/:id
 * DELETE /api/ai-studio/datasets/:id
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, checkResourceAccess } from "@/lib/ai-studio/auth";
import { getDataset, updateDataset, deleteDataset } from "@/lib/ai-studio/db";
import { z } from "zod";

const updateDatasetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  license: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { id } = await context.params;
    const datasetId = id;

    const dataset = await getDataset(datasetId, auth.user!.id);

    if (!dataset) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Dataset not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify access
    if (!checkResourceAccess(auth.user!.id, (dataset as any).userId)) {
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
          dataset,
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get dataset error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching dataset",
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
    const datasetId = id;

    const dataset = await getDataset(datasetId, auth.user!.id);

    if (!dataset) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Dataset not found",
          },
        },
        { status: 404 }
      );
    }

    const datasetObj = dataset as any;

    // Verify access
    if (!checkResourceAccess(auth.user!.id, datasetObj.userId)) {
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
    const validated = updateDatasetSchema.parse(body);

    const updated = await updateDataset(datasetId, auth.user!.id, {
      ...(validated.name && { name: validated.name }),
      ...(validated.description !== undefined && { description: validated.description }),
      ...(validated.license && { license: validated.license }),
    });
    
    if (!updated) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Dataset not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: {
          dataset: updated,
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

    console.error("Update dataset error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while updating dataset",
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
    const datasetId = id;

    const dataset = await getDataset(datasetId, auth.user!.id);

    if (!dataset) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Dataset not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify access
    if (!checkResourceAccess(auth.user!.id, (dataset as any).userId)) {
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

    await deleteDataset(datasetId, auth.user!.id);

    return NextResponse.json(
      {
        data: {
          message: "Dataset deleted successfully",
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete dataset error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while deleting dataset",
        },
      },
      { status: 500 }
    );
  }
}

