import type { Metadata } from "next";

// Preview/admin routes are not for indexing during early release.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}


