import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getUserById, getCpdState } from "@/lib/auth/store";
import { getUserAnalytics } from "@/lib/analytics/store";

function summarize(events: ReturnType<typeof getUserAnalytics>["events"]) {
  const toolIds = new Set<string>();
  const quizIdsAttempted = new Set<string>();
  const quizIdsCompleted = new Set<string>();
  const sectionsStarted = new Set<string>();
  const sectionsCompleted = new Set<string>();

  for (const e of events) {
    if (e.toolId) toolIds.add(e.toolId);
    if (e.quizId && e.type === "quiz_attempted") quizIdsAttempted.add(e.quizId);
    if (e.quizId && e.type === "quiz_completed") quizIdsCompleted.add(e.quizId);
    if (e.trackId && e.levelId && e.sectionId) {
      const key = `${e.trackId}:${e.levelId}:${e.sectionId}`;
      if (e.type === "section_started") sectionsStarted.add(key);
      if (e.type === "section_completed") sectionsCompleted.add(key);
    }
  }

  return {
    toolsExplored: toolIds.size,
    quizzesAttempted: quizIdsAttempted.size,
    quizzesCompleted: quizIdsCompleted.size,
    sectionsStarted: sectionsStarted.size,
    sectionsCompleted: sectionsCompleted.size,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const consent = (user as any).consent || {};
  const allowed = Boolean(consent.cpdDataUseAcceptedAt);

  const analytics = getUserAnalytics(userId);
  const summary = summarize(analytics.events);

  const cpd = getCpdState(userId);
  const cpdUpdatedAt = cpd?.updatedAt || null;

  return res.status(200).json({
    consented: allowed,
    summary,
    cpdUpdatedAt,
  });
}


