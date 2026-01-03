import Link from "next/link";
import Layout from "@/components/Layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export default function CybersecurityCpdPrepPage(props: { access: "locked" | "active" | "expired"; startedAtIso?: string }) {
  const startedAt = props.startedAtIso ? new Date(props.startedAtIso) : null;
  const days = startedAt ? daysBetween(new Date(), startedAt) : null;

  return (
    <Layout title="Cybersecurity CPD prep pack" description="Extra practice flows for CPD candidates">
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Cybersecurity</p>
          <h1 className="text-3xl font-semibold text-slate-900">CPD prep pack</h1>
          <p className="text-slate-700">
            This is designed to make your assessment preparation faster and more reliable without exposing live exam questions.
            Access is for one year from purchase, subject to availability.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/cybersecurity" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Back to course
            </Link>
            <Link href="/cybersecurity/assessment/foundations" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Take an assessment
            </Link>
            <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Pricing
            </Link>
          </div>
        </header>

        {props.access === "locked" ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm space-y-2">
            <h2 className="text-lg font-semibold text-amber-900">Locked</h2>
            <p className="text-sm text-amber-900">
              This pack unlocks after you purchase CPD assessment access. This keeps learning free for everyone.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/pricing" className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
                View pricing
              </Link>
              <Link href="/cybersecurity/assessment/foundations" className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100">
                Start CPD assessment
              </Link>
            </div>
          </section>
        ) : null}

        {props.access === "expired" ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm space-y-2">
            <h2 className="text-lg font-semibold text-rose-900">Access expired</h2>
            <p className="text-sm text-rose-900">
              Your CPD prep access is limited to one year from first activation. If you need an extension, purchase a new assessment window.
            </p>
            {days !== null ? <p className="text-xs font-semibold text-rose-900">Days since activation: {days}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Link href="/pricing" className="rounded-full bg-rose-900 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800">
                Renew access
              </Link>
            </div>
          </section>
        ) : null}

        {props.access === "active" ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Readiness map</h2>
              <p className="text-sm text-slate-700">
                Use this to focus revision. If you cannot explain an item in one minute, click into the linked notes and repeat with a tool.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { title: "Foundations", href: "/cybersecurity/beginner", items: ["CIA in plain language", "Passwords and MFA habits", "Threats and attack surface"] },
                  { title: "Applied", href: "/cybersecurity/intermediate", items: ["Threat modelling as design", "Auth and sessions", "Logging signals and triage"] },
                  { title: "Practice", href: "/cybersecurity/advanced", items: ["Zero trust trade offs", "Supply chain risk", "Detection and response judgement"] },
                  { title: "Exam craft", href: "/pricing", items: ["Time boxing per question", "Eliminate options, then confirm", "Write why the wrong option is wrong"] },
                ].map((card) => (
                  <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-base font-semibold text-slate-900">{card.title}</div>
                      <Link href={card.href} className="text-sm font-semibold text-emerald-700 hover:underline">
                        Open
                      </Link>
                    </div>
                    <ol className="mt-2 ml-5 list-decimal space-y-1 text-sm text-slate-700">
                      {card.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Practice workflows</h2>
              <p className="text-sm text-slate-700">
                These are payworthy because they turn revision into repeatable habits. They do not mirror the live bank.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: "Threat model sprint", href: "/templates/cybersecurity/threat-model", note: "Run one feature through assets, threats, controls, verification." },
                  { title: "Incident review drill", href: "/tools/cyber/incident-post-mortem-builder", note: "Practise decision making and evidence quality." },
                  { title: "Risk register discipline", href: "/tools/cyber/risk-register-builder", note: "Train prioritisation and mitigation clarity." },
                ].map((x) => (
                  <div key={x.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-base font-semibold text-slate-900">{x.title}</div>
                    <div className="mt-2 text-sm text-slate-700">{x.note}</div>
                    <div className="mt-3">
                      <Link href={x.href} className="text-sm font-semibold text-emerald-700 hover:underline">
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">How to use Professor Ransford for CPD</h2>
              <p className="text-sm text-slate-700">
                Use Professor Ransford to explain concepts and point you to the right sections. During exams it is paused.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Ask for revision plans, tool usage guidance, and plain language explanations. Do not paste questions.
              </div>
            </section>
          </>
        ) : null}
      </main>
    </Layout>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions).catch(() => null);
  const userId = session?.user?.id || null;
  if (!userId) {
    return {
      redirect: {
        destination: `/signin?callbackUrl=${encodeURIComponent("/cybersecurity/cpd-prep")}`,
        permanent: false,
      },
    };
  }

  const entitlement = await prisma.certificateEntitlement
    .findFirst({
      where: { userId, courseId: "cybersecurity" },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    })
    .catch(() => null as any);

  // If there is no entitlement yet, treat as locked.
  if (!entitlement?.createdAt) return { props: { access: "locked" } };

  const startedAt = entitlement.createdAt as Date;
  const expired = daysBetween(new Date(), startedAt) > 365;
  return { props: { access: expired ? "expired" : "active", startedAtIso: startedAt.toISOString() } };
}

