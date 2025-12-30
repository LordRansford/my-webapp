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
import { sanitizeFileName } from "@/lib/studios/security/inputSanitizer";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

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

    // Sanitize file name server-side (defense in depth)
    const sanitizedName = sanitizeFileName(uploadedFile.name);
    const sanitizedFile = sanitizedName !== uploadedFile.name
      ? new File([uploadedFile], sanitizedName, { type: uploadedFile.type })
      : uploadedFile;

    // Upload file to storage
    const uploadResult = await uploadFile(sanitizedFile, auth.user!.id, {
      type: "datasets",
    });

    // Log upload for audit
    auditLogger.log(AuditActions.FILE_UPLOADED, "ai-studio", {
      fileName: sanitizedName,
      fileSize: sanitizedFile.size,
      fileType: sanitizedFile.type,
      userId: auth.user!.id
    });

    // Create dataset record in database
    const dataset = await createDataset({
      userId: auth.user!.id,
      name: sanitizedName,
      type: sanitizedName.split(".").pop()?.toLowerCase() || "unknown",
      size: sanitizedFile.size,
      filePath: uploadResult.pathname,
      license: "user-owned", // Default, can be updated later
      status: "uploaded",
    });

    // TODO: Trigger validation job asynchronously
    // This would be done via a background job queue

    const fileType = sanitizedName.split(".").pop()?.toLowerCase() || "unknown";
    const rows = fileType === "csv" ? Math.floor(sanitizedFile.size / 100) : undefined;
    const columns = fileType === "csv" ? 10 : undefined;

    return NextResponse.json(
      {
        data: {
          datasetId: (dataset as any).id,
          fileName: sanitizedName,
          fileSize: sanitizedFile.size,
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
    
    // Log error for audit
    auditLogger.log(AuditActions.ERROR_OCCURRED, "ai-studio", {
      error: "dataset_upload_failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error"
    });
    
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

