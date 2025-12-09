import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="card">
      <Link href={`/posts/${post.id}`} className="card-link">
        <h3
          className="card-title"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        {post.date && <p className="meta">{post.date}</p>}
        <div
          className="excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <span className="text-link">Read this note &gt;</span>
      </Link>
    </article>
  );
}
