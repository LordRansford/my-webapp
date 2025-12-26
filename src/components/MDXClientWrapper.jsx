"use client";

import { MDXRemote } from "next-mdx-remote";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy load mdx-components only on client
const mdxComponentsLoader = dynamic(() => import("@/components/mdx-components"), { ssr: false });

export default function MDXClientWrapper({ mdx }) {
  const [isClient, setIsClient] = useState(false);
  const [components, setComponents] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Load components after mount
    mdxComponentsLoader.then((mod) => {
      setComponents(mod.default);
    }).catch((err) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MDXClientWrapper.jsx:loadError',message:'Failed to load mdx components',data:{error:err?.message,stack:err?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
      setError(err);
      console.error('[MDXClientWrapper] Failed to load components:', err);
    });
  }, []);

  if (!isClient) {
    return <div className="post-content">Loading...</div>;
  }

  if (error) {
    return (
      <div className="post-content">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Failed to load page content.</p>
          <p className="text-xs mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!components) {
    return <div className="post-content">Loading components...</div>;
  }

  try {
    return (
      <div className="post-content">
        <MDXRemote {...mdx} components={components} />
      </div>
    );
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MDXClientWrapper.jsx:renderError',message:'Error rendering MDX',data:{error:err?.message,stack:err?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    return (
      <div className="post-content">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Error rendering content.</p>
          <p className="text-xs mt-1">{err?.message || String(err)}</p>
        </div>
      </div>
    );
  }
}

