"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import NotesLayout from "@/components/NotesLayout";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Simplified sign-in page that uses client-side signIn to avoid server-side rendering issues.
 * We render a single Google button; if more providers are added later, extend this list.
 */
export default function SignInPage() {
  const router = useRouter();
  const callbackUrl = typeof router?.query?.callbackUrl === "string" ? router.query.callbackUrl : "";
  const error = typeof router?.query?.error === "string" ? router.query.error : "";
  const check = typeof router?.query?.check === "string" ? router.query.check : "";
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/providers", { method: "GET" });
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = typeof json?.error === "string" ? json.error : "Sign in is not available right now.";
          if (alive) setStatusMessage(msg);
          if (alive) setProviders([]);
          return;
        }
        const list = Object.values(json || {})
          .map((p) => ({ id: String((p && p.id) || ""), name: String((p && p.name) || "") }))
          .filter((p) => p.id && p.name);
        if (alive) setProviders(list);
      } catch {
        if (alive) setProviders([]);
        if (alive) setStatusMessage("Sign in is not available right now.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const banner =
    error === "auth"
      ? { tone: "rose", title: "Sign in failed", body: "Please try again. If this keeps happening, check /status to confirm auth is configured." }
      : check
        ? { tone: "slate", title: "Check your email", body: "If you used a magic link, check your inbox and click the link to continue." }
        : null;

  return (
    <NotesLayout
      meta={{
        title: "Sign in",
        description: "Sign in to save progress across devices.",
        level: "Identity",
        slug: "/signin",
      }}
      headings={[]}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          Sign in is optional. Use Google to sync progress across devices. No passwords.
        </p>

        {banner ? (
          <div
            className={`rounded-2xl border p-4 text-sm shadow-sm ${
              banner.tone === "rose" ? "border-rose-200 bg-rose-50 text-rose-900" : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
            role="status"
          >
            <div className="font-semibold">{banner.title}</div>
            <div className="mt-1">{banner.body}</div>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
              Loading sign in options.
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 shadow-sm">
              <div className="font-semibold text-rose-900">Sign in is not configured</div>
              <div className="mt-1 text-rose-900">
                {statusMessage || "No sign in providers are available."}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/status" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                  Check status
                </Link>
                <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                  Pricing
                </Link>
              </div>
              <div className="mt-3 text-xs text-rose-900">
                For Vercel you need NEXTAUTH_URL and NEXTAUTH_SECRET plus a provider such as Google client id and secret.
              </div>
            </div>
          ) : (
            providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => signIn(p.id, { callbackUrl: callbackUrl || "/" })}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                Continue with {p.name}
              </button>
            ))
          )}
        </div>

        {callbackUrl ? (
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
            After signing in you will return to: <span className="font-semibold text-slate-900">{callbackUrl}</span>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
          <p className="m-0">
            <span className="font-semibold text-slate-900">Privacy note:</span> we store your email and learning progress so your account works. We do not store card details or use behavioural profiling.
          </p>
        </div>
      </div>
    </NotesLayout>
  );
}


