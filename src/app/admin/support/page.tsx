export const metadata = {
  title: "Admin: Support",
  robots: { index: false, follow: false },
};

import Link from "next/link";
import { listSupportTicketsAdminSafe } from "@/lib/admin/supportStore";

function toHuman(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; cursor?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const status = (sp.status === "open" || sp.status === "in_progress" || sp.status === "resolved" ? sp.status : null) as any;
  const category = (sp.category || "").trim() || null;
  const cursor = sp.cursor || null;
  const sort = sp.sort === "oldest" ? "oldest" : "newest";

  const { items, nextCursor } = await listSupportTicketsAdminSafe({ status, category, cursor, take: 20, sort });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Support</h1>
      <p className="text-slate-700">Triage support tickets. No deletion. Status changes and notes are audited.</p>

      <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-3 items-end" action="/admin/support">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Status</span>
          <select name="status" defaultValue={sp.status || ""} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">All</option>
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
          </select>
        </label>
        <label className="min-w-[240px] flex-1 space-y-1">
          <span className="text-xs font-semibold text-slate-700">Category</span>
          <input name="category" defaultValue={category || ""} placeholder="Optional" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Sort</span>
          <select name="sort" defaultValue={sort} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="newest">newest</option>
            <option value="oldest">oldest</option>
          </select>
        </label>
        <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Apply
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {["Ticket ID", "Category", "Status", "Email", "Created", "Updated"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{t.id}</td>
                <td className="px-4 py-3 text-slate-900">
                  <Link href={`/admin/support/${encodeURIComponent(t.id)}`} className="font-semibold text-emerald-700 hover:underline">
                    {t.category}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-900">{t.status}</td>
                <td className="px-4 py-3 text-slate-700">{t.email || "Unknown"}</td>
                <td className="px-4 py-3 text-slate-700">{toHuman(t.createdAt)}</td>
                <td className="px-4 py-3 text-slate-700">{toHuman(t.updatedAt)}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                  No tickets found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600">Tickets are immutable records. Only status and internal notes can change.</p>
        {nextCursor ? (
          <Link
            href={`/admin/support?status=${encodeURIComponent(sp.status || "")}&category=${encodeURIComponent(category || "")}&sort=${encodeURIComponent(sort)}&cursor=${encodeURIComponent(
              nextCursor
            )}`}
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


