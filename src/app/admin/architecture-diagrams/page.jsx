import ArchitectureDiagramsAdminClient from "./page.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdmin } from "@/lib/admin/isAdmin";

export const metadata = {
  title: "Admin: Architecture Diagrams",
  robots: { index: false, follow: false },
};

export default async function ArchitectureDiagramsAdminPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-700 shadow-sm">Unauthorized.</div>
      </main>
    );
  }
  if (!isAdmin(session.user)) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-700 shadow-sm">Forbidden.</div>
      </main>
    );
  }
  return <ArchitectureDiagramsAdminClient />;
}


