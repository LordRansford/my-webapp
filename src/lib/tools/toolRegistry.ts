export type ToolRegistryEntry = {
  id: string;
  title: string;
  route: string;
  anchor?: string;
  tips: string[];
};

// Minimal registry for on site suggestions. This can grow over time.
export const toolRegistry: ToolRegistryEntry[] = [
  {
    id: "cyber_game_trust_boundary",
    title: "Spot the trust boundary",
    route: "/cybersecurity/summary",
    tips: ["Pick one real system you use daily", "Mark where identity or trust changes", "Write the first log you would want at that boundary"],
  },
  {
    id: "ai-summary-scenario-triage",
    title: "AI scenario triage",
    route: "/ai/summary",
    tips: ["Name the real system (search, recommendations, moderation, automation)", "List the quiet failure mode", "Decide the smallest safe change"],
  },
];

export function findToolSuggestion(query: string) {
  const q = String(query || "").toLowerCase();
  return toolRegistry.find((t) => t.title.toLowerCase().includes(q) || q.includes(t.id.toLowerCase()));
}


