import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function shortId(value: string, len: number) {
  const s = String(value || "").trim();
  return s.length <= len ? s : s.slice(0, len);
}

export async function generateCpdCertificatePdf(params: {
  issuer: string;
  learnerDisplayName: string;
  learnerInitials: string;
  courseTitle: string;
  courseId: string;
  courseVersion: string;
  completionDateISO: string;
  issuedAtISO: string;
  certificateId: string;
  certificateHash: string;
  verifyUrl: string;
  cpdHours?: number | null;
}) {
  const pdfDoc = await PDFDocument.create();

  // Metadata must not include AI markers.
  pdfDoc.setAuthor("Ransford’s Notes");
  pdfDoc.setCreator("Ransford’s Notes");
  pdfDoc.setProducer("Ransford’s Notes");
  pdfDoc.setTitle("CPD Certificate of Completion");

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const accent = rgb(0.1, 0.2, 0.55);
  const ink = rgb(0.05, 0.05, 0.08);
  const muted = rgb(0.35, 0.35, 0.4);

  const margin = 56;
  let y = height - margin;

  // Header
  page.drawText(params.issuer, { x: margin, y, size: 14, font: fontBold, color: ink });
  y -= 18;
  page.drawRectangle({ x: margin, y, width: 120, height: 4, color: accent });
  y -= 28;

  const title = "CPD Certificate of Completion";
  const titleW = fontBold.widthOfTextAtSize(title, 26);
  page.drawText(title, { x: (width - titleW) / 2, y, size: 26, font: fontBold, color: ink });
  y -= 40;

  // Body
  const centerX = width / 2;
  const line = (text: string, size = 12, color = muted) => {
    const w = fontBody.widthOfTextAtSize(text, size);
    page.drawText(text, { x: centerX - w / 2, y, size, font: fontBody, color });
    y -= size + 10;
  };

  const learner = params.learnerDisplayName || params.learnerInitials || "Learner";
  line("This certifies that", 12, muted);
  const learnerW = fontBold.widthOfTextAtSize(learner, 22);
  page.drawText(learner, { x: centerX - learnerW / 2, y, size: 22, font: fontBold, color: ink });
  y -= 34;
  line("has successfully completed", 12, muted);

  const courseW = fontBold.widthOfTextAtSize(params.courseTitle, 18);
  page.drawText(params.courseTitle, { x: centerX - Math.min(courseW, width - 2 * margin) / 2, y, size: 18, font: fontBold, color: ink, maxWidth: width - 2 * margin });
  y -= 30;

  const metaLine = (label: string, value: string) => {
    page.drawText(label, { x: margin, y, size: 11, font: fontBody, color: muted });
    page.drawText(value, { x: margin + 170, y, size: 11, font: fontBody, color: ink });
    y -= 18;
  };

  y -= 6;
  metaLine("Course ID", params.courseId);
  metaLine("Course version", params.courseVersion);
  metaLine("Completion date", params.completionDateISO.slice(0, 10));
  if (params.cpdHours && params.cpdHours > 0) {
    metaLine("CPD hours", String(params.cpdHours));
  }

  y -= 14;

  // Footer box
  const boxY = 90;
  page.drawRectangle({
    x: margin,
    y: boxY,
    width: width - 2 * margin,
    height: 150,
    borderColor: rgb(0.82, 0.82, 0.86),
    borderWidth: 1,
  });

  const fY0 = boxY + 120;
  const leftX = margin + 14;
  const rightX = width / 2 + 10;

  page.drawText(`Issued by: ${params.issuer}`, { x: leftX, y: fY0, size: 10, font: fontBody, color: muted });
  page.drawText(`Issued date: ${params.issuedAtISO.slice(0, 10)}`, { x: leftX, y: fY0 - 16, size: 10, font: fontBody, color: muted });
  page.drawText(`Certificate ID: ${shortId(params.certificateId, 8)}`, { x: leftX, y: fY0 - 32, size: 10, font: fontBody, color: muted });

  page.drawText(`Verification URL: ${params.verifyUrl}`, { x: leftX, y: fY0 - 54, size: 9, font: fontBody, color: ink, maxWidth: width - 2 * margin - 28 });
  page.drawText(`Verification hash: ${shortId(params.certificateHash, 12)}`, { x: rightX, y: fY0, size: 10, font: fontBody, color: muted });

  page.drawText(
    "This page verifies that a certificate was issued by RansfordsNotes for this course and version.",
    { x: leftX, y: boxY + 32, size: 9, font: fontBody, color: muted, maxWidth: width - 2 * margin - 28 },
  );
  page.drawText(
    "This certificate confirms completion of the course. It does not imply third party accreditation.",
    { x: leftX, y: boxY + 16, size: 9, font: fontBody, color: muted, maxWidth: width - 2 * margin - 28 },
  );

  // Outer border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.82, 0.82, 0.86),
    borderWidth: 1,
  });

  const bytes = await pdfDoc.save();
  return { bytes: new Uint8Array(bytes) };
}


