"use client";

import { useMemo } from "react";
import { signIn } from "next-auth/react";
import NotesLayout from "@/components/NotesLayout";

/**
 * Simplified sign-in page that uses client-side signIn to avoid server-side rendering issues.
 * We render a single Google button; if more providers are added later, extend this list.
 */
export default function SignInPage() {
  const providers = useMemo(
    () => {
      const providersList = [
        { id: "google", name: "Google" },
      ];
      // Add email provider if configured
      if (process.env.NEXT_PUBLIC_EMAIL_ENABLED === "true") {
        providersList.push({ id: "email", name: "Email" });
      }
      return providersList;
    },
    []
  );

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

        <div className="grid gap-2 sm:grid-cols-2">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => signIn(p.id)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              Continue with {p.name}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
          <p className="m-0">
            <span className="font-semibold text-slate-900">Privacy note:</span> we store your email and learning progress so your account works. We do not store card details or use behavioural profiling.
          </p>
        </div>
      </div>
    </NotesLayout>
  );
}


