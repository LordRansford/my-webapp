import Link from "next/link";
import Layout from "@/components/Layout";

export default function DonateSuccessPage() {
  return (
    <Layout title="Donation successful" description="Thank you for supporting Ransford's Notes.">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p className="eyebrow">Thank you</p>
        <h1 className="text-3xl font-semibold text-slate-900">Your donation was received</h1>
        <p className="mt-3 text-base text-slate-700 leading-relaxed">
          Your support keeps the labs online and pays for the careful testing that makes these resources trustworthy. No upsell, just gratitude.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Return home
          </Link>
          <Link
            href="/templates"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Explore templates
          </Link>
        </div>
      </div>
    </Layout>
  );
}
