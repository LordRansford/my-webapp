import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin: Credit ledger entry",
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

export default async function CreditLedgerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let e: any = null;
  try {
    e = await (prisma as any).creditLedgerEvent.findUnique({
      where: { id },
      select: { id: true, userId: true, type: true, amountPence: true, reason: true, toolId: true, runId: true, createdAt: true, createdBy: true },
    });
  } catch {
    e = null;
  }
  if (!e) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">Ledger entry not found</h1>
        <p className="text-slate-700">This entry does not exist.</p>
      </main>
    );
  }

  let run: any = null;
  if (e.runId) {
    try {
      run = await (prisma as any).toolRun.findUnique({
        where: { id: e.runId },
        select: { id: true, toolId: true, computeMs: true, computeUnits: true, costPence: true, status: true, createdAt: true },
      });
    } catch {
      run = null;
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Billing</p>
        <h1 className="text-2xl font-semibold text-slate-900">Credit ledger entry</h1>
        <p className="text-slate-700">Read-only detail view.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-700">Created</p>
            <p className="mt-1 text-sm text-slate-900">{toHuman(e.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">User</p>
            <p className="mt-1 font-mono text-xs text-slate-700">{e.userId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Type</p>
            <p className="mt-1 text-sm text-slate-900">{e.type}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Amount</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatPence(Number(e.amountPence || 0))}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold text-slate-700">Reason</p>
          <p className="mt-1 text-sm text-slate-900">{e.reason}</p>
          <p className="mt-2 text-xs text-slate-600">Created by: {e.createdBy || "system"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">Tool</p>
            <p className="mt-1 text-sm text-slate-900">{e.toolId || ""}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">Run</p>
            <p className="mt-1 text-sm text-slate-900">{e.runId || ""}</p>
          </div>
        </div>
      </section>

      {run ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Related tool run</h2>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">{run.toolId}</span> · {run.status} · {toHuman(run.createdAt)}
          </p>
          <p className="text-sm text-slate-700">Compute: {run.computeMs} ms · Units: {run.computeUnits} · Cost: {formatPence(Number(run.costPence || 0))}</p>
          <Link href={`/admin/billing/usage/${encodeURIComponent(run.id)}`} className="text-sm font-semibold text-emerald-700 hover:underline">
            Open run detail
          </Link>
        </section>
      ) : null}

      <Link href="/admin/billing/credits" className="text-sm font-semibold text-emerald-700 hover:underline">
        Back to credits ledger
      </Link>
    </main>
  );
}


