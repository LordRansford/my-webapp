/**
 * Skip link component for keyboard navigation
 */

import React, { memo } from "react";
import Link from "next/link";

const SkipLink = memo(function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </Link>
  );
});

export default SkipLink;
