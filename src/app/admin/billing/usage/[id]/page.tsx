import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin: Tool run detail",
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

export default async function ToolRunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let r: any = null;
  try {
    r = await (prisma as any).toolRun.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        toolId: true,
        courseId: true,
        pageId: true,
        inputSizeBytes: true,
        computeUnits: true,
        computeMs: true,
        costPence: true,
        freeTierCoveredPence: true,
        paidTierChargedPence: true,
        status: true,
        createdAt: true,
        metadata: true,
      },
    });
  } catch {
    r = null;
  }

  if (!r) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">Run not found</h1>
        <p className="text-slate-700">This tool run does not exist.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Billing</p>
        <h1 className="text-2xl font-semibold text-slate-900">Tool run detail</h1>
        <p className="text-slate-700">Read-only breakdown with safe metadata only.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-700">Created</p>
            <p className="mt-1 text-sm text-slate-900">{toHuman(r.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Status</p>
            <p className="mt-1 text-sm text-slate-900">{r.status}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">User</p>
            <p className="mt-1 font-mono text-xs text-slate-700">{r.userId || "anonymous"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Tool</p>
            <p className="mt-1 text-sm text-slate-900">{r.toolId}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Compute</p>
            <p className="mt-1 text-sm text-slate-900">{r.computeMs} ms</p>
            <p className="text-xs text-slate-600">Units: {r.computeUnits}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Cost</p>
            <p className="mt-1 text-sm text-slate-900">{formatPence(Number(r.costPence || 0))}</p>
            <p className="text-xs text-slate-600">Free covered: {formatPence(Number(r.freeTierCoveredPence || 0))}</p>
            <p className="text-xs text-slate-600">Paid charged: {formatPence(Number(r.paidTierChargedPence || 0))}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Input</p>
            <p className="mt-1 text-sm text-slate-900">{r.inputSizeBytes != null ? `${r.inputSizeBytes} bytes` : "Not recorded"}</p>
            <p className="text-xs text-slate-600">Course: {r.courseId || ""}</p>
            <p className="text-xs text-slate-600">Page: {r.pageId || ""}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-700">Safe metadata</p>
          <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-800">{JSON.stringify(r.metadata || {}, null, 2)}</pre>
        </div>
      </section>

      <Link href="/admin/billing/usage" className="text-sm font-semibold text-emerald-700 hover:underline">
        Back to usage and costs
      </Link>
    </main>
  );
}


