import Link from 'next/link';
import React from 'react';

// Server-side fetch from WordPress every time the page is loaded
export async function getServerSideProps() {
  const apiBase =
    process.env.NEXT_PUBLIC_WP_API_URL ||
    'https://ransfordsnotes.com/wp-json/wp/v2';

  try {
    const res = await fetch(`${apiBase}/posts?_embed&per_page=5`);
    const posts = await res.json();
    return { props: { posts } };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { props: { posts: [] } };
  }
}

export default function HomePage({ posts }) {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <h1>Ransford&apos;s Notes</h1>
      <p>
        Welcome to my lab for data, digitalisation, AI, cybersecurity and
        engineering.
      </p>

      {posts.length === 0 && <p><em>No posts to display yet.</em></p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1.5rem' }}>
            <h2>
              <Link href={`/posts/${post.id}`}>
                {post.title.rendered || 'Untitled'}
              </Link>
            </h2>
            {/* WordPress sends HTML excerpts */}
            <div
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}