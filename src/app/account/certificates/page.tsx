import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import CertificatesClient from "./ui.client";

export const dynamic = "force-dynamic";

const COURSES = [
  { courseId: "cybersecurity", title: "Cybersecurity" },
  { courseId: "ai", title: "AI" },
  { courseId: "software-architecture", title: "Software architecture" },
  { courseId: "data", title: "Data" },
  { courseId: "digitalisation", title: "Digitalisation" },
] as const;

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || "";
  if (!userId) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to view your certificates.</p>
      </div>
    );
  }

  const issuanceModel = (prisma as any).certificateIssuance as {
    findMany: (args: any) => Promise<any[]>;
  };
  const entitlementModel = (prisma as any).certificateEntitlement as {
    findMany: (args: any) => Promise<any[]>;
  };

  const [issuances, entitlements] = await Promise.all([
    issuanceModel.findMany({ where: { userId }, orderBy: { issuedAt: "desc" } }),
    entitlementModel.findMany({ where: { userId } }),
  ]);

  const entitlementByCourse = new Map<string, any>();
  for (const e of entitlements) entitlementByCourse.set(e.courseId, e);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Certificates</h1>
      <p className="mt-2 text-sm text-slate-600">
        Learning stays free. Certificates are optional paid recognition.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Issued certificates</h2>
        </div>
        <div className="p-4">
          {issuances.length === 0 ? (
            <p className="text-sm text-slate-600">No certificates issued yet.</p>
          ) : (
            <ul className="space-y-3">
              {issuances.map((c) => (
                <li key={c.certificateId} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{c.courseId}</div>
                    <div className="text-xs text-slate-600">{c.certificateId}</div>
                  </div>
                  <CertificatesClient kind="download" certificateId={c.certificateId} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Issue a certificate</h2>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {COURSES.map((c) => {
              const ent = entitlementByCourse.get(c.courseId);
              const status = ent?.status || "not_requested";
              return (
                <li key={c.courseId} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-600">Status: {status}</div>
                  </div>
                  {status === "issued" ? (
                    <span className="text-xs text-slate-600">Already issued</span>
                  ) : status === "eligible" ? (
                    <CertificatesClient kind="issue" courseId={c.courseId} />
                  ) : status === "pending_payment" ? (
                    <span className="text-xs text-slate-600">Payment pending</span>
                  ) : (
                    <span className="text-xs text-slate-600">Not requested</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}


