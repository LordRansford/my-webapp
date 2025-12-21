import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getCertificateById } from "@/lib/certificates/store";

type Props = {
  found: boolean;
  certificate?: {
    certificateId: string;
    learnerName: string;
    courseTitle: string;
    hoursEarned: number;
    completionDate: string;
    issuedAt: string;
    status: "valid" | "revoked";
    provider: string;
  };
};

export default function CertificatePage({ found, certificate }: Props) {
  if (!found) {
    return (
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Certificate</p>
          <h1>Certificate not found</h1>
          <p className="lead">The requested certificate could not be located.</p>
        </header>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Certificate | {certificate?.courseTitle}</title>
      </Head>
      <main className="certificate-shell">
        <section className="certificate">
          <header className="certificate__header">
            <div>
              <p className="eyebrow">Ransford&apos;s Notes</p>
              <h1>Certificate of Completion</h1>
              <p className="muted">Professional learning record</p>
            </div>
            <div className="certificate__meta">
              <p><strong>Certificate ID:</strong> {certificate?.certificateId}</p>
              <p><strong>Status:</strong> {certificate?.status === "revoked" ? "Revoked" : "Valid"}</p>
            </div>
          </header>

          <div className="certificate__body">
            <p className="muted">This is to certify that</p>
            <p className="certificate__name">{certificate?.learnerName || "Learner"}</p>
            <p className="muted">has completed</p>
            <p className="certificate__course">{certificate?.courseTitle}</p>
            <div className="certificate__stats">
              <p><strong>CPD hours:</strong> {certificate?.hoursEarned}</p>
              <p><strong>Completion date:</strong> {new Date(certificate?.completionDate || "").toLocaleDateString()}</p>
              <p><strong>Issued:</strong> {new Date(certificate?.issuedAt || "").toLocaleDateString()}</p>
            </div>
          </div>

          <footer className="certificate__footer">
            <p className="muted">
              Issued by {certificate?.provider}. CPD hours are based on server verified completion signals and course estimated time.
              For verification, visit the public verification page and enter the certificate ID.
            </p>
            {certificate?.status === "revoked" ? (
              <p className="muted">Status: revoked. This certificate is no longer valid.</p>
            ) : null}
            <button type="button" className="button" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </footer>
        </section>
        <style jsx>{`
          .certificate-shell {
            min-height: 100vh;
            background: #f8fafc;
            padding: 24px;
          }
          .certificate {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            color: #0f172a;
          }
          .certificate__header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
          }
          .certificate__meta {
            text-align: right;
            font-size: 14px;
            color: #475569;
          }
          .certificate__body {
            margin-top: 24px;
            text-align: center;
          }
          .certificate__name {
            font-size: 28px;
            font-weight: 700;
            margin: 8px 0;
          }
          .certificate__course {
            font-size: 22px;
            font-weight: 600;
            margin: 8px 0 16px;
          }
          .certificate__stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-top: 16px;
            font-size: 14px;
            color: #334155;
          }
          .certificate__footer {
            margin-top: 24px;
            font-size: 13px;
            color: #475569;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          @media print {
            .button {
              display: none;
            }
            .certificate-shell {
              background: white;
              padding: 0;
            }
            .certificate {
              border: none;
              box-shadow: none;
            }
          }
        `}</style>
      </main>
    </>
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
        learnerName: cert.learnerName || "Learner",
        courseTitle: cert.courseTitle,
        hoursEarned: cert.hoursEarned,
        completionDate: cert.completionDate,
        issuedAt: cert.issuedAt,
        status: cert.revokedAt ? "revoked" : "valid",
        provider: "Ransford's Notes",
      },
    },
  };
};


