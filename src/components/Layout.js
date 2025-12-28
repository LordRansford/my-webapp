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
      `}</style>
    </>
  );
}
