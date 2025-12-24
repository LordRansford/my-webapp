type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

export class PersistStore {
  private prefix: string;
  private version: string;

  constructor(opts: { prefix: string; version: string }) {
    this.prefix = opts.prefix;
    this.version = opts.version;
  }

  private key(k: string) {
    return `${this.prefix}:${this.version}:${k}`;
  }

  get<T extends JsonValue>(k: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(this.key(k));
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  set<T extends JsonValue>(k: string, v: T) {
    try {
      window.localStorage.setItem(this.key(k), JSON.stringify(v));
    } catch {
      // ignore (private mode / quota)
    }
  }
}


