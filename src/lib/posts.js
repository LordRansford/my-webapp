import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const postsDir = path.join(process.cwd(), "content", "posts");

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: { className: ["anchor"] },
      },
    ],
  ],
};

const listPostFiles = () => {
  try {
    return fs.readdirSync(postsDir).filter((file) => file.endsWith(".mdx"));
  } catch {
    return [];
  }
};

const stripMarkdown = (content = "") =>
  content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_~>#-]/g, "")
    .replace(/\n+/g, " ")
    .trim();

export const getAllPosts = () => {
  const files = listPostFiles();

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDir, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(source);
      const excerpt = data.excerpt || stripMarkdown(content).slice(0, 220);
      const date = data.date ? new Date(data.date).toISOString() : null;

      return {
        slug,
        title: data.title || slug,
        date,
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt,
        readingStats: readingTime(content),
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
};

export const getPostBySlug = async (slug) => {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const mdx = await serialize(content, {
    scope: data,
    mdxOptions,
  });

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: data.excerpt || stripMarkdown(content).slice(0, 220),
    readingStats: readingTime(content),
    mdx,
  };
};

export const getRecentPosts = (limit = 6) => getAllPosts().slice(0, limit);
