import sanitizeHtml from "sanitize-html";

const WORDPRESS_API_BASE = (
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "https://ransfordsnotes.com/wp-json/wp/v2"
).replace(/\/$/, "");

const sanitizeOptions = {
  allowedTags: [
    "p",
    "a",
    "strong",
    "em",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "loading", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  disallowedTagsMode: "discard",
};

const safeHtml = (html) => sanitizeHtml(html || "", sanitizeOptions);
const stripAllHtml = (html) =>
  sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} }).trim();

async function fetchFromWordPress(path) {
  const url = `${WORDPRESS_API_BASE}${path}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error("WordPress responded with a non-200 status", {
        url,
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to reach WordPress API", { url, error });
    return null;
  }
}

export async function fetchRecentPosts(limit = 6) {
  const posts = await fetchFromWordPress(`/posts?_embed&per_page=${limit}`);
  if (!posts) return [];

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: safeHtml(post.title?.rendered || "Untitled entry"),
    excerpt: safeHtml(post.excerpt?.rendered),
    plainTitle: stripAllHtml(post.title?.rendered),
    plainExcerpt: stripAllHtml(post.excerpt?.rendered),
    date: post.date || null,
    tags: Array.isArray(post.tags) ? post.tags : [],
  }));
}

export async function fetchPostById(id) {
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    return null;
  }

  const post = await fetchFromWordPress(`/posts/${postId}?_embed`);
  if (!post) return null;

  return {
    id: post.id,
    slug: post.slug,
    title: safeHtml(post.title?.rendered || "Untitled entry"),
    excerpt: safeHtml(post.excerpt?.rendered),
    content: safeHtml(post.content?.rendered),
    plainTitle: stripAllHtml(post.title?.rendered),
    plainExcerpt: stripAllHtml(post.excerpt?.rendered),
    plainContent: stripAllHtml(post.content?.rendered),
    date: post.date || null,
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

export async function fetchPosts(limit = 24) {
  const posts = await fetchFromWordPress(`/posts?_embed&per_page=${limit}`);
  if (!posts) return [];

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: safeHtml(post.title?.rendered || "Untitled entry"),
    excerpt: safeHtml(post.excerpt?.rendered),
    plainTitle: stripAllHtml(post.title?.rendered),
    plainExcerpt: stripAllHtml(post.excerpt?.rendered),
    date: post.date || null,
    tags: Array.isArray(post.tags) ? post.tags : [],
  }));
}

export async function fetchTags(limit = 50) {
  const tags = await fetchFromWordPress(`/tags?per_page=${limit}`);
  if (!tags) return [];

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));
}
