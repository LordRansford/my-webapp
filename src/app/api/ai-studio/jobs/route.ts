/**
 * API Route: List Training Jobs
 * 
 * GET /api/ai-studio/jobs
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { listTrainingJobs } from "@/lib/ai-studio/db";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status") || undefined;

    const jobs = await listTrainingJobs(auth.user!.id, {
      limit,
      offset,
      status,
    });

    return NextResponse.json(
      {
        data: {
          jobs,
          pagination: {
            limit,
            offset,
            total: jobs.length, // TODO: Get actual total from DB
          },
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List jobs error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching jobs",
        },
      },
      { status: 500 }
    );
  }
}

