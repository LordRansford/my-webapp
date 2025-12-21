import Link from "next/link";

export const metadata = {
  title: "Donation cancelled",
  description: "Donation not completed.",
};

export default function SupportCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Support</p>
        <h1 className="text-3xl font-semibold text-slate-900">Donation cancelled</h1>
        <p className="text-base text-slate-700">Nothing was charged. If you want to try again, you can return to the donation page.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/support/donate" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Try again
          </Link>
          <Link href="/support" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Back to support
          </Link>
        </div>
      </section>
    </main>
  );
}


