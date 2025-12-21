import Link from "next/link";

export const metadata = {
  title: "Thank you",
  description: "Donation received.",
};

export default function SupportSuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Support</p>
        <h1 className="text-3xl font-semibold text-slate-900">Thank you for supporting this work</h1>
        <p className="text-base text-slate-700">
          Your donation helps keep the site stable, secure, and improving. If you were signed in, your Supporter status will show shortly.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/templates" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Browse templates
          </Link>
          <Link href="/account/history" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            View my history
          </Link>
        </div>
      </section>
    </main>
  );
}


