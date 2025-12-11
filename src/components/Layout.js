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
      </Head>

      <div className="app-shell">
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="brand">
              <span className="brand__mark">RN</span>
              <span className="brand__text">Ransford&apos;s Notes</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <Link href="/courses">Courses</Link>
              <Link href="/posts">Notes</Link>
              <Link href="/tools">Labs</Link>
              <Link href="/games">Games</Link>
              <Link href="/cybersecurity">Cybersecurity</Link>
              <Link href="/about">About</Link>
              <Link href="/subscribe">Subscribe</Link>
              <Link href="/donate" className="pill pill--accent">
                Support
              </Link>
            </nav>
          </div>
        </header>

        <main className="page-shell">{children}</main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div>
              <p className="eyebrow">Ransford Chung Amponsah</p>
              <p className="muted">
                Sharing the journey from mechanical engineering into data, digitalisation, and cyber
                security. Everything here aims to stay clear, accurate, and practical.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/courses">Courses</Link>
              <Link href="/posts">Notes</Link>
              <Link href="/tools">Labs</Link>
              <Link href="/about">About</Link>
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
