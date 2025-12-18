import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import Layout from "@/components/Layout";
import mdxComponents from "@/components/mdx-components";
import { getAllToolPages, getToolPage } from "@/lib/tools-pages";

export async function getStaticPaths() {
  const pages = getAllToolPages();
  const paths = pages.map((page) => ({ params: { slug: page.slug } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const page = await getToolPage(params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}

export default function ToolPage({ page }) {
  return (
    <Layout
      title={`${page.meta.title} - Ransford's Notes`}
      description={page.meta.description || "Browser-based labs and sandboxes."}
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
    </Layout>
  );
}
