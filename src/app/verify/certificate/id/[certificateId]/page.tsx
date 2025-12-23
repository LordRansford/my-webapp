import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { getCertificatePdfBytes } from "@/lib/storage/certificates";

export const dynamic = "force-dynamic";

function sha256Hex(bytes: Uint8Array) {
  return crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

function getMetaString(meta: any, key: string) {
  const v = meta && typeof meta === "object" ? meta[key] : null;
  return typeof v === "string" ? v : "";
}

function getMetaNumber(meta: any, key: string): number | null {
  const v = meta && typeof meta === "object" ? meta[key] : null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function VerifyCertificateByIdPage(props: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await props.params;
  const id = String(certificateId || "").trim();

  const issuanceModel = (prisma as any).certificateIssuance as {
    findUnique: (args: any) => Promise<any>;
  };

  const issuance = await issuanceModel.findUnique({ where: { certificateId: id } });
  if (!issuance) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Certificate verification</h1>
        <p className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">Certificate not found or invalid</p>
      </main>
    );
  }

  let integrityOk = false;
  try {
    const bytes = await getCertificatePdfBytes({ key: issuance.pdfStorageKey });
    const computed = sha256Hex(bytes);
    integrityOk = computed === issuance.pdfSha256;
  } catch {
    integrityOk = false;
  }

  if (!integrityOk) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Certificate verification</h1>
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Certificate integrity check failed</p>
      </main>
    );
  }

  const meta = issuance.metadata || {};
  const holderName = getMetaString(meta, "learnerName") || "Learner";
  const courseTitle = getMetaString(meta, "courseTitle") || issuance.courseId;
  const cpdHours = getMetaNumber(meta, "cpdHours");
  const issuedAt = issuance.issuedAt ? new Date(issuance.issuedAt).toISOString().slice(0, 10) : "";
  const revoked = Boolean(issuance.revokedAt);
  const verifiedAt = new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Issued by RansfordsNotes</div>
          <h1 className="text-2xl font-semibold text-slate-900">Certificate verification</h1>
          <div className="mt-2 text-sm text-slate-600">Verified at {verifiedAt}</div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Status</div>
            <div className={`mt-1 text-base font-semibold ${revoked ? "text-rose-700" : "text-emerald-700"}`}>
              {revoked ? "Revoked" : "Valid"}
            </div>
            {revoked ? <div className="mt-2 text-sm text-slate-700">This certificate has been revoked and is no longer valid.</div> : null}
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Certificate holder</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{holderName}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Course</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{courseTitle}</div>
                <div className="text-xs text-slate-600">{issuance.courseId}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD hours</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{cpdHours && cpdHours > 0 ? cpdHours : "Not specified"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Issue date</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{issuedAt || "Unknown"}</div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Certificate ID</div>
              <div className="mt-1 font-mono text-sm text-slate-900">{issuance.certificateId}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


