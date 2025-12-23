import { z } from "zod";
import { ARCH_DIAGRAM_LIMITS, CONTROL_CHAR_REGEX, CONTROL_CHAR_TEST_REGEX } from "./limits";

const cleanText = (value: unknown) =>
  String(value ?? "")
    .replace(CONTROL_CHAR_REGEX, "")
    .replace(/\s+/g, " ")
    .trim();

const boundedText = (max: number, label: string) =>
  z
    .string()
    .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: `${label} contains invalid control characters.` })
    .transform((v) => cleanText(v))
    .refine((v) => v.length > 0, { message: `${label} is required.` })
    .refine((v) => v.length <= max, { message: `${label} must be ${max} characters or fewer.` });

export const AudienceSchema = z.enum(["kids", "students", "professionals"]);
export const GoalSchema = z.enum(["explain", "design-review", "security-review", "data-review", "cpd"]);

export const ContainerTypeSchema = z.enum(["ui", "api", "worker", "database", "third-party"]);

export const ActorSchema = z.object({
  name: boundedText(60, "Actor name"),
});

export const ExternalSystemSchema = z.object({
  name: boundedText(80, "External system name"),
});

export const ContainerSchema = z.object({
  name: boundedText(80, "Container name"),
  type: ContainerTypeSchema,
  description: z
    .string()
    .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "Container description contains invalid control characters." })
    .transform(cleanText)
    .refine((v) => v.length <= 200, { message: "Container description must be 200 characters or fewer." }),
});

export const DataTypeSchema = z.enum(["pii", "financial", "telemetry", "credentials", "health", "other"]);

export const DataStoreSchema = z.object({
  name: boundedText(80, "Data store name"),
  description: z
    .string()
    .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "Data store description contains invalid control characters." })
    .transform(cleanText)
    .refine((v) => v.length <= 200, { message: "Data store description must be 200 characters or fewer." }),
});

export const FlowSchema = z.object({
  from: boundedText(80, "Flow from"),
  to: boundedText(80, "Flow to"),
  purpose: boundedText(140, "Flow purpose"),
  sensitive: z.boolean().default(false),
});

export const SecuritySchema = z.object({
  authenticationMethod: z
    .string()
    .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "Authentication method contains invalid control characters." })
    .transform(cleanText)
    .refine((v) => v.length <= 120, { message: "Authentication method must be 120 characters or fewer." }),
  trustBoundaries: z
    .array(
      z
        .string()
        .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "Trust boundary contains invalid control characters." })
        .transform(cleanText)
        .refine((v) => v.length > 0, { message: "Trust boundary cannot be empty." }),
    )
    .max(ARCH_DIAGRAM_LIMITS.maxActors)
    .default([]),
  hasNoTrustBoundariesConfirmed: z.boolean().default(false),
  adminAccess: z.boolean().default(false),
  sensitiveDataCategories: z.array(DataTypeSchema).max(ARCH_DIAGRAM_LIMITS.maxDataTypes).default([]),
});

export const ArchitectureDiagramInputSchema = z
  .object({
    systemName: boundedText(ARCH_DIAGRAM_LIMITS.maxSystemNameChars, "System name"),
    systemDescription: z
      .string()
      .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "System description contains invalid control characters." })
      .transform(cleanText)
      .refine((v) => v.length > 0, { message: "System description is required." })
      .refine((v) => v.length <= ARCH_DIAGRAM_LIMITS.maxSystemDescriptionChars, {
        message: `System description must be ${ARCH_DIAGRAM_LIMITS.maxSystemDescriptionChars} characters or fewer.`,
      }),
    audience: AudienceSchema,
    goal: GoalSchema,
    users: z.array(ActorSchema).max(ARCH_DIAGRAM_LIMITS.maxActors).default([]),
    externalSystems: z.array(ExternalSystemSchema).max(ARCH_DIAGRAM_LIMITS.maxExternalSystems).default([]),
    containers: z.array(ContainerSchema).max(ARCH_DIAGRAM_LIMITS.maxContainers).default([]),
    dataTypes: z.array(DataTypeSchema).max(ARCH_DIAGRAM_LIMITS.maxDataTypes).default([]),
    dataStores: z.array(DataStoreSchema).max(ARCH_DIAGRAM_LIMITS.maxDataStores).default([]),
    flows: z.array(FlowSchema).max(ARCH_DIAGRAM_LIMITS.maxFlows).default([]),
    security: SecuritySchema,
    versionName: z
      .string()
      .refine((v) => !CONTROL_CHAR_TEST_REGEX.test(v), { message: "Version name contains invalid control characters." })
      .transform(cleanText)
      .refine((v) => v.length <= 60, { message: "Version name must be 60 characters or fewer." })
      .optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    const total = JSON.stringify(val).length;
    if (total > ARCH_DIAGRAM_LIMITS.maxTotalTextChars) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Input is too large. Reduce descriptions, flows, or items.",
        path: ["systemDescription"],
      });
    }
  });

export type ArchitectureDiagramInput = z.infer<typeof ArchitectureDiagramInputSchema>;


