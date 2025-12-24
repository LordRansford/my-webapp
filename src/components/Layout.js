import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import TestingModeBanner from "@/components/TestingModeBanner";
import SpotifyMiniPlayerMount from "@/components/spotify/SpotifyMiniPlayerMount";
import Footer from "@/components/Footer";
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
        <style>{`
          .skip-link {
            position: absolute;
            top: -40px;
            left: 1rem;
            padding: 0.5rem 0.75rem;
            background: #0f172a;
            color: #f8fafc;
            border-radius: 0.5rem;
            transition: top 0.2s ease;
            z-index: 1000;
          }
          .skip-link:focus {
            top: 1rem;
            outline: 2px solid #0ea5e9;
            outline-offset: 2px;
          }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}</style>
      </Head>

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="app-shell">
        <TestingModeBanner />
        <Header />

        <main id="main-content" className="page-shell" role="main">
          {children}
        </main>

        <a
          href="/mentor"
          className="mentor-fab"
          aria-label="Ask the mentor"
        >
          ?
        </a>

        <SpotifyMiniPlayerMount />

        <Footer />
      </div>

      <style>{`
        .mentor-fab {
          position: fixed;
          right: 1.25rem;
          bottom: 1.25rem;
          width: 52px;
          height: 52px;
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
        .mentor-fab:hover,
        .mentor-fab:focus-visible {
          background: #1e293b;
          transform: translateY(-1px);
          outline: 2px solid #0ea5e9;
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .mentor-fab {
            right: 1rem;
            bottom: 1rem;
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  );
}
