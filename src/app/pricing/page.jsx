import Link from "next/link";
import { ComingSoonPurchase } from "@/components/pricing/ComingSoonPurchase";
import { CREDIT_MS_PER_1, FREE_TIER_MS_PER_DAY } from "@/lib/billing/creditsConfig";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Pricing - Fair and Transparent",
  description: "Plans that keep the notes free and the tooling sustainable. No hidden costs, no dark patterns, just honest pricing.",
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
      <section className="space-y-6 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pricing</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-900">Keep it useful. Keep it honest.</h1>
        </div>
        <p className="max-w-3xl text-lg leading-relaxed text-slate-700">
          Everything educational stays open. Supporters fund the unglamorous bits: hosting, security maintenance, tool improvements, new templates,
          and accessibility polish. No guilt trips. Just a clear deal.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About the Creator
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Explore Free Courses
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Plans">
        {/* Free Tier */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Free</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              All notes, quizzes, and lightweight tools. Forever.
            </p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">£0</p>
            <p className="mt-1 text-xs text-slate-500">Always free</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>All learning content and courses</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Interactive quizzes</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Browser-based tools and playgrounds</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Template previews</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              href="/courses"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-slate-900 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50"
            >
              Start Learning Free
            </Link>
          </div>
        </div>

        {/* Supporter Tier */}
        <div className="relative rounded-3xl border-2 border-slate-900 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.15)] transition-all hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="inline-flex rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
              Recommended
            </div>
          </div>
          <div className="mb-4 mt-2">
            <h2 className="text-2xl font-bold text-slate-900">Supporter</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Help sustain the platform and access premium features.
            </p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">£10</p>
            <p className="mt-1 text-xs text-slate-500">Minimum top-up (when launched)</p>
          </div>
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs font-semibold text-amber-900 flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Payments not enabled yet. Everything is currently free to explore during early phase.</span>
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Everything in Free</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Premium template downloads</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>History export capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Advanced analytics dashboards</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Larger compute limits for heavy tools</span>
            </li>
          </ul>
          <div className="mt-6 space-y-2">
            <ComingSoonPurchase label="Buy credits (coming soon)" />
            <div className="flex gap-2">
              <Link
                href="/templates"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-50"
              >
                Browse templates
              </Link>
              <Link
                href="/support/donate"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-50"
              >
                Donate
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Donations help sustain free access for everyone. They do not unlock features or create advantages.
          </p>
        </div>

        {/* Pro Tier */}
        <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-7 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Pro</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Team accounts and enterprise features.
            </p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">TBA</p>
            <p className="mt-1 text-xs text-slate-500">Pricing to be announced</p>
          </div>
          <div className="mb-4 rounded-xl bg-slate-100 border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-700">
              Coming later. Team features and enterprise tooling planned for future release.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Everything in Supporter</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Team collaboration features</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Enterprise-grade tooling</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority support</span>
            </li>
          </ul>
          <div className="mt-6">
            <button
              disabled
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
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

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">CPD certificates</h2>
        <div className="mt-4 space-y-4 text-base text-slate-700">
          <p>
            Learning stays free. Payment is for formal assessment, verification, and certificates you can use professionally.
          </p>
          <p>
            CPD certification pricing helps keep the site free for everyone and funds updates, question maintenance, and quality assurance.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What you get
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Formal assessment and verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Professional CPD certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Verifiable credentials for career use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Evidence pack for professional development</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quality assurance
              </h3>
              <p className="mt-3 text-sm text-slate-700">
                Created by Ransford Chung Amponsah, <strong>CEng MIMechE</strong> and <strong>TOGAF® Practitioner</strong>. 
                All content is reviewed to professional engineering standards and aligned with recognised frameworks.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                Learn about the creator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Transparency Section */}
      <section className="mt-10 rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white">Built by a practitioner, for practitioners</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-100">
          <p>
            This platform is created and maintained by <strong>Ransford Chung Amponsah</strong>, a Chartered Engineer 
            (CEng) with the Institution of Mechanical Engineers, TOGAF® Certified Practitioner, and IMechE Council Member.
          </p>
          <p>
            The site exists to make technical education genuinely accessible—especially for neurodivergent learners and 
            anyone who needs clarity over clever jargon. Every course, tool, and template is built with real-world 
            practice in mind.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100"
            >
              Read full background
            </Link>
            <a
              href="https://www.linkedin.com/in/ransford-amponsah-ceng-mimeche-togaf%C2%AE-79489a105/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn profile
            </a>
          </div>
        </div>
      </section>
    </MarketingPageTemplate>
  );
}


