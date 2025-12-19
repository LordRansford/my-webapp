import { qualifyDonation, DonationQualification } from "@/lib/donations/qualify";
import { PermissionToken } from "@/lib/templates/store";

export type RequestedUse = "internal_use" | "commercial_use_keep_signature" | "commercial_use_remove_signature";
export type SupportMethod = "donation" | "written_permission" | "none";

export type SupportEvidence = {
  supportMethod?: SupportMethod;
  hasPermissionToken?: boolean;
  donationQualification?: DonationQualification;
};

export type EvaluateInput = {
  templateId: string;
  requestedUse: RequestedUse;
  userId?: string | null;
  anonymousUserId?: string | null;
  permissionTokens?: PermissionToken[];
  donationQualification?: DonationQualification;
};

export type EvaluateResult = {
  allowed: boolean;
  reason: string;
  uiMessage: string;
  mustKeepSignature: boolean;
  needsSupport: boolean;
  appliedSupportMethod?: SupportMethod;
  appliedDonationId?: string | null;
  appliedPermissionTokenId?: string | null;
};

export function requiresSupport({ requestedUse }: { requestedUse: RequestedUse }) {
  return requestedUse === "commercial_use_remove_signature";
}

export function canDownload({ requestedUse, supportEvidence }: { requestedUse: RequestedUse; supportEvidence?: SupportEvidence }) {
  if (requestedUse === "internal_use") {
    return { allowed: true, mustKeepSignature: false, needsSupport: false };
  }
  if (requestedUse === "commercial_use_keep_signature") {
    return { allowed: true, mustKeepSignature: true, needsSupport: false };
  }

  // commercial_use_remove_signature
  const hasDonation = Boolean(supportEvidence?.donationQualification?.qualifying);
  const hasPermissionToken = Boolean(supportEvidence?.hasPermissionToken);
  const supportMethod = supportEvidence?.supportMethod;

  const allowed = hasDonation || hasPermissionToken || supportMethod === "written_permission";
  return {
    allowed,
    mustKeepSignature: false,
    needsSupport: true,
  };
}

export function evaluateTemplateAccess(input: EvaluateInput): EvaluateResult {
  const { requestedUse, permissionTokens, donationQualification } = input;

  if (requestedUse === "internal_use") {
    return {
      allowed: true,
      reason: "internal-use",
      uiMessage: "You can use and remove the signature for internal work.",
      mustKeepSignature: false,
      needsSupport: false,
    };
  }

  if (requestedUse === "commercial_use_keep_signature") {
    return {
      allowed: true,
      reason: "commercial-keep-signature",
      uiMessage: "Commercial use is fine as long as the signature stays.",
      mustKeepSignature: true,
      needsSupport: false,
    };
  }

  // commercial_use_remove_signature
  const activeToken = permissionTokens?.[0];
  const donation = donationQualification ?? qualifyDonation({ userId: input.userId, anonymousUserId: input.anonymousUserId });
  const hasDonation = donation?.qualifying;
  const hasToken = Boolean(activeToken);

  if (hasDonation || hasToken) {
    return {
      allowed: true,
      reason: hasDonation ? "commercial-remove-with-donation" : "commercial-remove-with-permission-token",
      uiMessage: "You can remove the signature because you are supported.",
      mustKeepSignature: false,
      needsSupport: true,
      appliedSupportMethod: hasDonation ? "donation" : "written_permission",
      appliedDonationId: hasDonation ? donation?.donationId || null : null,
      appliedPermissionTokenId: activeToken?.tokenId || null,
    };
  }

  return {
    allowed: false,
    reason: "commercial-remove-requires-support",
    uiMessage: "To remove the signature, add a donation or provide your permission token.",
    mustKeepSignature: false,
    needsSupport: true,
  };
}
