import Layout from "@/components/Layout";

function flag(value: string | undefined) {
  return Boolean(value && String(value).trim().length > 0);
}

export default function StatusPage(props: {
  env: Record<string, boolean>;
}) {
  const env = props.env || {};
  const okAuthCore = (env.NEXTAUTH_URL || env.NEXT_PUBLIC_SITE_URL) && env.NEXTAUTH_SECRET;
  const okAuthProvider = (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) || (env.EMAIL_SERVER && env.EMAIL_FROM);
  const okAuth = okAuthCore && okAuthProvider;
  const okDb = env.DATABASE_URL;
  const okStripe = env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET;

  return (
    <Layout title="Status" description="Service configuration status">
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Status</p>
          <h1 className="text-3xl font-semibold text-slate-900">Service readiness</h1>
          <p className="text-slate-700">
            This page shows configuration signals without exposing secrets.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <div className={`rounded-3xl border p-5 shadow-sm ${okDb ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="text-sm font-semibold text-slate-900">Database</div>
            <div className="mt-1 text-sm text-slate-700">{okDb ? "Configured" : "Missing DATABASE_URL"}</div>
          </div>
          <div className={`rounded-3xl border p-5 shadow-sm ${okAuth ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="text-sm font-semibold text-slate-900">Sign in</div>
            <div className="mt-1 text-sm text-slate-700">
              {okAuth ? "Configured" : okAuthCore ? "Provider not configured" : "NextAuth not configured"}
            </div>
          </div>
          <div className={`rounded-3xl border p-5 shadow-sm ${okStripe ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="text-sm font-semibold text-slate-900">Payments</div>
            <div className="mt-1 text-sm text-slate-700">{okStripe ? "Stripe configured" : "Stripe keys missing"}</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Signals</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.keys(env)
              .sort()
              .map((k) => (
                <div key={k} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">{k}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{env[k] ? "Present" : "Missing"}</div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  const env = {
    DATABASE_URL: flag(process.env.DATABASE_URL),
    NEXTAUTH_URL: flag(process.env.NEXTAUTH_URL),
    NEXTAUTH_SECRET: flag(process.env.NEXTAUTH_SECRET),
    GOOGLE_CLIENT_ID: flag(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: flag(process.env.GOOGLE_CLIENT_SECRET),
    EMAIL_SERVER: flag(process.env.EMAIL_SERVER),
    EMAIL_FROM: flag(process.env.EMAIL_FROM),
    STRIPE_SECRET_KEY: flag(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: flag(process.env.STRIPE_WEBHOOK_SECRET),
    NEXT_PUBLIC_SITE_URL: flag(process.env.NEXT_PUBLIC_SITE_URL),
  };
  return { props: { env } };
}

