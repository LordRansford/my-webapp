/**
 * API Route: List Datasets
 * 
 * GET /api/ai-studio/datasets
 * POST /api/ai-studio/datasets
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { listDatasets, createDataset } from "@/lib/ai-studio/db";
import { z } from "zod";

const createDatasetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["csv", "json", "jsonl", "parquet"]),
  size: z.number().min(1),
  filePath: z.string(),
  license: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    const datasets = await listDatasets(auth.user!.id, {
      limit,
      offset,
      status,
    });

    return NextResponse.json(
      {
        data: {
          datasets,
          pagination: {
            limit,
            offset,
            total: datasets.length, // Note: For accurate total, use count query with same filters
          },
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List datasets error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching datasets",
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
    const validated = createDatasetSchema.parse(body);

    const dataset = await createDataset({
      userId: auth.user!.id,
      name: validated.name,
      description: validated.description,
      type: validated.type,
      size: validated.size,
      filePath: validated.filePath,
      license: validated.license,
      status: "uploading",
    });

    return NextResponse.json(
      {
        data: {
          dataset,
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

    console.error("Create dataset error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while creating dataset",
        },
      },
      { status: 500 }
    );
  }
}

