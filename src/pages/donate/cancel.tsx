import Link from "next/link";
import Layout from "@/components/Layout";

export default function DonateCancelPage() {
  return (
    <Layout title="Donation cancelled" description="No problem. You can continue learning at your own pace.">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p className="eyebrow">All good</p>
        <h1 className="text-3xl font-semibold text-slate-900">Donation was not completed</h1>
        <p className="mt-3 text-base text-slate-700 leading-relaxed">
          Thanks for checking it out. Keep exploring the notes and tools whenever you like. You can return to donate any time.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Return home
          </Link>
          <Link
            href="/donate"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Try again later
          </Link>
        </div>
      </div>
    </Layout>
  );
}
