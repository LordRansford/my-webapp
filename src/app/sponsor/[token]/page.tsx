"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { findSponsorLink, courseSkillMappings } from "@/data/employers";

type PageProps = {
  params: Promise<{ token: string }>;
};

type ConsentState = {
  shareCertificate: boolean;
  sharedAt?: string;
};

export default async function SponsorAccessPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  return <SponsorAccess token={resolved.token} />;
}

function SponsorAccess({ token }: { token: string }) {
  const resolved = findSponsorLink(token);
  const [consent, setConsent] = useState<ConsentState>({ shareCertificate: false });

  useEffect(() => {
    if (!token) return;
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(`sponsor-consent-${token}`) : null;
    if (raw) {
      try {
        setConsent(JSON.parse(raw));
      } catch {
        setConsent({ shareCertificate: false });
      }
    }
  }, [token]);

  const persist = (next: ConsentState) => {
    setConsent(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`sponsor-consent-${token}`, JSON.stringify(next));
    }
  };

  const consented = consent.shareCertificate;

  const mappedCourses = useMemo(() => {
    if (!resolved) return [];
    return courseSkillMappings.filter((c) => resolved.link.allowedCourses.includes(c.courseId));
  }, [resolved]);

  if (!resolved) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-6 shadow-sm">
          <p className="text-lg font-semibold text-rose-800">Invalid sponsor link</p>
          <p className="text-sm text-rose-700">The link is not recognised or has expired.</p>
        </div>
      </main>
    );
  }

  const { employer, link } = resolved;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Sponsored access</p>
          <h1 className="text-2xl font-semibold text-slate-900">{employer.organisationName}</h1>
          <p className="text-sm text-slate-700">{link.label}</p>
          <p className="text-xs text-slate-600">
            {link.allowedCourses.length} courses • Completion data shared in aggregate only • Consent required for certificates
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Access token</p>
          <p className="text-sm font-semibold text-slate-900">{link.token}</p>
          {link.expiresAt && <p className="text-xs text-slate-600">Expires {link.expiresAt}</p>}
          {link.learnerCap && <p className="text-xs text-slate-600">Learner cap {link.learnerCap}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Sponsored learners" value={link.aggregates.learners} />
        <StatCard label="Completion rate" value={`${Math.round(link.aggregates.completionRate * 100)}%`} />
        <StatCard label="Average hours" value={`${link.aggregates.avgHours} hrs`} />
        <StatCard label="Certificates shared (opt-in)" value={link.aggregates.certificatesShared} />
      </div>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Consent to share a certificate</h2>
          <p className="text-sm text-slate-700">
            You stay in control. Certificates are only visible to this employer if you opt in. You can revoke at any time.
          </p>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Share certificate with {employer.organisationName}</p>
            <p className="text-xs text-slate-600">No personal notes or tool history is shared. Only the certificate page.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                persist({
                  shareCertificate: !consented,
                  sharedAt: !consented ? new Date().toISOString() : undefined,
                })
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                consented ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {consented ? "Revoke access" : "Share certificate"}
            </button>
          </div>
        </div>
        {consented ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Certificate sharing enabled</p>
            <p>
              Your certificate verification page is visible to {employer.organisationName}. You can turn this off at any time. Shared at{" "}
              {consent.sharedAt ? new Date(consent.sharedAt).toLocaleString() : "now"}.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <p className="font-semibold">Not shared</p>
            <p>Certificates remain private until you opt in.</p>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Included courses</h2>
          <p className="text-sm text-slate-700">
            Access applies to the courses and levels below. Employers only see aggregate completion stats.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {mappedCourses.map((course) => (
            <div key={course.courseId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{course.courseTitle}</p>
                  <p className="text-xs text-slate-600 capitalize">{course.roleTrack} track</p>
                  <p className="text-xs text-slate-600">Skills: {course.skills.join(", ")}</p>
                  <p className="text-xs text-slate-600">Frameworks: {course.frameworks.join(", ")}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Employer ready</span>
              </div>
              <p className="mt-2 text-xs text-slate-700">{course.employerStatement}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Trust and privacy</h2>
        <ul className="space-y-1 text-sm text-slate-700">
          <li>• Employers cannot edit your content or see private notes.</li>
          <li>• Aggregate stats only; personal data stays with you.</li>
          <li>• Certificates are shared only with explicit consent.</li>
          <li>• This is not an accredited qualification; it is skills evidence.</li>
        </ul>
        <p className="text-xs text-slate-600">
          Contact {employer.contactEmail} if you need the organisation to revoke a sponsor link. For platform privacy questions, contact
          support.
        </p>
        <Link href="/support" className="text-sm font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">
          Go to support
        </Link>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
