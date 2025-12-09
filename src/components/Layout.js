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
              Ransford&apos;s Notes
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <Link href="/posts">Notes</Link>
              <Link href="/tools">Tools</Link>
              <a
                href="https://ransfordsnotes.com"
                target="_blank"
                rel="noreferrer"
              >
                Archive
              </a>
            </nav>
          </div>
        </header>

        <main className="page-shell">{children}</main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div>
              <p className="eyebrow">Ransford Chung Amponsah</p>
              <p className="muted">
                Sharing the journey from mechanical engineering into data,
                digitalisation, and cyber security.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/tools">Tools</Link>
              <Link href="/posts">Notes</Link>
              <a href="https://github.com/LordRansford/my-webapp" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
