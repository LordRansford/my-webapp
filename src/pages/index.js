import Link from "next/link";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import CourseCard from "@/components/CourseCard";
import { fetchRecentPosts } from "@/lib/wordpress";
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
  const posts = await fetchRecentPosts(6);
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
      description="Premium notes and courses on cybersecurity, software architecture, and AI systems with live sandboxes."
    >
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Demystify, experiment, and deliver</p>
          <h1>
            Secure-by-design learning for <span className="highlight">builders</span> and leaders.
          </h1>
          <p className="lead">
            TOGAF discipline, SABSA control mapping, and interactive labs. Build AI, architecture, and
            cybersecurity skills without leaving your browser.
          </p>
          <div className="actions">
            <Link href="/courses" className="button primary">
              Explore the courses
            </Link>
            <Link href="/tools" className="button ghost">
              Launch the labs
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <div className="panel">
            <p className="eyebrow">Live sandboxes</p>
            <ul className="hero-list">
              <li>
                <span className="dot dot--accent" />
                RSA key generation (Web Crypto)
              </li>
              <li>
                <span className="dot dot--accent" />
                Python in-browser (WASM)
              </li>
              <li>
                <span className="dot dot--accent" />
                Threat modelling checklists (CIA + OSI)
              </li>
            </ul>
            <Link href="/tools" className="text-link">
              Open the labs →
            </Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>Course tracks</h2>
          <span className="hint">MDX-powered, secure by default</span>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Latest notes</h2>
          <span className="hint">Pulled straight from WordPress</span>
        </div>
        {posts.length === 0 ? (
          <p className="muted">No posts to display yet.</p>
        ) : (
          <div className="card-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  date: post.date ? `Updated ${formatDate(post.date)}` : "",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
