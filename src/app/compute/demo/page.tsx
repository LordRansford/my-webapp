import ComputeMeter from "@/components/ComputeMeter";

export const dynamic = "force-static";

export default function ComputeDemoPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Compute</p>
        <h1 className="text-3xl font-semibold text-slate-900">Compute meter examples</h1>
        <p className="text-slate-700">
          These are example receipts to preview the UI states. Real runs may differ based on input size and tool limits.
        </p>
      </header>

      <section id="free-run" className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Free tier run</h2>
        <ComputeMeter
          estimate={{
            estimatedCpuMs: 900,
            estimatedWallTimeMs: 900,
            estimatedCreditCost: 0,
            freeTierAppliedMs: 900,
            paidMs: 0,
            allowed: true,
            reasons: [],
          }}
          actual={{ durationMs: 820, freeTierAppliedMs: 820, paidMs: 0, creditsCharged: 0 }}
          tier={{ freeMsRemainingToday: 12_000 }}
          remainingCredits={42}
          runStatus="success"
          costHints={["Try smaller inputs first.", "Avoid rerunning unchanged inputs.", "Use free tier preview before scaling up."]}
          compact={false}
        />
      </section>

      <section id="paid-run" className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Paid tier run</h2>
        <ComputeMeter
          estimate={{
            estimatedCpuMs: 22_000,
            estimatedWallTimeMs: 22_000,
            estimatedCreditCost: 3,
            freeTierAppliedMs: 9_000,
            paidMs: 13_000,
            allowed: true,
            reasons: [],
          }}
          actual={{ durationMs: 24_100, freeTierAppliedMs: 9_000, paidMs: 15_100, creditsCharged: 4 }}
          tier={{ freeMsRemainingToday: 9_000 }}
          remainingCredits={18}
          runStatus="success"
          costHints={["Reduce sample size.", "Disable optional heavy analysis.", "Use a lighter preset first."]}
          compact={false}
        />
      </section>

      <section id="blocked-run" className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Blocked due to insufficient credits</h2>
        <ComputeMeter
          estimate={{
            estimatedCpuMs: 30_000,
            estimatedWallTimeMs: 30_000,
            estimatedCreditCost: 6,
            freeTierAppliedMs: 2_000,
            paidMs: 28_000,
            allowed: false,
            reasons: ["Not enough credits for the expected paid portion. Use a lighter preset or reduce input size."],
          }}
          actual={null}
          tier={{ freeMsRemainingToday: 2_000 }}
          remainingCredits={1}
          runStatus="blocked"
          costHints={["Use free tier mode for a smaller result.", "Reduce input size.", "Try a lighter preset."]}
          compact={false}
        />
      </section>
    </main>
  );
}


