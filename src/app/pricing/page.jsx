import Link from "next/link";
import { ComingSoonPurchase } from "@/components/pricing/ComingSoonPurchase";
import { CREDIT_MS_PER_1, FREE_TIER_MS_PER_DAY } from "@/lib/billing/creditsConfig";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Pricing",
  description: "Plans that keep the notes free and the tooling sustainable.",
};

export default function PricingPage() {
  const heavyMs = 120_000;
  const standardMs = 30_000;
  const heavyCredits = Math.ceil(heavyMs / CREDIT_MS_PER_1);
  const standardCredits = Math.ceil(standardMs / CREDIT_MS_PER_1);
  const tenCreditsHeavyRuns = heavyCredits ? Math.floor(10 / heavyCredits) : 0;
  const tenCreditsStandardRuns = standardCredits ? Math.floor(10 / standardCredits) : 0;
  const freePerDaySeconds = Math.round(FREE_TIER_MS_PER_DAY / 1000);
  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}>
      <section className="space-y-4 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pricing</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">Keep it useful. Keep it honest.</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Everything educational stays open. Supporters fund the unglamorous bits: hosting, security maintenance, tool improvements, new templates,
          and accessibility polish. No guilt trips. Just a clear deal.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Who’s behind this?
          </Link>
          <Link
            href="/trust-and-about"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Trust & verification
          </Link>
        </div>
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
            Payments are not enabled yet. You can explore everything freely during this early phase. Later, credits will apply only to compute above
            the free tier. Minimum top-up will be £10 when payments launch.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-800">
            <li>Premium template downloads</li>
            <li>History export</li>
            <li>Advanced dashboards</li>
            <li>Larger limits on heavy tools</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <ComingSoonPurchase label="Buy credits" />
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Browse templates
            </Link>
            <Link
              href="/support/donate"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Donate
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Donations help sustain free access for everyone. They do not unlock features or create advantages.
          </p>
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

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Why keep learning free?</h2>
        <p className="mt-2 text-sm text-slate-700">
          Because the world already has enough “pay to unlock the introduction” nonsense. The goal here is depth, clarity, and consistency (and
          that works best when the learning content is accessible to anyone who is willing to do the work.
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Paid features are limited to the expensive bits: compute above the free tier, and later on, formal assessment/verification work where
          appropriate.
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Credits and compute</h2>
        <p className="mt-2 text-sm text-slate-700">
          Everything educational stays free. Credits only apply to compute above the free tier. Tools show an estimate before you run and a summary after.
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Credits are abstract units, not money. Estimates vary with input size, run time, and features.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">What is always free</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
              <li>All notes and course pages</li>
              <li>Quizzes and reading</li>
              <li>Runs that fit inside the free tier</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">What can consume credits</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
              <li>Large inputs (files or long text)</li>
              <li>Long run times</li>
              <li>Advanced options that do deeper analysis</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">What £10 can typically do</p>
          <p className="mt-2 text-sm text-slate-700">
            When payments launch, the minimum top-up will be £10. In normal use, that should cover many medium runs that exceed the free tier, plus a
            smaller number of large runs. The exact number varies by tool and input size.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Using current settings, the free tier includes about {freePerDaySeconds}s of server assisted compute per day. Above that, one credit covers about {Math.round(CREDIT_MS_PER_1 / 1000)}s.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Example estimates: 10 credits is roughly {tenCreditsStandardRuns} standard runs (about 30s) or {tenCreditsHeavyRuns} heavy runs (about 2 minutes). These are estimates, not promises.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/compute"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            How compute works
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">CPD certificates</h2>
        <p className="mt-2 text-sm text-slate-700">
          Learning stays free. Payment is for formal assessment, verification, and certificates you can use professionally.
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Pricing also helps keep the site free for everyone and funds updates, question maintenance, and quality assurance.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          No external endorsement is implied unless explicitly stated with supporting documentation.
        </p>
      </section>
    </MarketingPageTemplate>
  );
}


