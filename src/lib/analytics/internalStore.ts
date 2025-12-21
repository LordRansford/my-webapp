import { type InternalToolEvent } from "@/lib/analytics/internalEvents";

type StoreOptions = {
  maxEvents: number;
  maxAgeMs: number;
};

const DEFAULTS: StoreOptions = {
  // Bounded in-memory store, suitable for low-volume internal analytics only.
  maxEvents: 20_000,
  maxAgeMs: 7 * 24 * 60 * 60 * 1000,
};

let events: InternalToolEvent[] = [];

function toMs(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

export function appendInternalToolEvent(e: InternalToolEvent, opts: Partial<StoreOptions> = {}) {
  const { maxEvents, maxAgeMs } = { ...DEFAULTS, ...opts };
  events.push(e);

  // Prune by age and cap size. Oldest-first.
  const cutoff = Date.now() - maxAgeMs;
  if (events.length > maxEvents || (events.length && toMs(events[0].timestamp) < cutoff)) {
    events = events.filter((x) => toMs(x.timestamp) >= cutoff);
    if (events.length > maxEvents) events = events.slice(events.length - maxEvents);
  }
}

export function getInternalToolEventsSince(sinceMs: number): InternalToolEvent[] {
  // Return a shallow copy for safety.
  return events.filter((e) => toMs(e.timestamp) >= sinceMs).slice();
}

export function getInternalToolEventStoreStats() {
  return { bufferedEvents: events.length };
}


