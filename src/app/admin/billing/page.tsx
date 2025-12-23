import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { PRICING_CONFIG } from "@/config/pricing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin: Billing overview",
  robots: { index: false, follow: false },
};

function formatPence(pence: number) {
  const pounds = (pence / 100).toFixed(2);
  return `£${pounds}`;
}

export default async function AdminBillingOverviewPage() {
  // Build-time safety: these tables may not exist in CI/preview builds.
  // Render a stable zero-state instead of crashing the build.
  let totalUsers = 0;
  let usersWithBalanceCount = 0;
  let outstandingPence = 0;
  let spent7 = 0;
  let spent30 = 0;
  let topTools: { toolId: string; paid: number }[] = [];

  try {
    totalUsers = await (prisma as any).userIdentity.count();
  } catch {
    totalUsers = 0;
  }

  try {
    const grouped = await (prisma as any).creditLedgerEvent.groupBy({
      by: ["userId"],
      _sum: { amountPence: true },
    });
    usersWithBalanceCount = (grouped || []).filter((g: any) => Number(g?._sum?.amountPence || 0) > 0).length;
    outstandingPence = (grouped || []).reduce((acc: number, g: any) => acc + Number(g?._sum?.amountPence || 0), 0);
  } catch {
    usersWithBalanceCount = 0;
    outstandingPence = 0;
  }

  const now = Date.now();
  try {
    const agg7 = await (prisma as any).creditLedgerEvent.aggregate({
      where: { type: "credit_spent", createdAt: { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } },
      _sum: { amountPence: true },
    });
    spent7 = Math.max(0, Number(agg7?._sum?.amountPence || 0) * -1);
  } catch {
    spent7 = 0;
  }

  try {
    const agg30 = await (prisma as any).creditLedgerEvent.aggregate({
      where: { type: "credit_spent", createdAt: { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } },
      _sum: { amountPence: true },
    });
    spent30 = Math.max(0, Number(agg30?._sum?.amountPence || 0) * -1);
  } catch {
    spent30 = 0;
  }

  try {
    const groupedTools = await (prisma as any).toolRun.groupBy({
      by: ["toolId"],
      where: { createdAt: { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } },
      _sum: { paidTierChargedPence: true },
      orderBy: { _sum: { paidTierChargedPence: "desc" } },
      take: 5,
    });
    topTools = (groupedTools || []).map((t: any) => ({
      toolId: String(t.toolId),
      paid: Number(t?._sum?.paidTierChargedPence || 0),
    }));
  } catch {
    topTools = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Billing</p>
        <h1 className="text-2xl font-semibold text-slate-900">Billing overview</h1>
        <p className="text-slate-700">
          Read-only visibility for credits, usage, and Stripe readiness. Payments remain disabled.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/billing/credits" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
            Credits ledger
          </Link>
          <Link href="/admin/billing/usage" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
            Usage and costs
          </Link>
          <Link href="/admin/billing/stripe" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
            Stripe readiness
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: String(totalUsers) },
          { label: "Users with balance > 0", value: String(usersWithBalanceCount) },
          { label: "Total credit outstanding", value: formatPence(outstandingPence) },
          { label: "Total credit spent (30d)", value: formatPence(spent30) },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-700">{x.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{x.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Spend windows</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-slate-700">Spent (7d)</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPence(spent7)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-slate-700">Spent (30d)</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPence(spent30)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Top tools by paid cost (30d)</h2>
          {topTools.length ? (
            <ul className="space-y-2 text-sm text-slate-800">
              {topTools.map((t) => (
                <li key={t.toolId} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <span className="font-semibold">{t.toolId}</span>
                  <span className="text-slate-700">{formatPence(Number(t.paid || 0))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No paid usage recorded yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Pricing configuration (read only)</h2>
        <p className="text-sm text-slate-700">These values are the server-side source of truth for later billing work.</p>
        <pre className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
{JSON.stringify(PRICING_CONFIG, null, 2)}
        </pre>
      </section>
    </main>
  );
}


