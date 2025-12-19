export type DonationIntent = {
  id: string;
  title: string;
  description: string;
};

export const donationIntents: DonationIntent[] = [
  {
    id: "maintain-site",
    title: "Maintain the site",
    description: "Cover hosting and monitoring so pages stay quick and reliable.",
  },
  {
    id: "new-tools",
    title: "Fund new tools and dashboards",
    description: "Back new visualisations, metrics, and checklists that help real teams.",
  },
  {
    id: "accessibility",
    title: "Improve accessibility",
    description: "Pay for testing, captions, keyboard passes, and clearer contrast.",
  },
  {
    id: "templates",
    title: "Support template development",
    description: "Keep the template library growing with fresh scenarios and better guidance.",
  },
  {
    id: "research",
    title: "Support research and writing time",
    description: "Give time to write, test, and refine the notes that people rely on.",
  },
];
