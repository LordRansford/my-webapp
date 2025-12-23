"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type AdminUser = {
  userId: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  lastActiveAt: string;
};

function toHuman(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}

export default function AdminUserClient({ user }: { user: AdminUser }) {
  const [busy, setBusy] = useState<null | "role" | "status">(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [role, setRole] = useState<string>(user.role);
  const [status, setStatus] = useState<string>(user.accountStatus);
  const [reasonRole, setReasonRole] = useState("");
  const [reasonStatus, setReasonStatus] = useState("");

  const roleOptions = useMemo(() => ["NONE", "READ_ONLY", "SUPPORT", "ADMIN", "OWNER"], []);
  const statusOptions = useMemo(() => ["active", "pending", "suspended"], []);

  const changeRole = async () => {
    setError(null);
    setOk(null);
    const reason = reasonRole.trim();
    if (!reason) return setError("Reason is required.");
    if (!confirm("Confirm role change")) return;
    setBusy("role");
    try {
      await postJson(`/api/admin/users/${encodeURIComponent(user.userId)}/role`, { role, reason });
      setOk("Role updated.");
      setReasonRole("");
    } catch (e: any) {
      setError(e.message || "Failed to update role.");
    } finally {
      setBusy(null);
    }
  };

  const changeStatus = async () => {
    setError(null);
    setOk(null);
    const reason = reasonStatus.trim();
    if (!reason) return setError("Reason is required.");
    if (!confirm("Confirm status change")) return;
    setBusy("status");
    try {
      await postJson(`/api/admin/users/${encodeURIComponent(user.userId)}/status`, { status, reason });
      setOk("Status updated.");
      setReasonStatus("");
    } catch (e: any) {
      setError(e.message || "Failed to update status.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-600">Users</p>
          <h1 className="text-2xl font-semibold text-slate-900">{user.email}</h1>
          <p className="text-xs text-slate-600 font-mono">User ID: {user.userId}</p>
        </div>
        <Link href="/admin/users" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
          Back to users
        </Link>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}
      {ok ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{ok}</div> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Profile summary</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Created</p>
            <p className="mt-1 text-sm text-slate-900">{toHuman(user.createdAt)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Last active</p>
            <p className="mt-1 text-sm text-slate-900">{toHuman(user.lastActiveAt)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Roles and permissions</h2>
        <p className="text-sm text-slate-700">Role changes require a reason and are audited.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Reason</span>
            <input
              value={reasonRole}
              onChange={(e) => setReasonRole(e.target.value)}
              placeholder="Required"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            />
          </label>
        </div>
        <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={busy !== null} onClick={changeRole}>
          {busy === "role" ? "Updating..." : "Change role"}
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Account status</h2>
        <p className="text-sm text-slate-700">Status changes require a reason and are audited.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Reason</span>
            <input
              value={reasonStatus}
              onChange={(e) => setReasonStatus(e.target.value)}
              placeholder="Required"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            />
          </label>
        </div>
        <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={busy !== null} onClick={changeStatus}>
          {busy === "status" ? "Updating..." : "Change status"}
        </button>
      </section>
    </main>
  );
}


