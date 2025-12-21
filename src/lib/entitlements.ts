import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getUserPlan } from "@/lib/billing/access";
import type { AccessLevel } from "./accessLevels";
import { RoleCapabilities, roleHasCapability as roleHasCapabilityJs } from "./entitlements.capabilities";

export type Capability =
  | "canDownloadTemplates"
  | "canExportCPDCertificates"
  | "canAccessAdvancedLabs"
  | "canSaveUnlimitedProgress"
  | "canUseProfessionalDashboards";

export async function getUserRole(): Promise<AccessLevel> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return "public";
  const plan = await getUserPlan(session.user.id);
  if (plan === "supporter") return "supporter";
  if (plan === "pro") return "professional";
  return "registered";
}

export async function getUserEntitlements(): Promise<{ role: AccessLevel; capabilities: Capability[] }> {
  const role = await getUserRole();
  return { role, capabilities: (RoleCapabilities as Record<string, Capability[]>)[role] || [] };
}

export function roleHasCapability(role: AccessLevel, capability: Capability) {
  return roleHasCapabilityJs(role, capability);
}



