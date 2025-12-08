import Head from "next/head";
import Link from "next/link";
import { fetchRecentPosts } from "@/lib/wordpress";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
};

export async function getStaticProps() {
  const posts = await fetchRecentPosts(8);

  return {
    props: { posts },
    revalidate: 300,
  };
}

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Ransford&apos;s Notes</title>
        <meta
          name="description"
          content="Demystifying data, digitalisation, AI, cybersecurity, and engineering with hands-on notes and tools."
        />
      </Head>

      <main className="page-shell">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Demystify, experiment, and deliver.</h1>
          <p>
            I share my builds and lessons across data, digitalisation, AI,
            cybersecurity, and engineering. Each post captures what worked,
            what failed, and how I tuned things for speed and cost.
          </p>
          <div className="actions">
            <Link href="/tools" className="button primary">
              Open the tools
            </Link>
            <a
              className="button ghost"
              href="https://ransfordsnotes.com"
              target="_blank"
              rel="noreferrer"
            >
              View full archive
            </a>
          </div>
        </header>

        <section className="section">
          <div className="section-heading">
            <h2>Latest posts</h2>
            <span className="hint">Pulled straight from WordPress</span>
          </div>

          {posts.length === 0 ? (
            <p className="muted">No posts to display yet.</p>
          ) : (
            <div className="card-grid">
              {posts.map((post) => (
                <article key={post.id} className="card">
                  <Link href={`/posts/${post.id}`} className="card-link">
                    <h3
                      className="card-title"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    {post.date && (
                      <p className="meta">Updated {formatDate(post.date)}</p>
                    )}
                    <div
                      className="excerpt"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <span className="text-link">Read this note →</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Hands-on</p>
                <h2>Work with the ideas immediately</h2>
                <p className="muted">
                  Spin up the browser-based Python playground or the Web Crypto
                  demo. Everything runs on your device—no servers, no waiting.
                </p>
              </div>
              <Link href="/tools" className="button secondary">
                Launch tools
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
