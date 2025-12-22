import Link from "next/link";

export const metadata = {
  title: "How compute works",
  description: "Plain English compute guidance for labs and tools.",
};

export default function ComputeGuidancePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-4 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Compute</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">What compute means on this site</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Compute is a plain-English way to describe how much work a tool is doing. It is influenced by input size, run time, and whether the tool
          runs mainly in your browser or uses a small server helper.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Why browsers have limits</h2>
          <p className="mt-2 text-sm text-slate-700">
            Browsers share CPU, memory, battery, and thermals with everything else you are doing. Tools that push too hard can freeze tabs or drain
            devices. That is why the free tier concept is set slightly below typical safe limits.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Browser powered vs server assisted</h2>
          <p className="mt-2 text-sm text-slate-700">
            Browser powered tools run on your device and are typically fast and private. Server assisted tools use a bounded helper for lookups or
            transformations that browsers cannot do well.
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">What will remain free</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>All course notes and learning content.</li>
          <li>Lightweight tools and normal use within the free tier.</li>
        </ul>
        <h2 className="text-xl font-semibold text-slate-900">What may be limited later</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Very large inputs or files.</li>
          <li>Repeated heavy runs with the same settings.</li>
          <li>Advanced options that increase compute significantly.</li>
        </ul>
        <p className="text-sm text-slate-700">
          Limits are not enforced in this build. The goal right now is transparency so nothing is surprising later.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
          Pricing
        </Link>
        <Link href="/tools" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Explore tools
        </Link>
      </div>
    </main>
  );
}



