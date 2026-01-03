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

type SupportSnapshot = {
  learnerProfile?: { certificateName: string; lockedAt: string } | null;
  credits?: { balance: number; expiresAt: string | null } | null;
  creditLots?: Array<{ id: string; amountCredits: number; remainingCredits: number; source: string; createdAt: string; expiresAt: string | null }>;
  purchases?: Array<{ id: string; productId: string; stripeSessionId: string; status: string; createdAt: string }>;
  certificateEntitlements?: Array<{ id: string; courseId: string; status: string; stripeSessionId: string | null; updatedAt: string }>;
  certificates?: Array<{ id: string; courseId: string; courseVersion: string; issuedAt: string; certificateHash: string; status: string }>;
  assessmentAttempts?: Array<{ id: string; assessmentId: string; score: number; passed: boolean; timeSpent: number; completedAt: string; courseVersion: string }>;
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
  const [snapshot, setSnapshot] = useState<SupportSnapshot | null>(null);
  const [busySupport, setBusySupport] = useState<null | "snapshot" | "grant">(null);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState("");

  const roleOptions = useMemo(() => ["NONE", "READ_ONLY", "SUPPORT", "ADMIN", "OWNER"], []);
  const statusOptions = useMemo(() => ["active", "pending", "suspended"], []);

  const loadSnapshot = async () => {
    setBusySupport("snapshot");
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.userId)}/support-snapshot`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load support snapshot");
      setSnapshot({
        learnerProfile: data?.learnerProfile || null,
        credits: data?.credits ? { balance: Number(data.credits.balance || 0), expiresAt: data.credits.expiresAt || null } : null,
        creditLots: Array.isArray(data?.creditLots) ? data.creditLots : [],
        purchases: Array.isArray(data?.purchases) ? data.purchases : [],
        certificateEntitlements: Array.isArray(data?.certificateEntitlements) ? data.certificateEntitlements : [],
        certificates: Array.isArray(data?.certificates) ? data.certificates : [],
        assessmentAttempts: Array.isArray(data?.assessmentAttempts) ? data.assessmentAttempts : [],
      });
    } catch (e: any) {
      setError(e.message || "Failed to load support snapshot");
    } finally {
      setBusySupport(null);
    }
  };

  const grantUserCredits = async () => {
    setError(null);
    setOk(null);
    const reason = creditReason.trim();
    const credits = Math.max(0, Math.round(creditAmount || 0));
    if (!reason) return setError("Reason is required.");
    if (!credits) return setError("Credits must be greater than zero.");
    if (!confirm("Confirm credit grant")) return;
    setBusySupport("grant");
    try {
      const res = await postJson(`/api/admin/users/${encodeURIComponent(user.userId)}/credits/grant`, { credits, reason });
      setOk(`Credits granted. New balance ${res?.balance ?? "updated"}.`);
      setCreditAmount(0);
      setCreditReason("");
      await loadSnapshot();
    } catch (e: any) {
      setError(e.message || "Failed to grant credits.");
    } finally {
      setBusySupport(null);
    }
  };

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Support snapshot</h2>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            disabled={busySupport !== null}
            onClick={loadSnapshot}
          >
            {busySupport === "snapshot" ? "Loading..." : snapshot ? "Refresh" : "Load"}
          </button>
        </div>

        {snapshot ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">Certificate name</p>
                <p className="mt-1 text-sm text-slate-900">{snapshot.learnerProfile?.certificateName || "Not set"}</p>
                <p className="mt-1 text-xs text-slate-600">{snapshot.learnerProfile?.lockedAt ? `Locked ${toHuman(snapshot.learnerProfile.lockedAt)}` : ""}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">Credits</p>
                <p className="mt-1 text-sm text-slate-900">{snapshot.credits ? snapshot.credits.balance : 0}</p>
                <p className="mt-1 text-xs text-slate-600">{snapshot.credits?.expiresAt ? `Expires ${toHuman(snapshot.credits.expiresAt)}` : ""}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Grant credits</p>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Credits</span>
                  <input
                    type="number"
                    min={0}
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Reason</span>
                  <input
                    value={creditReason}
                    onChange={(e) => setCreditReason(e.target.value)}
                    placeholder="Required"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
                disabled={busySupport !== null}
                onClick={grantUserCredits}
              >
                {busySupport === "grant" ? "Granting..." : "Grant credits"}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Recent assessment attempts</p>
              {(snapshot.assessmentAttempts || []).length ? (
                <div className="space-y-2">
                  {(snapshot.assessmentAttempts || []).slice(0, 6).map((a) => (
                    <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-700">{a.passed ? "Pass" : "Not passed"}</div>
                      <div className="text-xs text-slate-700">Score {a.score} percent</div>
                      <div className="text-xs text-slate-600">{a.courseVersion}</div>
                      <div className="text-xs text-slate-600">{toHuman(a.completedAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No attempts recorded.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Certificate entitlements</p>
              {(snapshot.certificateEntitlements || []).length ? (
                <div className="space-y-2">
                  {(snapshot.certificateEntitlements || []).slice(0, 6).map((e) => (
                    <div key={e.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-700">{e.courseId}</div>
                      <div className="text-xs text-slate-700">{e.status}</div>
                      <div className="text-xs text-slate-600">{toHuman(e.updatedAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No entitlements.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Certificates</p>
              {(snapshot.certificates || []).length ? (
                <div className="space-y-2">
                  {(snapshot.certificates || []).slice(0, 6).map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-700">{c.courseId}</div>
                      <div className="text-xs text-slate-700">{c.status}</div>
                      <div className="text-xs text-slate-600">{c.courseVersion}</div>
                      <div className="text-xs text-slate-600">{toHuman(c.issuedAt)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No certificates issued.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-700">Load a single view of credits, purchases, attempts, and certificate state for support work.</p>
        )}
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


