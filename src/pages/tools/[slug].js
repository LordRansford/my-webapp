import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

const MDXClientWrapper = dynamic(() => import("@/components/MDXClientWrapper"), { ssr: false });

// #region agent log
function logToFile(location, message, data, hypothesisId) {
  try {
    const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logEntry = JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run4',
      hypothesisId,
    }) + '\n';
    fs.appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {
    // Silently fail if logging doesn't work
  }
}
// #endregion

export async function getServerSideProps({ params }) {
  // #region agent log
  logToFile('tools/[slug].js:getServerSideProps', 'getServerSideProps entry', { slug: params.slug }, 'H1');
  // #endregion
  try {
    // Direct dynamic import from server-only module to avoid client bundling
    const { getToolPage } = await import("@/server/tools-pages.server");
    // #region agent log
    logToFile('tools/[slug].js:getServerSideProps', 'getToolPage imported', { hasGetToolPage: !!getToolPage }, 'H1');
    // #endregion
    const page = await getToolPage(params.slug);
    // #region agent log
    logToFile('tools/[slug].js:getServerSideProps', 'getToolPage called', { hasPage: !!page, pageSlug: page?.slug, hasMdx: !!page?.mdx }, 'H1');
    // #endregion
    if (!page) return { notFound: true };
    return { props: { page } };
  } catch (error) {
    // #region agent log
    logToFile('tools/[slug].js:getServerSideProps', 'getServerSideProps error', { 
      errorMessage: error?.message, 
      errorName: error?.name, 
      errorStack: error?.stack?.substring(0, 1000) 
    }, ['H1', 'H5']);
    // #endregion
    console.error('[getServerSideProps] Error loading tool page:', error);
    return { notFound: true };
  }
}

export default function ToolPage({ page }) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tools/[slug].js:render',message:'Tool page rendering',data:{slug:page?.slug,hasPage:!!page,hasMdx:!!page?.mdx,isClient:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:['H2','H4']})}).catch(()=>{});
  }
  // #endregion
  return (
    <ErrorBoundary>
      <NotesLayout
        meta={{
          title: page.meta.title,
          description: page.meta.description || "Browser-based labs and sandboxes.",
          level: "Tools",
          slug: `/tools/${page.slug}`,
        }}
        headings={[]}
      >
        <nav className="breadcrumb">
          <Link href="/tools">Labs</Link>
          <span aria-hidden="true"> / </span>
          <span>{page.meta.title}</span>
        </nav>

        <article className="lesson-content">
          <p className="eyebrow">Labs</p>
          <h1>{page.meta.title}</h1>
          {page.meta.description && <p className="lead">{page.meta.description}</p>}
          <MDXClientWrapper mdx={page.mdx} />
        </article>
      </NotesLayout>
    </ErrorBoundary>
  );
}
