export const metadata = {
  title: "Admin: Users",
  robots: { index: false, follow: false },
};

import Link from "next/link";
import { listUsersAdminSafe } from "@/lib/admin/usersStore";

function toHuman(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; cursor?: string; sort?: string; dir?: string }>;
}) {
  const sp = await searchParams;
  const search = (sp.search || "").trim();
  const cursor = sp.cursor || null;
  const sort = (sp.sort as any) || "created";
  const dir = (sp.dir as any) || "desc";

  const { items, nextCursor } = await listUsersAdminSafe({
    search,
    cursor,
    take: 20,
    sortKey: sort === "lastActive" || sort === "role" ? sort : "created",
    sortDir: dir === "asc" ? "asc" : "desc",
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
      <p className="text-slate-700">Search, review, and open a user for safe role and status changes.</p>

      <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-3 items-end" action="/admin/users">
        <label className="min-w-[240px] flex-1 space-y-1">
          <span className="text-xs font-semibold text-slate-700">Search</span>
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by email"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <option value="created">Created</option>
            <option value="lastActive">Last active</option>
            <option value="role">Role</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Direction</span>
          <select
            name="dir"
            defaultValue={dir}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
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
              {["User ID", "Email", "Role", "Status", "Created", "Last active"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.userId} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{u.userId}</td>
                <td className="px-4 py-3 text-slate-900">
                  <Link href={`/admin/users/${encodeURIComponent(u.userId)}`} className="font-semibold text-emerald-700 hover:underline">
                    {u.email}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-900">{u.role}</td>
                <td className="px-4 py-3 text-slate-900">{u.accountStatus}</td>
                <td className="px-4 py-3 text-slate-700">{toHuman(u.createdAt)}</td>
                <td className="px-4 py-3 text-slate-700">{toHuman(u.lastActiveAt)}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600">Only safe fields are shown. Admin actions require a reason and are audited.</p>
        {nextCursor ? (
          <Link
            href={`/admin/users?search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}&dir=${encodeURIComponent(dir)}&cursor=${encodeURIComponent(
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


