import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

type Store = { processedEventIds: string[] };

const PATH = process.env.STRIPE_EVENTS_STORE_PATH || "data/stripe-events.json";
const empty: Store = { processedEventIds: [] };

function load() {
  return readJsonFile<Store>(PATH, empty);
}

function save(store: Store) {
  writeJsonFile(PATH, store);
}

export function hasProcessedEvent(eventId: string) {
  const s = load();
  return s.processedEventIds.includes(eventId);
}

export function markProcessedEvent(eventId: string) {
  const s = load();
  if (!s.processedEventIds.includes(eventId)) {
    s.processedEventIds.push(eventId);
    // keep file bounded
    if (s.processedEventIds.length > 2000) s.processedEventIds = s.processedEventIds.slice(-1500);
    save(s);
  }
}


