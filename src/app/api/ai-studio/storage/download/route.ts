/**
 * API Route: Download File (Proxy)
 * 
 * GET /api/ai-studio/storage/download
 * 
 * Secure file download with authentication and access control
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { getFileMetadata, fileExists } from "@/lib/ai-studio/storage";
import { getDownloadUrl } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("path");

    if (!pathname) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Path parameter required",
          },
        },
        { status: 400 }
      );
    }

    // Verify path belongs to user
    // Path format: ai-studio/{userId}/...
    const pathParts = pathname.split("/");
    if (pathParts.length < 3 || pathParts[0] !== "ai-studio" || pathParts[1] !== auth.user!.id) {
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

    // Check if file exists
    const exists = await fileExists(pathname);
    if (!exists) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "File not found",
          },
        },
        { status: 404 }
      );
    }

    // Get file metadata
    const metadata = await getFileMetadata(pathname);

    // Get download URL from Vercel Blob
    // getDownloadUrl returns a signed URL that can be used to download the file
    const downloadUrl = await getDownloadUrl(pathname);
    
    // Redirect to the signed URL
    // This is more efficient as it uses Vercel's CDN directly
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while downloading file",
        },
      },
      { status: 500 }
    );
  }
}

