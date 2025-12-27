"use client";

import React from "react";
import { MDXRemote } from "next-mdx-remote";
import MermaidDiagram from "@/components/notes/MermaidDiagram";

function SafeParagraph({ children, ...props }) {
  const nodes = React.Children.toArray(children);
  const hasBlockChild = nodes.some((node) => {
    if (!node || typeof node !== "object") return false;
    const type = node.type;
    return (
      type === "p" ||
      type === "div" ||
      type === "ul" ||
      type === "ol" ||
      type === "pre" ||
      type === "table" ||
      type === "section" ||
      type === "article" ||
      type === "h1" ||
      type === "h2" ||
      type === "h3" ||
      type === "h4" ||
      type === "h5" ||
      type === "h6"
    );
  });

  // Prevent invalid `<p>` nesting that can cause SSR/client hydration mismatch.
  if (hasBlockChild) return <div {...props}>{children}</div>;
  return <p {...props}>{children}</p>;
}

export function MDXRenderer({ source, components }) {
  return <MDXRemote {...source} components={{ p: SafeParagraph, MermaidDiagram, ...(components || {}) }} />;
}
