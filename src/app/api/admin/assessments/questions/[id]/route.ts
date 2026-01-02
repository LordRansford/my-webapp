import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { logAdminAction } from "@/lib/admin/audit";

function safeJsonString(value: any) {
  try {
    return JSON.stringify(value);
  } catch {
    return "null";
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-update", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const existing = await prisma.question.findUnique({
    where: { id },
    select: { id: true, assessmentId: true, tags: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as any;
  const reason = String(body?.reason || "").trim();
  const patch = body?.patch && typeof body.patch === "object" ? body.patch : null;
  const version = String(body?.version || "").trim();

  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  if (!version || version.length > 20) return NextResponse.json({ error: "Invalid version" }, { status: 400 });

  const versionTag = `v:${version}`;
  const existingTagOk = String(existing.tags || "").includes(versionTag);
  const patchTags = typeof patch?.tags === "string" ? String(patch.tags) : null;
  const nextTags = patchTags != null ? patchTags : existing.tags;
  if (!String(nextTags || "").includes(versionTag) || !existingTagOk) {
    return NextResponse.json({ error: "Version tag required" }, { status: 400 });
  }

  const nextQuestion = typeof patch?.question === "string" ? String(patch.question) : null;
  const nextExplanation = typeof patch?.explanation === "string" ? String(patch.explanation) : null;
  const nextBloom = patch?.bloomLevel != null ? Math.max(1, Math.min(6, Number(patch.bloomLevel) || 1)) : null;
  const nextOptions = Array.isArray(patch?.options) ? patch.options.map((x: any) => String(x || "").trim()).filter(Boolean) : null;
  const nextCorrect = patch?.correctAnswer;

  const data: any = { tags: nextTags };
  if (nextQuestion != null && nextQuestion.trim().length >= 10) data.question = nextQuestion.trim();
  if (nextExplanation != null && nextExplanation.trim().length >= 10) data.explanation = nextExplanation.trim();
  if (nextBloom != null) data.bloomLevel = nextBloom;
  if (nextOptions) data.options = safeJsonString(nextOptions);
  if (nextCorrect != null) data.correctAnswer = safeJsonString(nextCorrect);

  await prisma.question.update({ where: { id }, data });

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_ASSESSMENT_QUESTION",
    target: { targetType: "question", targetId: id },
    reason,
    req,
  }).catch(() => null);

  return NextResponse.json({ ok: true }, { status: 200 });
}

