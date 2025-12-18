import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const NOTES_ROOT = path.join(process.cwd(), "content", "notes");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function loadNote(relativePath, extraScope = {}, options = {}) {
  const contentRoot = options.contentRoot
    ? path.isAbsolute(options.contentRoot)
      ? options.contentRoot
      : path.join(process.cwd(), "content", options.contentRoot)
    : NOTES_ROOT;
  const fullPath = path.join(contentRoot, relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(raw);

  // Extract h2/h3 headings for sidebar (lightweight parse)
  const headings = [];
  const lines = content.split("\n");
  lines.forEach((line) => {
    const match = /^(#{2,3})\s+(.*)/.exec(line);
    if (match) {
      const depth = match[1].length;
      const title = match[2].trim();
      const id = slugify(title);
      headings.push({ id, title, depth });
    }
  });

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        rehypeKatex,
      ],
      format: "mdx",
    },
    scope: { ...data, ...extraScope },
  });

  return {
    source: mdxSource,
    headings,
    meta: {
      title: data.title || "",
      description: data.description || "",
      level: data.level || "",
    },
  };
}
