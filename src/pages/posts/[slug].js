import { MDXRemote } from "next-mdx-remote";
import Layout from "@/components/Layout";
import mdxComponents from "@/components/mdx-components";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Link from "next/link";

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post } };
}

export default function PostPage({ post }) {
  return (
    <Layout
      title={`${post.title} - Ransford's Notes`}
      description={post.excerpt || "Notes and exercises."}
    >
      <nav className="breadcrumb">
        <Link href="/posts">Notes</Link>
        <span aria-hidden="true"> / </span>
        <span>{post.title}</span>
      </nav>
      <article className="lesson-content">
        <p className="eyebrow">Notes</p>
        <h1>{post.title}</h1>
        {post.date && (
          <p className="muted">
            {new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(post.date))}
            {post.readingStats ? ` · ${Math.ceil(post.readingStats.minutes)} min read` : ""}
          </p>
        )}
        <div className="post-content">
          <MDXRemote {...post.mdx} components={mdxComponents} />
        </div>
      </article>
    </Layout>
  );
}
