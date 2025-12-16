"use client";

import Link from "next/link";
import { track } from "@/lib/analytics/track";

const checklist = [
  "Explain CIA, trust boundaries, and attack surface to a friend",
  "Model a simple system with assets, actors, and controls",
  "Describe how sessions fail and how to defend them",
  "Choose the right crypto primitive for a given goal",
  "Place signals to detect an incident before data leaves",
];

export default function NextSteps() {
  return (
    <section className="mt-8 rounded-2xl border bg-white/70 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reflection and next steps</h2>
          <p className="text-sm text-gray-700 mt-1">If you can do these, you have the core foundations.</p>
        </div>
        <Link
          href="/subscribe"
          className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
          onClick={() => track("summary_subscribe_click")}
        >
          Subscribe for updates
        </Link>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-gray-800">
        {checklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href="/notes/cybersecurity/beginner"
          className="rounded-full border px-3 py-1 text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Beginner
        </Link>
        <Link
          href="/notes/cybersecurity/intermediate"
          className="rounded-full border px-3 py-1 text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Intermediate
        </Link>
        <Link
          href="/notes/cybersecurity/advanced"
          className="rounded-full border px-3 py-1 text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Advanced
        </Link>
      </div>
    </section>
  );
}
