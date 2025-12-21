import { type ToolResult } from "@/lib/tooling/result";

type PostJsonOptions = {
  signal?: AbortSignal;
};

export async function postJson<T>(url: string, body: unknown, options: PostJsonOptions = {}): Promise<ToolResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: options.signal,
    });

    // Always attempt JSON but do not throw if it fails.
    const data = (await res.json().catch(() => null)) as T | null;

    if (!res.ok) return { ok: false, kind: "server", status: res.status };
    if (data === null) return { ok: false, kind: "bad_response", status: res.status };
    return { ok: true, data };
  } catch (e: any) {
    if (e?.name === "AbortError") return { ok: false, kind: "aborted" };
    return { ok: false, kind: "network" };
  }
}


