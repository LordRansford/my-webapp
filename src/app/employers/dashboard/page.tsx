import { courseSkillMappings, employers } from "@/data/employers";

function formatPct(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function EmployerDashboardPage() {
  const totalLearners = employers.reduce(
    (sum, emp) => sum + emp.sponsoredLinks.reduce((s, link) => s + link.aggregates.learners, 0),
    0
  );
  const totalHours = employers.reduce(
    (sum, emp) => sum + emp.sponsoredLinks.reduce((s, link) => s + (link.sponsoredHours || 0), 0),
    0
  );
  const totalCertificates = employers.reduce(
    (sum, emp) => sum + emp.sponsoredLinks.reduce((s, link) => s + link.aggregates.certificatesShared, 0),
    0
  );
  const averageCompletion =
    employers.length === 0
      ? 0
      : employers.reduce(
          (sum, emp) => sum + emp.sponsoredLinks.reduce((s, link) => s + link.aggregates.completionRate, 0),
          0
        ) /
        employers.reduce((sum, emp) => sum + emp.sponsoredLinks.length, 0);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Employers</p>
        <h1 className="text-2xl font-semibold text-slate-900">Employer verification dashboard</h1>
        <p className="text-sm text-slate-700">
          Read-only view for organisations. Shows sponsored access, aggregate outcomes, and skill mappings without exposing personal data.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Sponsored learners" value={totalLearners} />
        <Metric label="Avg completion rate" value={formatPct(averageCompletion)} />
        <Metric label="Sponsored hours (tracked)" value={`${totalHours.toLocaleString()} hrs`} />
        <Metric label="Certificates shared (opt-in)" value={totalCertificates} />
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Active sponsor links</h2>
          <p className="text-sm text-slate-700">Tokens grant course or level access. Employers see aggregate metrics only.</p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {employers.map((emp) =>
            emp.sponsoredLinks.map((link) => (
              <div key={link.token} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                    <p className="text-xs text-slate-600">{emp.organisationName}</p>
                    <p className="text-xs text-slate-600">
                      Courses: {link.allowedCourses.length} • Levels: {link.allowedLevels?.join(", ") || "all"}
                    </p>
                    {link.expiresAt && <p className="text-xs text-slate-600">Expires {link.expiresAt}</p>}
                    {link.learnerCap && <p className="text-xs text-slate-600">Learner cap {link.learnerCap}</p>}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      emp.status === "verified"
                        ? "bg-emerald-50 text-emerald-700"
                        : emp.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <span>Learners: {link.aggregates.learners}</span>
                  <span>Completion: {formatPct(link.aggregates.completionRate)}</span>
                  <span>Avg hours: {link.aggregates.avgHours}</span>
                  <span>Certificates: {link.aggregates.certificatesShared}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Skill mapping</h2>
          <p className="text-sm text-slate-700">
            Practical capabilities per course, mapped to common frameworks. Use plain language when discussing with HR or hiring managers.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {courseSkillMappings.map((course) => (
            <div key={course.courseId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{course.courseTitle}</p>
                  <p className="text-xs text-slate-600 capitalize">{course.roleTrack} roles</p>
                  <p className="text-xs text-slate-600">Skills: {course.skills.join(", ")}</p>
                  <p className="text-xs text-slate-600">Frameworks: {course.frameworks.join(", ")}</p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Mapped</span>
              </div>
              <p className="mt-2 text-xs text-slate-700">{course.employerStatement}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Trust signals</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {employers.map((emp) => (
            <div key={emp.employerId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{emp.organisationName}</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700">
                <li>Teaching: {emp.trustSignals.teachingPhilosophy}</li>
                <li>Assessment: {emp.trustSignals.assessmentTransparency}</li>
                <li>Updates: {emp.trustSignals.commitmentToUpdates}</li>
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600">
          This is not a regulated qualification. It provides evidence of skills applied in hands-on work. No endorsement is implied unless
          explicitly agreed in writing.
        </p>
      </section>

      <section className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Billing readiness</h2>
        <p className="text-sm text-slate-700">
          Flags and hooks are in place for sponsored access, tracking sponsored hours, and future Stripe events. Billing is not enabled yet.
        </p>
        <ul className="space-y-1 text-sm text-slate-700">
          <li>• Sponsored access tokens scoped to courses and levels.</li>
          <li>• Sponsored hours tracked per link (for future invoicing).</li>
          <li>• Event hook placeholders ready for Stripe enablement.</li>
        </ul>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
