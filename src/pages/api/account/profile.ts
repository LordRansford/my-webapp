import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getUserById } from "@/lib/auth/store";
import { getUserPlan } from "@/lib/billing/access";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const plan = await getUserPlan(userId);

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: (user as any).lastLoginAt || null,
      tier: (user as any).tier || "registered",
      consent: (user as any).consent || { termsAcceptedAt: null, privacyAcceptedAt: null, cpdDataUseAcceptedAt: null },
    },
    plan,
  });
}


