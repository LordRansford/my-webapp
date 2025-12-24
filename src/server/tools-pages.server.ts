import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const toolsDir = path.join(process.cwd(), "content", "tools");

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

const listToolFiles = () => {
  try {
    return fs.readdirSync(toolsDir).filter((file) => file.endsWith(".mdx"));
  } catch {
    return [];
  }
};

const toSlug = (fileName: string) => fileName.replace(/\.mdx$/, "");

const extractMetaExport = (source: string, fallbackTitle: string) => {
  const match = source.match(/export const meta\s*=\s*({[\s\S]*?});/);
  if (!match) {
    return {
      title: fallbackTitle || "Tools",
      description: "",
      topic: "",
    };
  }

  try {
    const parsed = Function(`return (${match[1]});`)();
    return {
      title: parsed.title || fallbackTitle || "Tools",
      description: parsed.description || "",
      topic: parsed.topic || "",
    };
  } catch {
    return {
      title: fallbackTitle || "Tools",
      description: "",
      topic: "",
    };
  }
};

export const getAllToolPages = () =>
  listToolFiles().map((file) => {
    const slug = toSlug(file);
    const fullPath = path.join(toolsDir, file);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    const metaExport = extractMetaExport(source, slug.replace(/-/g, " "));
    const meta = {
      title: data.title || metaExport.title,
      description: data.description || metaExport.description,
      topic: data.topic || metaExport.topic,
    };

    return { slug, meta };
  });

export const getToolPage = async (slug: string) => {
  const fullPath = path.join(toolsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const metaExport = extractMetaExport(source, slug.replace(/-/g, " "));
  const meta = {
    title: data.title || metaExport.title,
    description: data.description || metaExport.description,
    topic: data.topic || metaExport.topic,
  };

  const mdx = await serialize(content || source, {
    scope: meta,
    mdxOptions: mdxOptions as any,
  });

  return { slug, meta, mdx };
};

