import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listLearningRecordsForUser } from "@/lib/learning/records";
import { withRequestLogging } from "@/lib/security/requestLog";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/learning/records" }, async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const records = listLearningRecordsForUser(session.user.id);
    return NextResponse.json({ records }, { status: 200 });
  });
}


