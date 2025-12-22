import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { useCPD } from "@/hooks/useCPD";
import AccessGate from "@/components/AccessGate";

type ConsentState = {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  cpdDataUseAccepted: boolean;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthed = Boolean(user?.id);
  const { state } = useCPD();

  const [plan, setPlan] = useState<string>("free");
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [learningSummary, setLearningSummary] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [savingConsent, setSavingConsent] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    termsAccepted: false,
    privacyAccepted: false,
    cpdDataUseAccepted: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const tierLabel = useMemo(() => {
    if (!isAuthed) return "Visitor";
    if (plan === "pro") return "Professional";
    if (plan === "supporter") return "Supporter";
    return "Registered learner";
  }, [isAuthed, plan]);

  useEffect(() => {
    if (!isAuthed) return;
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((d) => {
        setPlan(d?.plan || "free");
        const c = d?.user?.consent || {};
        setConsent({
          termsAccepted: Boolean(c.termsAcceptedAt),
          privacyAccepted: Boolean(c.privacyAcceptedAt),
          cpdDataUseAccepted: Boolean(c.cpdDataUseAcceptedAt),
        });
      })
      .catch(() => setPlan("free"));
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) return;
    fetch("/api/analytics/me")
      .then((r) => r.json())
      .then((d) => setAnalyticsSummary(d))
      .catch(() => setAnalyticsSummary(null));
    fetch("/api/account/learning-summary")
      .then((r) => r.json())
      .then((d) => setLearningSummary(d))
      .catch(() => setLearningSummary(null));
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCredits(typeof d?.balance === "number" ? d.balance : 0))
      .catch(() => setCredits(0));
  }, [isAuthed, consent.cpdDataUseAccepted]);

  const saveConsent = async (next: ConsentState) => {
    setSavingConsent(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/consent", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.message || "Could not save consent settings.");
      } else {
        setMessage("Consent settings saved.");
      }
    } catch {
      setMessage("Could not save consent settings.");
    } finally {
      setSavingConsent(false);
    }
  };

  const requestDelete = async () => {
    if (!user?.email) return;
    setDeleting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirmEmail: deleteConfirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.message || "Account deletion failed.");
        return;
      }
      setMessage("Account deleted. Signing out.");
      await signOut({ callbackUrl: "/" });
    } catch {
      setMessage("Account deletion failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading") {
    return (
      <Layout title="Account" description="Your account and consent settings.">
        <main className="page">
          <header className="page-header">
            <p className="eyebrow">Account</p>
            <h1>Account</h1>
            <p className="lead">Loading.</p>
          </header>
        </main>
      </Layout>
    );
  }

  if (!isAuthed) {
    return (
      <Layout title="Account" description="Sign in to manage your account.">
        <main className="page">
          <header className="page-header">
            <p className="eyebrow">Account</p>
            <h1>Account</h1>
            <p className="lead">Sign in to track progress, CPD hours, and tool usage.</p>
          </header>
          <section className="section">
            <Link href="/signin" className="button primary">
              Sign in
            </Link>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Account" description="Your account and consent settings.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Account</p>
          <h1>Account</h1>
          <p className="lead">Minimal identity. No passwords. No profile data required.</p>
        </header>

        <section className="section">
          <h2>Details</h2>
          <ul className="list">
            <li>
              <strong>Email</strong>: {user?.email}
            </li>
            <li>
              <strong>Tier</strong>: {tierLabel}
            </li>
            <li>
              <strong>Credits</strong>: {credits ?? 0}
            </li>
            {learningSummary?.displayName ? (
              <li>
                <strong>Name</strong>: {learningSummary.displayName}
              </li>
            ) : null}
          </ul>
          <p className="muted">Payments coming soon. Credits are currently inactive.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/account/history" className="button">
              View history
            </Link>
            <Link href="/my-cpd" className="button">
              My CPD
            </Link>
            <button type="button" className="button" onClick={() => signOut({ callbackUrl: "/" })}>
              Sign out
            </button>
          </div>
        </section>

        <section className="section">
          <h2>Learning insights</h2>
          <p className="muted">
            These are learning signals from your progress, quizzes, and tool use. They are not ad tracking.
          </p>
          {analyticsSummary?.consented === false ? (
            <p className="muted">Turn on CPD tracking consent below to enable insights.</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="card">
              <h3 className="font-semibold">Progress signals</h3>
              <p className="muted">
                Sections: {state.sections.filter((s) => s.completed).length} completed
              </p>
              <p className="muted">
                Courses started: {learningSummary?.coursesStarted ?? 0} · Courses completed: {learningSummary?.coursesCompleted ?? 0}
              </p>
              <p className="muted">Certificates earned: {learningSummary?.certificatesEarned ?? 0}</p>
              <p className="muted">Total CPD hours: {learningSummary?.totalCpdHours ?? 0}</p>
            </div>
            <div className="card">
              <h3 className="font-semibold">Exploration</h3>
              <p className="muted">
                Tools explored: {analyticsSummary?.summary?.toolsExplored ?? 0}
              </p>
              <p className="muted">
                Quizzes attempted: {analyticsSummary?.summary?.quizzesAttempted ?? 0}
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Consent</h2>
          <p className="muted">
            These flags exist so your CPD record is defensible and your preferences are explicit. You can change them at any time.
          </p>
          <div className="mt-3 space-y-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consent.termsAccepted}
                onChange={(e) => {
                  const next = { ...consent, termsAccepted: e.target.checked };
                  setConsent(next);
                  saveConsent(next);
                }}
                disabled={savingConsent}
              />
              <span>
                I accept the <Link href="/terms" className="link">terms</Link>.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consent.privacyAccepted}
                onChange={(e) => {
                  const next = { ...consent, privacyAccepted: e.target.checked };
                  setConsent(next);
                  saveConsent(next);
                }}
                disabled={savingConsent}
              />
              <span>
                I accept the <Link href="/privacy" className="link">privacy policy</Link>.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consent.cpdDataUseAccepted}
                onChange={(e) => {
                  const next = { ...consent, cpdDataUseAccepted: e.target.checked };
                  setConsent(next);
                  saveConsent(next);
                }}
                disabled={savingConsent}
              />
              <span>I consent to CPD tracking being stored to my account.</span>
            </label>
          </div>
          {message ? <p className="mt-3 text-sm">{message}</p> : null}
        </section>

        <section className="section">
          <h2>Delete account</h2>
          <p className="muted">
            This deletes your account and server-side records for progress and history. It does not affect Stripe records held by Stripe.
          </p>
          <p className="muted">To confirm, type your email address and then delete.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              className="input"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Email confirmation"
              aria-label="Confirm email for deletion"
            />
            <button
              type="button"
              className="button"
              disabled={deleting || deleteConfirm.trim().toLowerCase() !== String(user?.email || "").toLowerCase()}
              onClick={requestDelete}
            >
              {deleting ? "Deleting" : "Delete account"}
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
}


