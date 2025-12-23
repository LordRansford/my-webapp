import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null | undefined) {
  try {
    return d ? d.toISOString().slice(0, 10) : "Unknown";
  } catch {
    return "Unknown";
  }
}

export default async function VerifyByHashPage(props: { params: Promise<{ certificateHash: string }> }) {
  const { certificateHash } = await props.params;
  const hash = String(certificateHash || "").trim();

  const cert = hash ? await (prisma as any).certificate.findUnique({ where: { certificateHash: hash } }) : null;
  if (!cert) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Certificate verification</h1>
        <p className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          Certificate not found or invalid
        </p>
      </main>
    );
  }

  const issuer = cert.issuer || "RansfordsNotes";
  const status = cert.status || "issued";
  const revoked = status === "revoked";
  const verifiedAt = new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Issued by {issuer}</div>
          <h1 className="text-2xl font-semibold text-slate-900">Certificate verification</h1>
          <div className="mt-2 text-sm text-slate-600">Verified at {verifiedAt}</div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Status</div>
            <div className={`mt-1 text-base font-semibold ${revoked ? "text-rose-700" : "text-emerald-700"}`}>
              {revoked ? "Revoked" : "Issued"}
            </div>
            {revoked ? (
              <div className="mt-2 text-sm text-slate-700">This certificate has been revoked by the issuer.</div>
            ) : null}
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Issuer</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{issuer}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Course</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{cert.courseId}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Course version</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{cert.courseVersion}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Issued</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{fmtDate(cert.issuedAt)}</div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Statement</div>
              <div className="mt-1 text-sm text-slate-700">
                This page verifies that a certificate was issued by RansfordsNotes for this course and version.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


