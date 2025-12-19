export type DonationTier = {
  id: string;
  label: string;
  suggestedAmount: number;
  description: string;
  impact: string[];
};

export const donationTiers: DonationTier[] = [
  {
    id: "small-coffee",
    label: "Small coffee",
    suggestedAmount: 3,
    description: "Covers hosting for a day and keeps the dashboard lights on.",
    impact: ["Keeps the site fast", "Pays for a tiny caffeine top up"],
  },
  {
    id: "supporter",
    label: "Supporter",
    suggestedAmount: 8,
    description: "Helps ship small improvements and tidy little papercuts.",
    impact: ["Funds minor fixes", "Supports content refreshes", "Buys a round of tea for testers"],
  },
  {
    id: "sponsor",
    label: "Sponsor",
    suggestedAmount: 20,
    description: "Backs a bigger feature sprint so tools stay useful and kind.",
    impact: ["Pays for accessibility tweaks", "Covers new template drafts", "Supports more QA time"],
  },
  {
    id: "custom",
    label: "Custom amount",
    suggestedAmount: 0,
    description: "Choose your own amount; every bit helps keep this indie project going.",
    impact: ["Flexible support", "Funds experiments and research", "Shows the work matters to you"],
  },
];
