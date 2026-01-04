import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { getCourseTracks } from "@/lib/courses";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";
import CoursesList from "@/components/courses/CoursesList.client";

export async function getStaticProps() {
  const courses = getCourseTracks();

  return {
    props: { courses },
  };
}

export default function CoursesPage({ courses }) {
  const totalHours = courses.reduce((sum, c) => sum + (c.totalEstimatedHours || 0), 0);
  const totalLevels = courses.reduce((sum, c) => sum + (c.bands.length + 1), 0);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ransfordsnotes.com";
  const courseCount = Array.isArray(courses) ? courses.length : 0;

  // Generate structured data for courses
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ransford's Notes Courses",
    "description": "Notes with browser practice across multiple tracks including cybersecurity, data, software architecture, digitalisation, AI, and networking.",
    "numberOfItems": courses.length,
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "Ransford's Notes",
          "url": siteUrl,
        },
        "timeRequired": `PT${course.totalEstimatedHours}H`,
        "educationalLevel": "Professional",
        "courseCode": course.slug,
        "url": `${siteUrl}${course.overviewRoute}`,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": `${siteUrl}/courses`,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Courses - Ransford&apos;s Notes</title>
        <meta
          name="description"
          content={`Notes with browser practice across ${courseCount} focused tracks from foundations to advanced practice.`}
        />
        <meta property="og:title" content="Courses - Ransford's Notes" />
        <meta
          property="og:description"
          content={`Notes with browser practice across ${courseCount} focused tracks from foundations to advanced practice.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/courses`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Courses - Ransford's Notes" />
        <meta
          name="twitter:description"
          content={`Notes with browser practice across ${courseCount} focused tracks.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      <Layout
        title="Courses - Ransford's Notes"
        description="Notes with browser practice across multiple tracks from foundations to advanced practice."
      >
      <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}>
        {/* Hero Section */}
        <section className="space-y-5 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Courses
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Notes that build from foundations to advanced practice
            </h1>
            <p className="max-w-3xl text-base text-slate-700">
              {courseCount} focused tracks. Each track has a clear path from foundations to advanced practice, plus a summary with games and practical tools.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/my-cpd"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Track your CPD
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Open the labs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <Link href="/my-cpd/evidence" className="text-sm text-slate-600 underline hover:text-slate-900">
            Need evidence for work or accreditation? Open the CPD evidence view.
          </Link>
        </section>

        {/* Learning Flow Section */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Learning flow</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Clear intent and scope
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Data clarity (front matter + MDX)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Application guardrails (React/Next)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Technology controls (headers, client-side tools)
            </li>
          </ul>
        </section>

        {/* Courses List with Search and Filtering */}
        <CoursesList courses={courses} />

        {/* Quick Links Section */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Quick links</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/tools"
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 hover:bg-slate-100 transition"
            >
              <span className="font-semibold text-slate-900">Open the labs</span>
              <p className="mt-1 text-xs text-slate-600">Interactive tools and experiments</p>
            </Link>
            <Link
              href="/studios"
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 hover:bg-slate-100 transition"
            >
              <span className="font-semibold text-slate-900">Open studios</span>
              <p className="mt-1 text-xs text-slate-600">Guided workspaces</p>
            </Link>
            <Link
              href="/templates"
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 hover:bg-slate-100 transition"
            >
              <span className="font-semibold text-slate-900">Explore templates</span>
              <p className="mt-1 text-xs text-slate-600">Evidence-friendly outputs</p>
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 hover:bg-slate-100 transition"
            >
              <span className="font-semibold text-slate-900">Meet the author</span>
              <p className="mt-1 text-xs text-slate-600">Learn about Ransford</p>
            </Link>
          </div>
        </section>
      </MarketingPageTemplate>
    </Layout>
    </>
  );
}
