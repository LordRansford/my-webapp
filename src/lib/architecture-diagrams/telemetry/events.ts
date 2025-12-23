import { z } from "zod";

export const DiagramTypeSchema = z.enum(["context", "container", "deployment", "dfd", "sequence"]);
export const VariantIdSchema = z.enum(["minimal", "stakeholder", "security", "data", "ops"]);
export const AudienceSchema = z.enum(["kids", "students", "professionals"]);
export const GoalSchema = z.enum(["explain", "design-review", "security-review", "data-review", "cpd"]);
export const PageSizeSchema = z.enum(["A4", "A3"]);

export const OutcomeSchema = z.enum(["ok", "rejected", "rate_limited", "too_large", "sanitise_failed", "timeout", "failed"]);

export const DurationBucketSchema = z.enum(["0-200", "200-800", "800+"]);

export const EventNameSchema = z.enum([
  "generation_requested",
  "generation_completed",
  "variant_selected",
  "export_svg",
  "export_png",
  "export_pdf_requested",
  "export_pdf_succeeded",
  "export_pdf_failed",
]);

export const ArchitectureTelemetryEventSchema = z
  .object({
    event: EventNameSchema,
    diagramType: DiagramTypeSchema.optional(),
    variantId: VariantIdSchema.optional(),
    audience: AudienceSchema.optional(),
    goal: GoalSchema.optional(),
    pageSize: PageSizeSchema.optional(),
    outcome: OutcomeSchema.optional(),
    durationBucket: DurationBucketSchema.optional(),
    ts: z.string().optional(),
  })
  .strict();

export type ArchitectureTelemetryEvent = z.infer<typeof ArchitectureTelemetryEventSchema>;

export function bucketDurationMs(ms: number | null | undefined): z.infer<typeof DurationBucketSchema> | undefined {
  if (ms === null || ms === undefined) return undefined;
  const n = Math.max(0, Number(ms));
  if (n < 200) return "0-200";
  if (n < 800) return "200-800";
  return "800+";
}


