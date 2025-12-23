import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin: Credits ledger",
  robots: { index: false, follow: false },
};

function toHuman(d: any) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

function formatPence(pence: number) {
  const pounds = (pence / 100).toFixed(2);
  return `£${pounds}`;
}

export default async function AdminCreditsLedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string; type?: string; from?: string; to?: string; cursor?: string }>;
}) {
  const sp = await searchParams;
  const user = (sp.user || "").trim();
  const type = (sp.type || "").trim();
  const from = (sp.from || "").trim();
  const to = (sp.to || "").trim();
  const cursor = sp.cursor || null;

  const where: any = {};
  if (user) where.userId = user;
  if (type) where.type = type;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const take = 30;
  let rows: any[] = [];
  try {
    rows = await (prisma as any).creditLedgerEvent.findMany({
      where,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
      select: { id: true, userId: true, type: true, amountPence: true, reason: true, toolId: true, runId: true, createdAt: true },
    });
  } catch {
    rows = [];
  }

  const next = rows.length > take ? rows[take] : null;
  const items = rows.slice(0, take);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Billing</p>
        <h1 className="text-2xl font-semibold text-slate-900">Credits ledger</h1>
        <p className="text-slate-700">Read-only ledger of credit events. No edits or deletions.</p>
      </header>

      <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-3 items-end" action="/admin/billing/credits">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">User</span>
          <input name="user" defaultValue={user} placeholder="User ID" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Type</span>
          <input name="type" defaultValue={type} placeholder="credit_spent" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">From</span>
          <input name="from" defaultValue={from} placeholder="YYYY-MM-DD" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">To</span>
          <input name="to" defaultValue={to} placeholder="YYYY-MM-DD" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
        </label>
        <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Apply
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {["Created", "User", "Type", "Amount", "Reason", "Tool", "Run"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((e: any) => (
              <tr key={e.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{toHuman(e.createdAt)}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{e.userId}</td>
                <td className="px-4 py-3 text-slate-900">{e.type}</td>
                <td className="px-4 py-3 text-slate-900">{formatPence(Number(e.amountPence || 0))}</td>
                <td className="px-4 py-3 text-slate-700">
                  <Link href={`/admin/billing/credits/${encodeURIComponent(e.id)}`} className="font-semibold text-emerald-700 hover:underline">
                    {e.reason}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{e.toolId || ""}</td>
                <td className="px-4 py-3 text-slate-700">{e.runId || ""}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                  No ledger entries.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/admin/billing" className="text-sm font-semibold text-emerald-700 hover:underline">
          Back to billing overview
        </Link>
        {next ? (
          <Link
            href={`/admin/billing/credits?user=${encodeURIComponent(user)}&type=${encodeURIComponent(type)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(
              to
            )}&cursor=${encodeURIComponent(next.id)}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
          >
            Next page
          </Link>
        ) : (
          <span className="text-xs text-slate-500">End</span>
        )}
      </div>
    </main>
  );
}


