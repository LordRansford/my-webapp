import { getLatestCompletedDonation } from "@/lib/templates/store";

type DonationCheckInput = { userId?: string | null; anonymousUserId?: string | null };

export type DonationQualification = {
  qualifying: boolean;
  donationId: string | null;
  donatedAt: string | null;
};

const DEFAULT_THRESHOLD = 5; // GBP equivalent

function getThreshold() {
  const raw = process.env.TEMPLATE_DONATION_MIN_AMOUNT;
  const num = raw ? Number(raw) : DEFAULT_THRESHOLD;
  return Number.isFinite(num) && num > 0 ? num : DEFAULT_THRESHOLD;
}

export function qualifyDonation(params: DonationCheckInput): DonationQualification {
  const donation = getLatestCompletedDonation(params);
  const threshold = getThreshold();

  if (!donation) {
    return { qualifying: false, donationId: null, donatedAt: null };
  }

  const qualifying = typeof donation.amount === "number" && donation.amount >= threshold;
  return { qualifying, donationId: donation.donationId, donatedAt: donation.donatedAt };
}
type DonationRecord = {
  donationId: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  amount: number;
  currency: string;
  status: string;
  donatedAt: string;
};

type QualifyResult = {
  qualifying: boolean;
  donationId?: string;
  donatedAt?: string;
};

const DEFAULT_MIN_AMOUNT = 5; // GBP equivalent
const WINDOW_DAYS = 365;

export function isDonationQualifying(donation: DonationRecord, now = Date.now()): boolean {
  if (!donation) return false;
  const min = Number(process.env.TEMPLATE_DONATION_MIN || DEFAULT_MIN_AMOUNT);
  if (!Number.isFinite(min) || min <= 0) return false;
  if (Number(donation.amount) < min) return false;
  if (!donation.status || donation.status.toLowerCase() !== "completed") return false;
  const donatedAt = new Date(donation.donatedAt).getTime();
  if (Number.isNaN(donatedAt)) return false;
  const days = (now - donatedAt) / (1000 * 60 * 60 * 24);
  return days <= WINDOW_DAYS;
}

export function qualifyLatestDonation(latestDonation?: DonationRecord | null, now = Date.now()): QualifyResult {
  if (latestDonation && isDonationQualifying(latestDonation, now)) {
    return { qualifying: true, donationId: latestDonation.donationId, donatedAt: latestDonation.donatedAt };
  }
  return { qualifying: false };
}
