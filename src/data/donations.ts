export type DonationTier = {
  id: string;
  label: string;
  amount: number; // in major currency units
  description: string;
  impact: string[];
};

export const donationTiers: DonationTier[] = [
  {
    id: "keep-lights-on",
    label: "Keep the lights on",
    amount: 5,
    description: "Covers hosting and monitoring for a week.",
    impact: ["Keeps the labs online", "Funds small bug fixes", "Covers coffee for late-night testing"],
  },
  {
    id: "ship-new-labs",
    label: "Ship a new lab",
    amount: 15,
    description: "Moves a new walkthrough or checklist from draft to published.",
    impact: ["Funds test data and fixtures", "Supports accessibility polish", "Pays for diagram clean-up"],
  },
  {
    id: "sponsor-research",
    label: "Sponsor research time",
    amount: 30,
    description: "Buys focused time to explore deeper topics and tighten guidance.",
    impact: ["Funds security reviews of new content", "Supports more edge case coverage", "Offsets tool subscriptions"],
  },
];

export const currency = "GBP";
