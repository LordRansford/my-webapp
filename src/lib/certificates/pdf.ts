import crypto from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateCertificatePdf(params: {
  learnerName: string;
  learnerIdentifier: string;
  courseTitle: string;
  courseId: string;
  issuedDateISO: string;
  certificateId: string;
  cpdHours: number | null;
}) {
  const pdfDoc = await PDFDocument.create();

  // Metadata must not contain AI markers.
  pdfDoc.setAuthor("Ransford’s Notes");
  pdfDoc.setCreator("Ransford’s Notes");
  pdfDoc.setProducer("Ransford’s Notes");
  pdfDoc.setTitle("Certificate of Completion");

  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin = 56;
  let y = height - margin;

  const drawCentered = (text: string, size: number, color = rgb(0.05, 0.05, 0.08)) => {
    const textWidth = fontTitle.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font: fontTitle, color });
    y -= size + 12;
  };

  drawCentered("Certificate of Completion", 28);
  drawCentered("Ransford’s Notes CPD", 14, rgb(0.25, 0.25, 0.32));

  y -= 18;
  const bodyX = margin;
  const maxW = width - margin * 2;

  const drawLine = (label: string, value: string) => {
    page.drawText(label, { x: bodyX, y, size: 11, font: fontBody, color: rgb(0.35, 0.35, 0.4) });
    y -= 16;
    page.drawText(value, { x: bodyX, y, size: 14, font: fontTitle, color: rgb(0.05, 0.05, 0.08), maxWidth: maxW });
    y -= 26;
  };

  drawLine("Learner", params.learnerName || params.learnerIdentifier);
  drawLine("Course", `${params.courseTitle} (${params.courseId})`);
  drawLine("Date issued", params.issuedDateISO.slice(0, 10));
  drawLine("Certificate ID", params.certificateId);

  const hoursText = params.cpdHours && params.cpdHours > 0 ? `${params.cpdHours} hours` : "Not specified";
  drawLine("CPD hours", hoursText);

  y -= 10;
  const note =
    "This certificate confirms the learner completed the course activities recorded by Ransford’s Notes.";
  page.drawText(note, { x: bodyX, y, size: 11, font: fontBody, color: rgb(0.1, 0.1, 0.14), maxWidth: maxW });
  y -= 28;
  page.drawText("Support: sageransity@icloud.com", {
    x: bodyX,
    y,
    size: 10,
    font: fontBody,
    color: rgb(0.35, 0.35, 0.4),
  });

  // Simple border for a premium minimal feel.
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.82, 0.82, 0.86),
    borderWidth: 1,
  });

  const bytes = await pdfDoc.save();
  const sha256 = crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
  return { bytes: new Uint8Array(bytes), sha256 };
}


