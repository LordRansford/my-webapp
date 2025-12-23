import crypto from "node:crypto";

function base64Url(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

export async function issueCpdCertificateCore(params) {
  const prisma = params.prisma;
  const userId = String(params.userId || "").trim();
  const courseId = String(params.courseId || "").trim();
  const courseVersion = String(params.courseVersion || "").trim();
  const creditsCost = Math.max(0, Math.round(Number(params.creditsCost) || 0));
  const issuer = String(params.issuer || "RansfordsNotes");

  if (!userId || !courseId || !courseVersion) throw new Error("INVALID_INPUT");

  const existingRows = await prisma.$queryRaw`
    SELECT id, certificateHash, creditsUsed
    FROM Certificate
    WHERE userId = ${userId} AND courseId = ${courseId} AND courseVersion = ${courseVersion}
    LIMIT 1
  `;
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  if (existing) return { certificateId: existing.id, certificateHash: existing.certificateHash, creditsUsed: existing.creditsUsed };

  const completionRows = await prisma.$queryRaw`
    SELECT passed
    FROM CourseCompletion
    WHERE userId = ${userId} AND courseId = ${courseId} AND courseVersion = ${courseVersion}
    LIMIT 1
  `;
  const completion = Array.isArray(completionRows) ? completionRows[0] : null;
  if (!completion || !completion.passed) throw new Error("CERT_NOT_ELIGIBLE");

  const creditsRows = await prisma.$queryRaw`
    SELECT balance
    FROM Credits
    WHERE userId = ${userId}
    LIMIT 1
  `;
  const balance = Array.isArray(creditsRows) && creditsRows[0] ? Number(creditsRows[0].balance) : 0;
  if (balance < creditsCost) throw new Error("INSUFFICIENT_CREDITS");

  const hash = base64Url(crypto.randomBytes(24));
  const id = crypto.randomUUID();

  await prisma.$transaction(async (tx) => {
    const againRows = await tx.$queryRaw`
      SELECT id, certificateHash, creditsUsed
      FROM Certificate
      WHERE userId = ${userId} AND courseId = ${courseId} AND courseVersion = ${courseVersion}
      LIMIT 1
    `;
    const again = Array.isArray(againRows) ? againRows[0] : null;
    if (again) return;

    await tx.$executeRaw`
      UPDATE Credits
      SET balance = balance - ${creditsCost}
      WHERE userId = ${userId}
    `;

    await tx.$executeRaw`
      INSERT INTO Certificate (id, userId, courseId, courseVersion, issuedAt, certificateHash, pdfKey, creditsUsed, issuer, status, createdAt)
      VALUES (${id}, ${userId}, ${courseId}, ${courseVersion}, CURRENT_TIMESTAMP, ${hash}, ${"test.pdf"}, ${creditsCost}, ${issuer}, ${"issued"}, CURRENT_TIMESTAMP)
    `;
  });

  const createdRows = await prisma.$queryRaw`
    SELECT id, certificateHash, creditsUsed
    FROM Certificate
    WHERE id = ${id}
    LIMIT 1
  `;
  const created = Array.isArray(createdRows) ? createdRows[0] : null;
  return { certificateId: created.id, certificateHash: created.certificateHash, creditsUsed: created.creditsUsed };
}


