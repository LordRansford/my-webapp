"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Attachment = { id: string; fileName: string; mimeType: string; sizeBytes: number; storageKey: string | null; createdAt: string };
type Note = { id: string; adminUserId: string; note: string; createdAt: string };
type Ticket = {
  id: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  category: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  notes: Note[];
};

function toHuman(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}

export default function AdminSupportTicketClient({ ticket }: { ticket: Ticket }) {
  const [busy, setBusy] = useState<null | "status" | "note">(null);
  const [status, setStatus] = useState(ticket.status);
  const [reasonStatus, setReasonStatus] = useState("");
  const [note, setNote] = useState("");
  const [reasonNote, setReasonNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const statusOptions = useMemo(() => ["open", "in_progress", "resolved"], []);

  const changeStatus = async () => {
    setError(null);
    setOk(null);
    const reason = reasonStatus.trim();
    if (!reason) return setError("Reason is required.");
    if (!confirm("Confirm status change")) return;
    setBusy("status");
    try {
      await postJson(`/api/admin/support/${encodeURIComponent(ticket.id)}/status`, { status, reason });
      setOk("Status updated. Refresh the page to see updated timestamps.");
      setReasonStatus("");
    } catch (e: any) {
      setError(e.message || "Failed to update status.");
    } finally {
      setBusy(null);
    }
  };

  const addNote = async () => {
    setError(null);
    setOk(null);
    const r = reasonNote.trim();
    const n = note.trim();
    if (!n) return setError("Note is required.");
    if (!r) return setError("Reason is required.");
    if (!confirm("Confirm add note")) return;
    setBusy("note");
    try {
      await postJson(`/api/admin/support/${encodeURIComponent(ticket.id)}/note`, { note: n, reason: r });
      setOk("Note added. Refresh the page to see it.");
      setNote("");
      setReasonNote("");
    } catch (e: any) {
      setError(e.message || "Failed to add note.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-600">Support</p>
          <h1 className="text-2xl font-semibold text-slate-900">{ticket.category}</h1>
          <p className="text-xs text-slate-600 font-mono">Ticket ID: {ticket.id}</p>
        </div>
        <Link href="/admin/support" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
          Back to support
        </Link>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}
      {ok ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{ok}</div> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Ticket</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">From</p>
            <p className="mt-1 text-sm text-slate-900">{ticket.email || "Unknown"}</p>
            <p className="mt-1 text-xs text-slate-600">{ticket.name || "No name provided"}</p>
            <p className="mt-1 text-xs text-slate-600">User ID: {ticket.userId || "Anonymous"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Timeline</p>
            <p className="mt-1 text-xs text-slate-600">Created: {toHuman(ticket.createdAt)}</p>
            <p className="mt-1 text-xs text-slate-600">Updated: {toHuman(ticket.updatedAt)}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Status: {ticket.status}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-700">Message</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{ticket.message}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
        <p className="text-sm text-slate-700">
          Attachments are treated as untrusted content. This UI does not render them inline. Use download only.
        </p>
        <div className="space-y-2">
          {ticket.attachments.length ? (
            ticket.attachments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.fileName}</p>
                  <p className="text-xs text-slate-600">
                    {a.mimeType} · {Math.round(a.sizeBytes / 1024)} KB · {toHuman(a.createdAt)}
                  </p>
                </div>
                <a
                  href={`/api/admin/support/${encodeURIComponent(ticket.id)}/attachments/${encodeURIComponent(a.id)}`}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No attachments.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Status</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">New status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Reason</span>
            <input value={reasonStatus} onChange={(e) => setReasonStatus(e.target.value)} placeholder="Required" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
          </label>
        </div>
        <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={busy !== null} onClick={changeStatus}>
          {busy === "status" ? "Updating..." : "Change status"}
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Admin notes</h2>
        <p className="text-sm text-slate-700">Notes are internal only. Adding a note requires a reason and is audited.</p>
        <div className="space-y-2">
          {ticket.notes.length ? (
            ticket.notes.map((n) => (
              <div key={n.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">Admin user: {n.adminUserId}</p>
                <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{n.note}</p>
                <p className="mt-2 text-xs text-slate-600">{toHuman(n.createdAt)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No notes.</p>
          )}
        </div>

        <div className="grid gap-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Note</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Reason</span>
            <input value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} placeholder="Required" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
          </label>
        </div>
        <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={busy !== null} onClick={addNote}>
          {busy === "note" ? "Saving..." : "Add note"}
        </button>
      </section>
    </main>
  );
}


