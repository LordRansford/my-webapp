"use client";

import { useEffect, useState } from "react";

type Token = {
  tokenId: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  templateId?: string | null;
  issuedAt: string;
  expiresAt?: string | null;
  notes?: string | null;
};

type Props = {
  initialTokens?: Token[];
};

export default function TemplatePermissionsClient({ initialTokens = [] }: Props) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ userId: "", templateId: "", expiresAt: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  const loadTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/permission-tokens");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Forbidden");
      setTokens(data.tokens || []);
    } catch (err: any) {
      setError(err.message || "Could not load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialTokens.length) {
      loadTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/permission-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.userId || null,
          templateId: form.templateId || null,
          expiresAt: form.expiresAt || null,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Could not create token");
      await loadTokens();
      setForm({ userId: "", templateId: "", expiresAt: "", notes: "" });
    } catch (err: any) {
      setError(err.message || "Could not create token");
    } finally {
      setLoading(false);
    }
  };

  const revokeToken = async (tokenId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/permission-tokens?tokenId=${encodeURIComponent(tokenId)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Could not revoke token");
      await loadTokens();
    } catch (err: any) {
      setError(err.message || "Could not revoke token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900">Template permissions</h1>
        <p className="text-sm text-slate-700">Issue and revoke permission tokens.</p>
      </header>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-800">
            User ID (optional)
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-base"
              value={form.userId}
              onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
              placeholder="user-123 or leave blank"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-800">
            Template ID (optional)
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-base"
              value={form.templateId}
              onChange={(e) => setForm((f) => ({ ...f, templateId: e.target.value }))}
              placeholder="template slug or leave blank"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-800">
            Expires at (ISO, optional)
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-base"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              placeholder="2026-01-01T00:00:00Z"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-800">
            Notes
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-base"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Who approved this"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={createToken}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            disabled={loading}
          >
            {loading ? "Working..." : "Create token"}
          </button>
          <button
            type="button"
            onClick={loadTokens}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        <p className="text-sm text-slate-600">Scope is fixed to commercial_remove_signature. Issuer is Ransford.</p>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-sm font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-2">Token</th>
              <th className="px-4 py-2">User / anon</th>
              <th className="px-4 py-2">Template</th>
              <th className="px-4 py-2">Issued</th>
              <th className="px-4 py-2">Expires</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.tokenId} className="border-t border-slate-100">
                <td className="px-4 py-2 font-mono text-sm text-slate-700">{t.tokenId}</td>
                <td className="px-4 py-2 text-sm text-slate-700">
                  {t.userId || "-"} / {t.anonymousUserId || "-"}
                </td>
                <td className="px-4 py-2">{t.templateId || "Any"}</td>
                <td className="px-4 py-2 text-sm text-slate-700">{new Date(t.issuedAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-slate-700">
                  {t.expiresAt ? new Date(t.expiresAt).toLocaleString() : "No expiry"}
                </td>
                <td className="px-4 py-2 text-sm text-slate-700">{t.notes || ""}</td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => revokeToken(t.tokenId)}
                    className="text-sm font-semibold text-rose-700 hover:underline"
                    disabled={loading}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            {!tokens.length && (
              <tr>
                <td className="px-4 py-3 text-sm text-slate-600" colSpan={7}>
                  No tokens issued yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </main>
  );
}
