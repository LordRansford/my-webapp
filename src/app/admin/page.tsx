import Link from "next/link";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Admin Control Centre</p>
        <h1 className="text-3xl font-semibold text-slate-900">Overview</h1>
        <p className="text-slate-700 max-w-3xl">
          This area is intentionally minimal. It provides a secure foundation for admin work with server-side access enforcement and append-only audit logging.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Users", href: "/admin/users", note: "Placeholder. No user admin features yet." },
          { title: "Support", href: "/admin/support", note: "Placeholder. No support features yet." },
          { title: "Assessments", href: "/admin/assessments", note: "Manage questions and publishing for course assessments." },
          { title: "Billing", href: "/admin/billing", note: "Placeholder. No billing admin features yet." },
          { title: "System", href: "/admin/system", note: "Placeholder. System health tools will land later." },
          { title: "Architecture diagrams", href: "/admin/architecture-diagrams", note: "Existing read-only admin view." },
        ].map((x) => (
          <Link
            key={x.title}
            href={x.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <p className="text-sm font-semibold text-slate-900">{x.title}</p>
            <p className="mt-1 text-sm text-slate-700">{x.note}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}


