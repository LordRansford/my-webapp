import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import { fetchPosts, fetchTags } from "@/lib/wordpress";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
};

export async function getStaticProps() {
  const posts = await fetchPosts(50);
  const tags = await fetchTags(50);

  return {
    props: { posts, tags },
    revalidate: 300,
  };
}

export default function PostsPage({ posts, tags }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();

    return posts.filter((post) => {
      const matchesText =
        !term ||
        post.plainTitle.toLowerCase().includes(term) ||
        post.plainExcerpt.toLowerCase().includes(term);

      const matchesTag =
        !activeTag || (Array.isArray(post.tags) && post.tags.includes(activeTag));

      return matchesText && matchesTag;
    });
  }, [query, posts, activeTag]);

  const pageSize = 9;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const resetAndSetTag = (tagId) => {
    setActiveTag(tagId === activeTag ? null : tagId);
    setPage(1);
  };

  const resetAndSetPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <Layout
      title="Notes · Ransford's Notes"
      description="Browse all recent notes on data, digitalisation, AI, cybersecurity, and engineering."
    >
      <header className="page-header">
        <p className="eyebrow">Notes</p>
        <h1>Search and explore the latest thinking</h1>
        <p>
          This list pulls directly from WordPress. Use the search box to find a
          topic by title or excerpt. New posts appear within minutes thanks to
          incremental static regeneration.
        </p>
        <SearchBar
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search notes by title or summary"
        />
        {tags.length > 0 && (
          <div className="tag-row" role="list" aria-label="Filter by tag">
            <button
              className={`tag ${activeTag === null ? "active" : ""}`}
              onClick={() => resetAndSetTag(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`tag ${activeTag === tag.id ? "active" : ""}`}
                onClick={() => resetAndSetTag(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <p className="muted">No matches yet. Try another search term.</p>
      ) : (
        <>
          <div className="card-grid">
            {pageItems.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  date: post.date ? `Updated ${formatDate(post.date)}` : "",
                }}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Pagination">
              <button onClick={() => resetAndSetPage(page - 1)} disabled={page === 1}>
                Previous
              </button>
              <span className="page-indicator">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => resetAndSetPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
