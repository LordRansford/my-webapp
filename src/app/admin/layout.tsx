import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AdminAccessDeniedPage from "@/app/admin/access-denied/page";
import { getAdminRole, hasPermission } from "@/lib/admin/rbac";

// Preview: /admin routes are not for indexing during early release.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = getAdminRole(session?.user || null);
  if (!session?.user || !role) return <AdminAccessDeniedPage />;

  const canViewBilling = hasPermission(role, "VIEW_BILLING");

  const nav = [
    { href: "/admin", label: "Overview", enabled: true },
    { href: "/admin/users", label: "Users", enabled: true },
    { href: "/admin/support", label: "Support", enabled: true },
    { href: "/admin/billing", label: "Billing overview", enabled: canViewBilling },
    { href: "/admin/billing/credits", label: "Credits ledger", enabled: canViewBilling },
    { href: "/admin/billing/usage", label: "Usage and costs", enabled: canViewBilling },
    { href: "/admin/billing/stripe", label: "Stripe readiness", enabled: canViewBilling },
    { href: "/admin/system", label: "System", enabled: true },
  ];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-600">Admin Control Centre</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Signed in role: {role}</p>
              </div>
              <nav aria-label="Admin navigation" className="space-y-1">
                {nav.map((item) => (
                  item.enabled ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.href} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-400">
                      {item.label}
                    </div>
                  )
                ))}
              </nav>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">Auditability</p>
                <p className="mt-1 text-xs text-slate-600">
                  Admin actions are audited server-side. Provide a reason for sensitive changes.
                </p>
              </div>
            </div>
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}


