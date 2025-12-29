/**
 * API Route: Dataset Upload
 * 
 * POST /api/ai-studio/datasets/upload
 * 
 * Handles file uploads for datasets with validation
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { validateUpload } from "@/utils/validateUpload";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = [".csv", ".json", ".jsonl", ".parquet"];

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "No file provided",
          },
        },
        { status: 400 }
      );
    }

    // Validate file
    const { safeFiles, errors } = validateUpload([file], {
      maxBytes: MAX_FILE_SIZE,
      allowedExtensions: ALLOWED_EXTENSIONS,
    });

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "File validation failed",
            details: errors,
          },
        },
        { status: 400 }
      );
    }

    if (safeFiles.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "No valid files",
          },
        },
        { status: 400 }
      );
    }

    const uploadedFile = safeFiles[0];

    // In production, this would:
    // 1. Upload file to storage (S3, Vercel Blob, etc.)
    // 2. Create dataset record in database
    // 3. Trigger validation job
    // 4. Return dataset ID

    // For now, simulate upload
    const datasetId = crypto.randomUUID();
    const fileSize = uploadedFile.size;
    const fileName = uploadedFile.name;
    const fileType = fileName.split(".").pop()?.toLowerCase() || "unknown";

    // Simulate file processing
    const rows = fileType === "csv" ? Math.floor(fileSize / 100) : undefined;
    const columns = fileType === "csv" ? 10 : undefined;

    return NextResponse.json(
      {
        data: {
          datasetId,
          fileName,
          fileSize,
          fileType,
          rows,
          columns,
          status: "uploaded",
          message: "File uploaded successfully. Validation will begin shortly.",
        },
        requestId: crypto.randomUUID(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Dataset upload error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred during file upload",
        },
      },
      { status: 500 }
    );
  }
}

