/**
 * API Route: Cancel Training Job
 * 
 * POST /api/ai-studio/jobs/:id/cancel
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = id;

    // In production, this would:
    // 1. Verify user has access to job
    // 2. Check if job can be cancelled
    // 3. Cancel job in queue system
    // 4. Update job status in database

    return NextResponse.json(
      {
        data: {
          jobId,
          status: "cancelling",
          message: "Job cancellation requested",
        },
        requestId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel job error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while cancelling job",
        },
      },
      { status: 500 }
    );
  }
}

