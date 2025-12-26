import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import NotesLayout from "@/components/NotesLayout";
import mdxComponents from "@/components/mdx-components";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";

export async function getServerSideProps({ params }) {
  // Direct dynamic import from server-only module to avoid client bundling
  const { getToolPage } = await import("@/server/tools-pages.server");
  const page = await getToolPage(params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}

export default function ToolPage({ page }) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tools/[slug].js:render',message:'Tool page rendering',data:{slug:page?.slug},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
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
          <div className="post-content">
            <MDXRemote {...page.mdx} components={mdxComponents} />
          </div>
        </article>
      </NotesLayout>
    </ErrorBoundary>
  );
}
