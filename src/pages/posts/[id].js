import Link from "next/link";
import Layout from "@/components/Layout";
import { fetchPostById, fetchRecentPosts } from "@/lib/wordpress";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
};

export async function getStaticPaths() {
  const recentPosts = await fetchRecentPosts(5);
  const paths = recentPosts.map((post) => ({
    params: { id: post.id?.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const post = await fetchPostById(params.id);

  if (!post) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: { post },
    revalidate: 300,
  };
}

export default function PostPage({ post }) {
  const plainExcerpt =
    post.plainExcerpt || "A new note from Ransford on data and digitalisation";

  return (
    <Layout
      title={`${post.plainTitle || "Post"} · Ransford's Notes`}
      description={plainExcerpt}
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/posts">Notes</Link>
        <span aria-hidden="true"> / </span>
        <span>Post</span>
      </nav>

      <article className="card">
        <h1
          className="card-title"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        {post.date && (
          <p className="meta">Published {formatDate(post.date)}</p>
        )}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="actions">
        <Link href="/posts" className="button ghost">
          Back to all notes
        </Link>
        <Link href="/tools" className="button secondary">
          Try the tools
        </Link>
      </div>
    </Layout>
  );
}
