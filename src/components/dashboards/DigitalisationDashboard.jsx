"use client";

import DigitalisationTool from "@/components/notes/tools/architecture/advanced/DigitalisationDashboard";

export default function DigitalisationDashboard() {
  return (
    <section className="rn-card rn-mt">
      <div className="rn-card-title">Digitalisation and delivery dashboard</div>
      <div className="rn-card-body">
        Pick the signals you will watch. The goal is to see delivery speed, stability, and cost trends together so decisions stay grounded.
      </div>
      <DigitalisationTool />
    </section>
  );
}
