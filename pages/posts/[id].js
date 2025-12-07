import React from 'react';

export async function getServerSideProps({ params }) {
  const { id } = params;
  const apiBase =
    process.env.NEXT_PUBLIC_WP_API_URL ||
    'https://ransfordsnotes.com/wp-json/wp/v2';

  try {
    const res = await fetch(`${apiBase}/posts/${id}?_embed`);
    if (!res.ok) {
      return { notFound: true };
    }
    const post = await res.json();
    return { props: { post } };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return { notFound: true };
  }
}

export default function PostPage({ post }) {
  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <h1>{post.title.rendered}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </main>
  );
}