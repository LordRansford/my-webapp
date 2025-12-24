import Head from "next/head";
import Link from "next/link";
import TestingModeBanner from "@/components/TestingModeBanner";
import SpotifyMiniPlayerMount from "@/components/spotify/SpotifyMiniPlayerMount";
import AppShell from "@/components/navigation/AppShell";
export default function Layout({
  children,
  title = "Ransford's Notes",
  description = "Demystifying data, digitalisation, AI, cybersecurity, and engineering with hands-on tools.",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <TestingModeBanner />
      <AppShell>
        {children}
        <Link
          href="/mentor"
          className="mentor-cta"
          aria-label="Ask the mentor"
        >
          Ask the mentor
        </Link>
      </AppShell>
      <SpotifyMiniPlayerMount />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        .mentor-cta {
          position: fixed;
          right: 1.25rem;
          bottom: 1.25rem;
          padding: 0.75rem 1rem;
          border-radius: 9999px;
          background: #0f172a;
          color: #f8fafc;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
          text-decoration: none;
        }
        .mentor-cta:hover,
        .mentor-cta:focus-visible {
          background: #1e293b;
          transform: translateY(-1px);
          outline: 2px solid #0ea5e9;
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .mentor-cta {
            right: 1rem;
            bottom: 1rem;
            padding: 0.65rem 0.9rem;
          }
        }
      `}</style>
    </>
  );
}
