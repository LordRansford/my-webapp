import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import dynamic from "next/dynamic";

const MDXClientWrapper = dynamic(() => import("@/components/MDXClientWrapper"), { ssr: false });

export async function getServerSideProps({ params }) {
  try {
    // Direct dynamic import from server-only module to avoid client bundling
    const { getToolPage } = await import("@/server/tools-pages.server");
    const page = await getToolPage(params.slug);
    if (!page) return { notFound: true };
    return { props: { page } };
  } catch (error) {
    console.error('[getServerSideProps] Error loading tool page:', error);
    return { notFound: true };
  }
}

export default function ToolPage({ page }) {
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
