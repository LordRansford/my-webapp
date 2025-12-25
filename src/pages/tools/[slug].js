import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import NotesLayout from "@/components/NotesLayout";
import mdxComponents from "@/components/mdx-components";

export async function getServerSideProps({ params }) {
  // Direct dynamic import from server-only module to avoid client bundling
  const { getToolPage } = await import("@/server/tools-pages.server");
  const page = await getToolPage(params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}

export default function ToolPage({ page }) {
  return (
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
  );
}
