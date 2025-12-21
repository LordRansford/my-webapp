import { notFound } from "next/navigation";
import NotesLayout from "@/components/notes/Layout";
import { getUsage, resetUsage } from "@/lib/mentor/usage";
import { getAdminProgressStats } from "@/services/progressService";

export default async function AdminMentorPage() {
  const enabled = process.env.MENTOR_ADMIN_ENABLED === "true";
  if (!enabled) notFound();
  const usage = getUsage();
  let progressStats: any = null;
  try {
    progressStats = await getAdminProgressStats();
  } catch {
    progressStats = null;
  }

  async function reset() {
    "use server";
    resetUsage();
  }

  return (
    <NotesLayout
      meta={{
        title: "Mentor admin",
        description: "Private mentor controls.",
        level: "Summary",
        slug: "/admin/mentor",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-4">
        <header className="space-y-1">
          <p className="eyebrow">Private</p>
          <h1 className="text-2xl font-semibold text-slate-900">Mentor controls</h1>
          <p className="text-slate-700">Usage counters and reset. Mentor can be disabled via env.</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm text-slate-700">Total queries: {usage.total}</p>
          <p className="text-sm text-slate-700">Last reset: {new Date(usage.lastReset).toLocaleString()}</p>
          <form action={reset}>
            <button type="submit" className="button mt-3">
              Reset usage
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Identity + progress (read-only)</p>
          {progressStats ? (
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>Total users: {progressStats.totalUsers}</p>
              <p>Active users (last 7 days): {progressStats.activeUsersLast7Days}</p>
              <p>Total progress records: {progressStats.totalProgressRecords}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-700">
              Stats unavailable (database not initialised in this environment).
            </p>
          )}
        </div>
      </div>
    </NotesLayout>
  );
}


