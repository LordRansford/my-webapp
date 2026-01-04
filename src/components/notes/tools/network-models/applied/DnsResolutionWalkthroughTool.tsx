"use client";

import { useMemo, useState } from "react";

type Step = {
  title: string;
  detail: string;
  evidence: string;
};

type Mode = "cache-hit" | "full-walk";

export default function DnsResolutionWalkthroughTool() {
  const [domain, setDomain] = useState("www.example.com");
  const [mode, setMode] = useState<Mode>("full-walk");
  const [recordType, setRecordType] = useState<"A" | "AAAA" | "CNAME">("A");

  const steps = useMemo<Step[]>(() => {
    const d = domain.trim() || "www.example.com";
    if (mode === "cache-hit") {
      return [
        {
          title: "1. Browser or OS cache",
          detail: `A cached answer exists for ${d}. The resolver returns it immediately.`,
          evidence: "Repeated loads are fast. A short TTL can make this change over time.",
        },
        {
          title: "2. Use the answer",
          detail: `The application uses the returned record and proceeds to connect to the destination.`,
          evidence: "DevTools Network shows the connect step. DNS lookup time is small or zero.",
        },
      ];
    }

    return [
      {
        title: "1. Stub resolver asks the configured recursive resolver",
        detail: `Your device sends a ${recordType} query for ${d} to the recursive resolver.`,
        evidence: "On many systems you can inspect the configured resolver. It is often your router or a public resolver.",
      },
      {
        title: "2. Recursive resolver checks its cache",
        detail: "If the answer is cached and still valid, it can respond immediately.",
        evidence: "The same name can resolve quickly for one user and slowly for another because caches differ.",
      },
      {
        title: "3. Recursive resolver queries a root server",
        detail: "Root servers do not know the final answer. They provide a referral to the correct TLD name servers.",
        evidence: "A referral is not the end result. It is a pointer to the next authority.",
      },
      {
        title: "4. Recursive resolver queries the TLD name server",
        detail: "The TLD server provides a referral to the authoritative name servers for the domain.",
        evidence: "This is where delegation is enforced. Misconfigurations often show up as SERVFAIL or timeouts.",
      },
      {
        title: "5. Recursive resolver queries the authoritative name server",
        detail: `The authoritative server returns the ${recordType} answer, or a CNAME chain, or an error such as NXDOMAIN.`,
        evidence: "dig and nslookup can show the response codes and the authority section.",
      },
      {
        title: "6. The recursive resolver caches the answer",
        detail: "Caching is bounded by TTL. Lower TTL gives faster change propagation but increases query load.",
        evidence: "DNS changes can appear inconsistent during TTL windows.",
      },
      {
        title: "7. The stub resolver returns the answer to the application",
        detail: "Now the browser can proceed to connect to the chosen IP address.",
        evidence: "DevTools shows DNS lookup time. It can be near zero on repeats due to cache.",
      },
    ];
  }, [domain, mode, recordType]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Domain name</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="www.example.com"
            aria-label="Domain name"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Record type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-700 dark:text-slate-200">
          DNS is a delegation system. Most client queries are resolved via a recursive resolver.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("full-walk")}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold border transition ${
              mode === "full-walk"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900/40"
            }`}
          >
            Full walk
          </button>
          <button
            type="button"
            onClick={() => setMode("cache-hit")}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold border transition ${
              mode === "cache-hit"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900/40"
            }`}
          >
            Cache hit
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {steps.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{s.detail}</div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">{s.evidence}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        If you can state the exact step that failed, you can choose a correct fix. DNS failures are often cache, delegation,
        or connectivity.
      </div>
    </div>
  );
}

