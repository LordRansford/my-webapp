import { NextResponse } from "next/server";
import { resetUsage, getUsage } from "@/lib/mentor/usage";

export async function POST() {
  const enabled = process.env.MENTOR_ADMIN_ENABLED === "true";
  if (!enabled) return NextResponse.json({ message: "Admin disabled" }, { status: 404 });
  resetUsage();
  return NextResponse.json({ ok: true, usage: getUsage() });
}


