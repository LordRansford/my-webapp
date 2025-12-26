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
  // #region agent log
  try {
    const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logEntry = JSON.stringify({
      location: 'tools-pages.server.ts:getToolPage',
      message: 'getToolPage entry',
      data: { slug },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run4',
      hypothesisId: 'H1',
    }) + '\n';
    fs.appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {}
  // #endregion
  const fullPath = path.join(toolsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    // #region agent log
    try {
      const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
      const logEntry = JSON.stringify({
        location: 'tools-pages.server.ts:getToolPage',
        message: 'File not found',
        data: { slug, fullPath },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run4',
        hypothesisId: 'H1',
      }) + '\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    } catch (e) {}
    // #endregion
    return null;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const metaExport = extractMetaExport(source, slug.replace(/-/g, " "));
  const meta = {
    title: data.title || metaExport.title,
    description: data.description || metaExport.description,
    topic: data.topic || metaExport.topic,
  };

  // #region agent log
  try {
    const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
    const logEntry = JSON.stringify({
      location: 'tools-pages.server.ts:getToolPage',
      message: 'About to serialize MDX',
      data: { slug, contentLength: content?.length || 0 },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run4',
      hypothesisId: 'H1',
    }) + '\n';
    fs.appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {}
  // #endregion

  try {
    const mdx = await serialize(content || source, {
      scope: meta,
      mdxOptions: mdxOptions as any,
    });
    // #region agent log
    try {
      const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
      const logEntry = JSON.stringify({
        location: 'tools-pages.server.ts:getToolPage',
        message: 'MDX serialized successfully',
        data: { slug, hasMdx: !!mdx },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run4',
        hypothesisId: 'H1',
      }) + '\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    } catch (e) {}
    // #endregion
    return { slug, meta, mdx };
  } catch (error) {
    // #region agent log
    try {
      const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
      const logEntry = JSON.stringify({
        location: 'tools-pages.server.ts:getToolPage',
        message: 'MDX serialization error',
        data: { 
          slug, 
          errorMessage: (error as Error)?.message, 
          errorName: (error as Error)?.name,
          errorStack: (error as Error)?.stack?.substring(0, 1000)
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run4',
        hypothesisId: ['H1', 'H5'],
      }) + '\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    } catch (e) {}
    // #endregion
    console.error('[getToolPage] Error serializing MDX:', error);
    throw error;
  }
};

