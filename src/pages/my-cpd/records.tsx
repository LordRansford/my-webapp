import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import AccessGate from "@/components/AccessGate";
import { getCpdCertificateCredits } from "@/lib/cpd/certificateCredits";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

type LearningRecord = {
  userId: string;
  courseId: string;
  levelId: string;
  sectionsCompleted: number;
  quizzesCompleted: number;
  toolsUsed: number;
  timeSpentMinutes: number;
  completionStatus: "not_started" | "in_progress" | "completed";
  completionDate: string | null;
  updatedAt: string;
};

export default function LearningRecordsPage() {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/learning/records");
        if (!res.ok) {
          setMessage("Sign in to view your learning records.");
          setRecords([]);
          return;
        }
        const data = await res.json();
        setRecords(Array.isArray(data?.records) ? data.records : []);
      } catch {
        setMessage("Could not load learning records.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBalance(typeof d?.balance === "number" ? d.balance : 0);
      })
      .catch(() => setBalance(0));
  }, []);

  const totalHours = useMemo(() => {
    const minutes = records.reduce((sum, r) => sum + (Number(r.timeSpentMinutes) || 0), 0);
    return Math.round((minutes / 60) * 10) / 10;
  }, [records]);

  const issueCertificate = async (courseId: string, levelId: string) => {
    setIssuing(`${courseId}:${levelId}`);
    try {
      const fullCourseId = `${courseId}:${levelId}`;
      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId: fullCourseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.message || "Unable to issue certificate.");
        return;
      }
      const pdfUrl = typeof data?.pdfUrl === "string" ? data.pdfUrl : null;
      const verifyUrl = typeof data?.verifyUrl === "string" ? data.verifyUrl : null;
      if (pdfUrl) window.location.href = pdfUrl;
      else if (verifyUrl) window.location.href = verifyUrl;
    } catch {
      setMessage("Unable to issue certificate.");
    } finally {
      setIssuing(null);
    }
  };

  return (
    <Layout title="Learning records" description="Server verified learning records and CPD evidence summary.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">My CPD</p>
          <h1>Learning records</h1>
          <p className="lead">This page shows server-derived learning records. Hours are calculated conservatively.</p>
          <p className="muted">
            Calculation method: earned minutes are based on completed sections, quizzes, and tool usage, capped by the course estimated hours.
            Manual hours are not accepted for certificates.
          </p>
          <div className="actions">
            <Link href="/my-cpd/evidence" className="button">
              CPD evidence text
            </Link>
          </div>
        </header>

        <section className="section">
          {loading ? <p className="muted">Loading.</p> : null}
          {message ? <p className="muted">{message}</p> : null}
          {!loading && !message ? (
            <>
              <p className="muted">Total earned hours (all records): {totalHours}</p>
              {records.length === 0 ? (
                <p className="muted">No records yet. Complete sections and quizzes, then refresh a record from a course page.</p>
              ) : (
                <div className="card-grid">
                  {records.map((r) => (
                    <div key={`${r.courseId}:${r.levelId}`} className="card">
                      <h3>{r.courseId} {r.levelId}</h3>
                      <p className="muted">Status: {r.completionStatus}</p>
                      <p className="muted">
                        Sections completed: {r.sectionsCompleted} · Quizzes: {r.quizzesCompleted} · Tools used: {r.toolsUsed}
                      </p>
                      <p className="muted">Earned hours: {Math.round((r.timeSpentMinutes / 60) * 10) / 10}</p>
                      {r.completionDate ? <p className="muted">Completion date: {new Date(r.completionDate).toLocaleDateString()}</p> : null}
                      <div className="actions">
                        <AccessGate
                          requiredLevel="supporter"
                          fallbackMessage="Sign in to get a CPD certificate for this course."
                          showUpgradeHint
                        >
                          <p className="muted" style={{ marginTop: 0 }}>
                            Everything on RansfordsNotes is free to learn and use. We only charge for extra compute and for issuing CPD certificates.
                          </p>
                          <p className="muted" style={{ marginTop: 0 }}>
                            You are purchasing certificate issuance. This covers identity linked issuance, a downloadable PDF, and a public verification page.
                          </p>
                          <CertificateIssuanceButton
                            courseId={r.courseId}
                            levelId={r.levelId}
                            completionStatus={r.completionStatus}
                            issuing={issuing}
                            balance={balance}
                            onIssue={issueCertificate}
                          />
                        </AccessGate>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </section>
      </main>
    </Layout>
  );
}

function CertificateIssuanceButton({
  courseId,
  levelId,
  completionStatus,
  issuing,
  balance,
  onIssue,
}: {
  courseId: string;
  levelId: string;
  completionStatus: string;
  issuing: string | null;
  balance: number | null;
  onIssue: (courseId: string, levelId: string) => void;
}) {
  const estimatedCredits = getCpdCertificateCredits(courseId);
  const { accepted, canProceed } = useCreditConsent(estimatedCredits, balance);
  const isIssuing = issuing === `${courseId}:${levelId}`;

  return (
    <div className="space-y-3">
      <CreditConsent
        estimatedCredits={estimatedCredits}
        currentBalance={balance}
        onAccept={() => {}}
      />
      <button
        type="button"
        className="button"
        disabled={completionStatus !== "completed" || isIssuing || !canProceed}
        onClick={() => onIssue(courseId, levelId)}
      >
        {isIssuing ? "Issuing..." : `Get CPD certificate (${estimatedCredits} credits)`}
      </button>
    </div>
  );
}

