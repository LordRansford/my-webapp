import { getTestingOverrideDecision } from "@/lib/testingMode";

export default function TestingModeBanner() {
  const { allowed } = getTestingOverrideDecision();
  if (!allowed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-200 bg-amber-50 text-amber-900"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <p className="m-0 text-sm font-semibold">Testing mode is enabled. All pages are temporarily unlocked.</p>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
          NEXT_PUBLIC_TESTING_MODE=true
        </span>
      </div>
    </div>
  );
}


