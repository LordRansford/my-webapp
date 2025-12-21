import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "dev",
    buildTime: process.env.BUILD_TIME || null,
  });
}


