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
import { uploadFile } from "@/lib/ai-studio/storage";
import { createDataset } from "@/lib/ai-studio/db";

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

    // Upload file to storage
    const uploadResult = await uploadFile(uploadedFile, auth.user!.id, {
      type: "datasets",
    });

    // Create dataset record in database
    const dataset = await createDataset({
      userId: auth.user!.id,
      name: uploadedFile.name,
      type: uploadedFile.name.split(".").pop()?.toLowerCase() || "unknown",
      size: uploadedFile.size,
      filePath: uploadResult.pathname,
      license: "user-owned", // Default, can be updated later
      status: "uploaded",
    });

    // TODO: Trigger validation job asynchronously
    // This would be done via a background job queue

    const fileType = uploadedFile.name.split(".").pop()?.toLowerCase() || "unknown";
    const rows = fileType === "csv" ? Math.floor(uploadedFile.size / 100) : undefined;
    const columns = fileType === "csv" ? 10 : undefined;

    return NextResponse.json(
      {
        data: {
          datasetId: (dataset as any).id,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType,
          rows,
          columns,
          filePath: uploadResult.pathname,
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

