import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function fmtDate(v: any) {
  if (!v) return "—";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toISOString().slice(0, 10);
  } catch {
    return "—";
  }
}

function fmtTime(v: any) {
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch {
    return "";
  }
}

async function getHistory(toolId: string | null) {
  const qs = toolId ? `?toolId=${encodeURIComponent(toolId)}` : "";
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const origin = host ? `${proto}://${host}` : "";
  const url = origin ? `${origin}/api/compute/history${qs}` : `/api/compute/history${qs}`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) return { ok: false, error: String(data?.error || "History unavailable") };
  return data;
}

export default async function AccountUsagePage(props: { searchParams?: Promise<{ toolId?: string }> }) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Usage</h1>
        <p className="mt-2 text-slate-700">Sign in to view your credits and recent compute runs.</p>
        <p className="mt-4">
          <Link href="/signin" className="font-semibold text-emerald-700 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </main>
    );
  }

  const sp = (await props.searchParams?.catch?.(() => ({}))) as any;
  const toolId = typeof sp?.toolId === "string" ? sp.toolId.trim() : "";
  const data = await getHistory(toolId || null);

  const jobs = Array.isArray((data as any)?.jobs) ? (data as any).jobs : [];

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Account</p>
        <h1 className="text-3xl font-semibold text-slate-900">Usage</h1>
        <p className="text-slate-700">See free tier usage, credits charged, and your recent runs.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Credits</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{typeof (data as any)?.balance === "number" ? (data as any).balance : 0}</p>
            <p className="mt-1 text-sm text-slate-700">Expiry: {fmtDate((data as any)?.expiresAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/account/credits" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
              Credits details
            </Link>
            <Link href="/compute" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              How compute works
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent runs</h2>
          <form className="flex flex-wrap items-center gap-2" action="/account/usage" method="get">
            <label className="text-xs font-semibold text-slate-700" htmlFor="toolId">
              Filter by toolId
            </label>
            <input
              id="toolId"
              name="toolId"
              defaultValue={toolId || ""}
              className="w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              placeholder="code-runner"
            />
            <button type="submit" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
              Apply
            </button>
            {toolId ? (
              <Link href="/account/usage" className="text-sm font-semibold text-slate-700 underline underline-offset-4">
                Clear
              </Link>
            ) : null}
          </form>
        </div>

        {jobs.length === 0 ? <p className="text-sm text-slate-700">No runs yet.</p> : null}

        <div className="space-y-2">
          {jobs.map((j: any) => (
            <details key={j.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{j.toolId}</p>
                    <p className="text-xs text-slate-700">
                      {j.status} • {typeof j.durationMs === "number" ? `${j.durationMs} ms` : "—"} • estimate {j.estimatedCostCredits ?? 0} credits • charged {j.chargedCredits ?? 0}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{fmtTime(j.createdAt)}</p>
                </div>
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-800">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-700">Free tier applied</p>
                  <p className="mt-1 font-semibold text-slate-900">{j.freeTierAppliedMs ?? 0} ms</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-700">Input bytes</p>
                  <p className="mt-1 font-semibold text-slate-900">{j.inputBytes ?? 0}</p>
                </div>
              </div>
              {j.errorMessage ? (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
                  {String(j.errorCode || "ERROR")}: {String(j.errorMessage)}
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <Link href="/account" className="text-sm font-semibold text-slate-700 hover:underline">
          Back to account
        </Link>
        <Link href="/workspace" className="text-sm font-semibold text-emerald-700 hover:underline">
          Open Workspace
        </Link>
      </div>
    </main>
  );
}


