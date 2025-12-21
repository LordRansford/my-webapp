import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listTemplateDownloads, listToolRuns } from "@/lib/billing/store";
import { getSafePlanSummaryForRequest } from "@/lib/billing/access";

export async function GET() {
  const session = await getServerSession(authOptions);
  const planSummary = await getSafePlanSummaryForRequest();

  if (!session?.user?.id) {
    return NextResponse.json({
      authenticated: false,
      plan: planSummary.plan,
      recentToolRuns: [],
      recentDownloads: [],
    });
  }

  const userId = session.user.id;
  const recentToolRuns = listToolRuns({ userId }, 25);
  const recentDownloads = listTemplateDownloads({ userId }, 25);

  return NextResponse.json({
    authenticated: true,
    plan: planSummary.plan,
    recentToolRuns,
    recentDownloads,
  });
}


