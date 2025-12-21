import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import NotesLayout from "@/components/NotesLayout";

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers: providers || {} } };
}

export default function SignInPage({ providers }) {
  const list = Object.values(providers || {});
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
      <div className="space-y-3">
        <p className="text-sm text-slate-700">
          Sign in is optional. If you do, I can save progress across devices and keep your CPD record consistent.
        </p>
        <p className="text-sm text-slate-700">
          Passwordless only: magic link email or Google or GitHub. No passwords to manage.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {list.map((p) => (
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
            <span className="font-semibold text-slate-900">Privacy note:</span> we store your email and learning progress so
            your account works. We do not store card details. We do not use behavioural profiling.
          </p>
        </div>

        <p className="text-xs text-slate-600">
          <Link href="/" className="font-semibold text-slate-800 underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </div>
    </NotesLayout>
  );
}


