export type UsageMode = "internal" | "commercial-with" | "commercial-no-attr";

export type ExportFormat = "pdf" | "docx" | "web" | "print";

export type ExportPolicy = {
  allowed: boolean;
  enforceAttribution: boolean;
  requireDonation: boolean;
  message: string;
  formats: ExportFormat[];
};

export const allowedFormats: ExportFormat[] = ["pdf", "docx", "web", "print"];

export function evaluateExportPolicy(
  usageMode: UsageMode,
  opts: { hasDonation?: boolean; hasPermission?: boolean } = {}
): ExportPolicy {
  const { hasDonation = false, hasPermission = false } = opts;

  if (usageMode === "internal") {
    return {
      allowed: true,
      enforceAttribution: false,
      requireDonation: false,
      message: "Export allowed for personal or internal use. Marked as internal-only in metadata.",
      formats: allowedFormats,
    };
  }

  if (usageMode === "commercial-with") {
    return {
      allowed: true,
      enforceAttribution: true,
      requireDonation: false,
      message: "Export allowed with attribution locked into footer and metadata.",
      formats: allowedFormats,
    };
  }

  const hasEntitlement = hasDonation || hasPermission;
  return {
    allowed: hasEntitlement,
    enforceAttribution: false,
    requireDonation: true,
    message: hasEntitlement
      ? "Export unlocked with donation or permission token. Attribution optional."
      : "Export blocked for commercial use without attribution. Add a donation receipt or permission token to proceed.",
    formats: hasEntitlement ? allowedFormats : [],
  };
}
