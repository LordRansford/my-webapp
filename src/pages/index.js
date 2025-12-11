import Link from "next/link";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import CourseCard from "@/components/CourseCard";
import { getRecentPosts } from "@/lib/posts";
import { getCoursesIndex } from "@/lib/courses";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
};

export async function getStaticProps() {
  const posts = getRecentPosts(6);
  const courses = getCoursesIndex();

  return {
    props: { posts, courses },
    revalidate: 300,
  };
}

export default function Home({ posts, courses }) {
  return (
    <Layout
      title="Ransford's Notes · Architecture, Security, AI"
      description="Clear explanations, browser sandboxes, and practical notes for learners from beginner to advanced."
    >
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Demystify, experiment, and deliver</p>
          <h1>Welcome to Ransfords Notes</h1>
          <p className="lead">
            I created this space to make digitalisation, cybersecurity, software architecture, data,
            engineering, and artificial intelligence easier to grasp. Complex topics become clear, structured
            lessons with practical tools you can run in your browser.
          </p>
          <div className="actions">
            <Link href="/courses" className="button primary">
              Start learning
            </Link>
            <Link href="/tools" className="button ghost">
              Open the sandboxes
            </Link>
            <Link href="/games" className="button secondary">
              Play and test yourself
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <p className="eyebrow">How to use this site</p>
          <ul className="hero-list">
            <li>
              <span className="dot dot--accent" />
              Pick a topic at your level and work through the notes in order
            </li>
            <li>
              <span className="dot dot--accent" />
              Use the sandboxes to try ideas without installing anything
            </li>
            <li>
              <span className="dot dot--accent" />
              Revisit sections whenever you meet them in real projects
            </li>
          </ul>
          <p className="muted">
            If something is unclear, assume I need to explain it better and let me know so I can improve it.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>What you will find here</h2>
          <span className="hint">Beginner to advanced, with practical exercises</span>
        </div>
        <div className="card-grid">
          <div className="card">
            <h3>Structured notes</h3>
            <p>
              Clear explanations, diagrams, and examples that connect theory to real systems. Beginner,
              intermediate, and advanced sections build on each other.
            </p>
          </div>
          <div className="card">
            <h3>Interactive tools</h3>
            <p>
              Sandboxes for Python, cryptography, and AI experiments. Everything runs in your browser; no code
              is executed on my servers.
            </p>
          </div>
          <div className="card">
            <h3>Exercises</h3>
            <p>
              Practice after each subsection. Try a prompt, observe the result, and compare it to the expected
              behaviour described in the notes.
            </p>
          </div>
          <div className="card">
            <h3>Media friendly</h3>
            <p>
              You can add pictures and videos to any note. Use standard markdown image syntax
              (<code>![alt text](path)</code>) or embed videos with simple HTML (<code>&lt;video&gt;</code> or
              <code>&lt;iframe&gt;</code>).
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Notes and tools</h2>
          <span className="hint">Recent notes stored locally</span>
        </div>
        {posts.length === 0 ? (
          <p className="muted">No posts to display yet.</p>
        ) : (
          <div className="card-grid">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={{
                  ...post,
                  date: post.date ? `Updated ${formatDate(post.date)}` : "",
                  href: `/posts/${post.slug}`,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
