import Head from "next/head";
import Link from "next/link";
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
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="brand">
              <span className="brand__mark" aria-hidden="true">
                RN
              </span>
              <span className="brand__text">Ransford&apos;s Notes</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <Link href="/courses">Courses</Link>
              <Link href="/cpd">My CPD</Link>
              <Link href="/tools">Tools</Link>
              <div className="nav-dropdown">
                <button className="nav-dropdown__trigger" aria-haspopup="true" aria-expanded="false">
                  Studios
                </button>
                <div className="nav-dropdown__menu">
                  <Link href="/studios">Ransford&apos;s AI Studios</Link>
                  <Link href="/dev-studios">Ransford&apos;s Software Development Studio</Link>
                </div>
              </div>
              <Link href="/ai">AI</Link>
              <Link href="/digitalisation">Digitalisation</Link>
              <Link href="/software-architecture">Architecture</Link>
              <Link href="/cybersecurity">Cybersecurity course</Link>
              <Link href="/about">About</Link>
              <Link href="/trust-and-about">Trust</Link>
              <Link href="/accreditation-and-alignment">Accreditation</Link>
              <Link href="/subscribe">Subscribe</Link>
              <Link href="/donate" className="pill pill--accent">
                Support
              </Link>
            </nav>
          </div>
        </header>

        <main id="main-content" className="page-shell" role="main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div>
              <p className="eyebrow">Ransford Chung Amponsah</p>
              <p className="muted">
                Sharing the journey from mechanical engineering into data, digitalisation, and cyber security. Everything here aims to stay clear, accurate, and practical.
              </p>
            </div>
            <div className="footer-links" aria-label="Footer">
              <Link href="/tools">Tools</Link>
              <Link href="/about">About</Link>
              <Link href="/trust-and-about">Trust</Link>
              <Link href="/accreditation-and-alignment">Accreditation</Link>
              <Link href="/subscribe">Subscribe</Link>
              <Link href="/donate">Donate</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/accessibility">Accessibility</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
