import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AdminAccessDeniedPage from "@/app/admin/access-denied/page";
import { requireAdminPermission } from "@/lib/admin/rbac";

export default async function AdminBillingLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null);
  try {
    requireAdminPermission(session?.user || null, "VIEW_BILLING");
  } catch {
    return <AdminAccessDeniedPage />;
  }
  return <>{children}</>;
}


