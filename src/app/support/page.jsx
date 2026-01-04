import Link from "next/link";

export const metadata = {
  title: "Support and permissions",
  description: "Donate or request permission for commercial use while keeping the platform sustainable.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Support</p>
        <h1 className="text-3xl font-semibold text-slate-900">Support the templates and tools</h1>
        <p className="text-base text-slate-700">
          Donations keep the templates updated, tested, and accessible. They are optional, and you can still learn here without donating.
        </p>
        <p className="text-sm text-slate-700">
          Donations help sustain free access for everyone. They do not unlock features or create advantages.
        </p>
        <p className="text-sm text-slate-700">
          If you donate, Stripe handles the payment. I only receive the donation status and amount, plus your email if you are
          signed in.
        </p>
        <p className="text-sm text-slate-700">
          These resources are educational and planning aids. They are not legal advice and do not replace professional security
          testing. Only use them on systems and data where you have permission.
        </p>
        <p className="text-sm text-slate-700">
          If you want the full “why this exists” story (with a bit more personality and a bit less policy), start with{" "}
          <Link className="underline decoration-slate-300 underline-offset-4" href="/about">
            About
          </Link>{" "}
          and{" "}
          <Link className="underline decoration-slate-300 underline-offset-4" href="/trust-and-about">
            Trust & verification
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/support/donate"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Donate
          </Link>
          <Link
            href="/support/permission"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Request permission
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Pricing and credits
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What donations fund</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Template maintenance, accessibility checks, and export quality.</li>
            <li>New templates across AI, data, architecture, and delivery.</li>
            <li>Security and compliance reviews so you can use them at work.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-600">
            Donations are not a paid tier. They are a “keep the lights on and the quality high” contribution.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Commercial use and signatures</h2>
          <p className="mt-2 text-sm text-slate-700">
            Commercial exports keep attribution by default. If you need a different arrangement, submit a permission request.
            Donations do not change export permissions.
          </p>
          <p className="mt-2 text-xs text-slate-600">
            If you’re using these outputs in a regulated or safety-critical context: be sensible. Validate, peer review, and follow your
            organisation’s controls. Tools can help you think; they cannot inherit your accountability for you.
          </p>
        </div>
      </section>
    </main>
  );
}
