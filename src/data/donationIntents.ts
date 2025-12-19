export type DonationIntent = {
  id: string;
  label: string;
  description: string;
};

export const donationIntents: DonationIntent[] = [
  {
    id: "maintain",
    label: "Maintain the site",
    description: "Keep hosting, monitoring, and backups running smoothly.",
  },
  {
    id: "new-labs",
    label: "Fund new labs",
    description: "Support fresh walkthroughs, diagrams, and accessibility passes.",
  },
  {
    id: "content-research",
    label: "Deep research",
    description: "Buy time for testing edge cases and writing clearer guidance.",
  },
];
