import Layout from "@/components/Layout";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import "@/styles/blog-post.css";

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
      <BlogPostLayout post={post} />
    </Layout>
  );
}
