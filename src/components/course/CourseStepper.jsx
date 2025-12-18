"use client";

import Link from "next/link";

export default function CourseStepper({ steps = [] }) {
  return (
    <ol className="mt-4 grid gap-3 md:grid-cols-3">
      {steps.map((step, idx) => (
        <li
          key={step.href || step.title}
          className="flex flex-col rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="eyebrow text-gray-600">Step {idx + 1}</p>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            </div>
            {step.badge ? (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {step.badge}
              </span>
            ) : null}
          </div>
          {step.description ? <p className="mt-2 text-sm text-gray-800">{step.description}</p> : null}
          {step.href ? (
            <Link
              href={step.href}
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
              aria-label={`Go to ${step.title}`}
            >
              Go to {step.title} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
