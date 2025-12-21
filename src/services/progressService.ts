import { prisma } from "@/lib/db/prisma";

// Progress persistence rules:
// - Anonymous users: local-only (handled in client hook; server endpoints require auth)
// - Signed-in users: server is source of truth for cross-device persistence

export async function upsertUserIdentity(params: {
  userId: string;
  email: string;
  provider: string;
  providerAccountId: string;
}) {
  const email = params.email.trim().toLowerCase();
  if (!email) return null;
  return prisma.userIdentity.upsert({
    where: { id: params.userId },
    create: {
      id: params.userId,
      email,
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      lastLoginAt: new Date(),
    },
    update: {
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      lastLoginAt: new Date(),
    },
  });
}

export async function getCpdStateForUser(userId: string) {
  const row = await prisma.cpdState.findUnique({ where: { userId } });
  return row ? { stateJson: row.stateJson, updatedAt: row.updatedAt.toISOString() } : null;
}

export async function setCpdStateForUser(params: { userId: string; stateJson: string }) {
  const saved = await prisma.cpdState.upsert({
    where: { userId: params.userId },
    create: { userId: params.userId, stateJson: params.stateJson },
    update: { stateJson: params.stateJson },
  });

  // Maintain per-section progress rows as a foundation for future CPD evidence/export.
  // This is derived data: the canonical state is the CPD JSON.
  try {
    const state = JSON.parse(params.stateJson);
    const sections = Array.isArray(state?.sections) ? state.sections : [];

    const writes = sections
      .filter((s: any) => s && typeof s === "object")
      .filter((s: any) => s.sectionId && s.sectionId !== "overall")
      .map((s: any) => ({
        courseId: String(s.trackId || "").trim(),
        levelId: String(s.levelId || "").trim(),
        sectionId: String(s.sectionId || "").trim(),
        completed: Boolean(s.completed),
        minutes: Math.max(0, Number(s.minutes) || 0),
      }))
      .filter((s: any) => s.courseId && s.levelId && s.sectionId);

    // Upsert each progress row (idempotent per unique key).
    await Promise.all(
      writes.map((w: any) =>
        prisma.progress.upsert({
          where: {
            userId_courseId_levelId_sectionId: {
              userId: params.userId,
              courseId: w.courseId,
              levelId: w.levelId,
              sectionId: w.sectionId,
            },
          },
          create: { userId: params.userId, ...w },
          update: { completed: w.completed, minutes: w.minutes },
        }),
      ),
    );
  } catch {
    // Do not fail persistence if derived progress rows cannot be updated.
  }

  return { updatedAt: saved.updatedAt.toISOString() };
}

export async function getAdminProgressStats() {
  const totalUsers = await prisma.userIdentity.count();
  const totalProgressRecords = await prisma.progress.count();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = await prisma.userIdentity.count({ where: { lastLoginAt: { gte: since } } });
  return { totalUsers, activeUsersLast7Days: activeUsers, totalProgressRecords };
}


