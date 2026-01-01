import AllocationArchitect from "@/lib/games/games/allocation-architect/AllocationArchitect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allocation Architect | Ransford's Notes Games",
  description: "Build optimal resource allocation plans under constraints. Balance multiple objectives while managing risk events.",
  keywords: ["allocation architect", "resource optimization", "strategy game", "planning game", "constraint satisfaction"],
  openGraph: {
    title: "Allocation Architect | Ransford's Notes Games",
    description: "Build optimal resource allocation plans under constraints.",
    type: "website",
    url: "/games/allocation-architect",
  },
};

export default function AllocationArchitectPage() {
  return <AllocationArchitect />;
}
