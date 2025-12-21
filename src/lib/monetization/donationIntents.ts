import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";
import crypto from "crypto";

export type DonationIntentStatus = "draft";

export type DonationIntentDraft = {
  id: string;
  userId?: string | null;
  amount: number;
  currency: string;
  status: DonationIntentStatus;
  createdAt: string;
};

type Store = { drafts: DonationIntentDraft[] };

const PATH = process.env.DONATION_INTENTS_PATH || "data/donation-intents.json";
const empty: Store = { drafts: [] };

function load() {
  return readJsonFile<Store>(PATH, empty);
}

function save(store: Store) {
  writeJsonFile(PATH, store);
}

export function createDonationIntentDraft(input: { userId?: string | null; amount: number; currency: string }) {
  const store = load();
  const draft: DonationIntentDraft = {
    id: crypto.randomUUID(),
    userId: input.userId || null,
    amount: input.amount,
    currency: input.currency,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  store.drafts.push(draft);
  save(store);
  return draft;
}


