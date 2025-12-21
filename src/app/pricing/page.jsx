import Link from "next/link";

export const metadata = {
  title: "Pricing",
  description: "Plans that keep the notes free and the tooling sustainable.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-4 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pricing</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">Keep it useful. Keep it honest.</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Everything educational stays open. Supporters fund the unglamorous bits: hosting, security maintenance, tool improvements, new templates,
          and accessibility polish. No guilt trips. Just a clear deal.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Plans">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Free</h2>
          <p className="mt-1 text-sm text-slate-700">All notes, quizzes, and lightweight tools.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-800">
            <li>All learning content</li>
            <li>Quizzes</li>
            <li>Lightweight tools</li>
            <li>Browse templates and previews</li>
          </ul>
          <p className="mt-4 text-xs text-slate-600">Price: £0</p>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Recommended</div>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">Supporter</h2>
          <p className="mt-1 text-sm text-slate-700">
            Unlock premium template downloads and higher limits. You also keep this project alive, which is oddly satisfying.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-800">
            <li>Premium template downloads</li>
            <li>History export</li>
            <li>Advanced dashboards</li>
            <li>Larger limits on heavy tools</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/support/donate"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Support this work
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Browse templates
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-600">Payments are not enabled in this build yet.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Pro</h2>
          <p className="mt-1 text-sm text-slate-700">Coming soon. Team accounts and enterprise tooling later.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-800">
            <li>Everything in Supporter</li>
            <li>Team features (later)</li>
            <li>Enterprise tools (later)</li>
          </ul>
          <p className="mt-4 text-xs text-slate-600">Status: coming soon</p>
        </div>
      </section>
    </main>
  );
}


