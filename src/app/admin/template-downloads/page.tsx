import { cookies } from "next/headers";
import { listDownloads } from "@/lib/templates/store";

const ADMIN_KEY = process.env.ADMIN_DASHBOARD_TOKEN;

async function isAuthorised() {
  if (!ADMIN_KEY) return false;
  const token = (await cookies()).get?.("admin_token")?.value;
  return token === ADMIN_KEY;
}

export const dynamic = "force-dynamic";

export default async function TemplateDownloadsAdminPage() {
  if (!ADMIN_KEY) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Admin not configured</h1>
        <p className="text-sm text-slate-700">Set ADMIN_DASHBOARD_TOKEN and admin_token cookie to view this page.</p>
      </main>
    );
  }

  const authorised = await isAuthorised();
  if (!authorised) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-700">Provide the admin_token cookie that matches ADMIN_DASHBOARD_TOKEN.</p>
      </main>
    );
  }

  const downloads = listDownloads({}, 200);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900">Template downloads</h1>
        <p className="text-sm text-slate-700">Latest download attempts for templates.</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm text-left text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Template</th>
              <th className="px-4 py-2">Use</th>
              <th className="px-4 py-2">Support</th>
              <th className="px-4 py-2">Signature</th>
              <th className="px-4 py-2">User</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((d) => (
              <tr key={d.downloadId} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">{new Date(d.issuedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{d.templateId}</td>
                <td className="px-4 py-2">{d.requestedUse}</td>
                <td className="px-4 py-2">{d.supportMethod}</td>
                <td className="px-4 py-2">{d.signaturePolicyApplied}</td>
                <td className="px-4 py-2 text-xs text-slate-600">{d.userId || d.anonymousUserId || "anon"}</td>
              </tr>
            ))}
            {!downloads.length && (
              <tr>
                <td className="px-4 py-3 text-sm text-slate-600" colSpan={6}>
                  No downloads recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
