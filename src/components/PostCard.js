import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="card">
      <Link href={post.href || `/posts/${post.slug || post.id}`} className="card-link">
        <h3 className="card-title">{post.title}</h3>
        {post.date && <p className="meta">{post.date}</p>}
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
        <span className="text-link">Read this note &gt;</span>
      </Link>
    </article>
  );
}
