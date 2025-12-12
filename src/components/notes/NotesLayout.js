"use client";

import Layout from "@/components/Layout";

export function NotesLayout({ title, subtitle, pageKey, children }) {
  return (
    <Layout title={title} description={subtitle}>
      <header className="page-header">
        <p className="eyebrow">Notes</p>
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </header>
      <div className="notes-shell" data-page={pageKey}>
        {children}
      </div>
    </Layout>
  );
}
