"use client";

import { MDXRemote } from "next-mdx-remote";

export function MDXRenderer({ source, components }) {
  return <MDXRemote {...source} components={components} />;
}
