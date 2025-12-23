import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminAccessDeniedPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 space-y-4">
      <p className="text-xs font-semibold text-slate-600">Admin</p>
      <h1 className="text-3xl font-semibold text-slate-900">Access denied</h1>
      <p className="text-slate-700">
        You do not have permission to access the admin area. If you believe this is a mistake, contact the site owner.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400">
          Return home
        </Link>
        <Link href="/signin" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Sign in
        </Link>
      </div>
    </div>
  );
}


