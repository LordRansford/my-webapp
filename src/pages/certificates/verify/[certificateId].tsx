import type { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import { getCertificateById } from "@/lib/certificates/store";

type Props = {
  found: boolean;
  certificate?: {
    certificateId: string;
    courseTitle: string;
    courseId: string;
    levelId: string;
    hoursEarned: number;
    completionDate: string;
    issuedAt: string;
    version: number;
    status: "valid" | "revoked";
    revokedAt?: string | null;
  };
};

export default function CertificateVerifyPage({ found, certificate }: Props) {
  return (
    <Layout title="Certificate verification" description="Verify a certificate by its ID.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Verification</p>
          <h1>Certificate verification</h1>
          <p className="lead">This page verifies a certificate ID and shows a safe summary.</p>
          <p className="muted text-sm">No personal data is shown here.</p>
        </header>

        <section className="section">
          {!found ? (
            <p className="muted">Certificate not found.</p>
          ) : (
            <div className="card">
              <p className="text-sm text-slate-700">
                <strong>Status</strong>: {certificate?.status === "revoked" ? "Revoked" : "Valid"}
                {certificate?.status === "revoked" && certificate?.revokedAt ? ` (revoked ${new Date(certificate.revokedAt).toLocaleDateString()})` : ""}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Certificate ID</strong>: {certificate?.certificateId}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Course</strong>: {certificate?.courseTitle}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Level</strong>: {certificate?.levelId}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Hours</strong>: {certificate?.hoursEarned}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Completion date</strong>: {new Date(certificate?.completionDate || "").toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-600">
                This summary does not include personal identifiers. It confirms a record exists for this certificate ID.
              </p>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const certificateId = String(ctx.params?.certificateId || "").trim();
  if (!certificateId) return { props: { found: false } };

  const cert = getCertificateById(certificateId);
  if (!cert) return { props: { found: false } };

  return {
    props: {
      found: true,
      certificate: {
        certificateId: cert.certificateId,
        courseTitle: cert.courseTitle,
        courseId: cert.courseId,
        levelId: cert.levelId,
        hoursEarned: cert.hoursEarned,
        completionDate: cert.completionDate,
        issuedAt: cert.issuedAt,
        version: cert.version,
        status: cert.revokedAt ? "revoked" : "valid",
        revokedAt: cert.revokedAt || null,
      },
    },
  };
};


