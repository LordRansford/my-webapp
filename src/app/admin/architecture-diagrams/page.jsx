import ArchitectureDiagramsAdminClient from "./page.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AdminAccessDeniedPage from "@/app/admin/access-denied/page";
import { requireAdminPermission } from "@/lib/admin/rbac";

export const metadata = {
  title: "Admin: Architecture Diagrams",
  robots: { index: false, follow: false },
};

export default async function ArchitectureDiagramsAdminPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user) return <AdminAccessDeniedPage />;
  try {
    requireAdminPermission(session.user, "VIEW_SYSTEM");
  } catch {
    return <AdminAccessDeniedPage />;
  }
  return <ArchitectureDiagramsAdminClient />;
}


