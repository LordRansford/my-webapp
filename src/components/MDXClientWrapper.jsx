"use client";

import { MDXRemote } from "next-mdx-remote";
import { useEffect, useState } from "react";
import mdxComponents from "@/components/mdx-components";

export default function MDXClientWrapper({ mdx }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="post-content">Loading...</div>;
  }

  return (
    <div className="post-content">
      <MDXRemote {...mdx} components={mdxComponents} />
    </div>
  );
}

