import AdminUserClient from "./ui.client";
import { getUserAdminSafe } from "@/lib/admin/usersStore";

export const metadata = {
  title: "Admin: User",
  robots: { index: false, follow: false },
};

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserAdminSafe(id);
  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">User not found</h1>
        <p className="text-slate-700">This user does not exist or is not accessible.</p>
      </main>
    );
  }
  return <AdminUserClient user={user} />;
}


