import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AdminAccessDeniedPage from "@/app/admin/access-denied/page";
import { getAdminRole, hasPermission } from "@/lib/admin/rbac";
import AdminAssessmentsClient from "./ui.client";

export const dynamic = "force-dynamic";

export default async function AdminAssessmentsPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = getAdminRole(session?.user || null);
  if (!session?.user || !role) return <AdminAccessDeniedPage />;
  if (!hasPermission(role, "VIEW_ASSESSMENTS")) return <AdminAccessDeniedPage />;

  const canManage = hasPermission(role, "MANAGE_ASSESSMENTS");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Admin</p>
        <h1 className="text-3xl font-semibold text-slate-900">Assessments</h1>
        <p className="text-slate-700 max-w-3xl">Manage questions, publishing, and basic attempt analytics for Cybersecurity.</p>
      </header>
      <AdminAssessmentsClient canManage={canManage} />
    </main>
  );
}

