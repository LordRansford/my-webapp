import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePostPDF(
  title: string,
  contentElement: HTMLElement,
  watermark: string = "Ransford's Notes"
): Promise<Blob> {
  // Convert HTML content to canvas
  const canvas = await html2canvas(contentElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: contentElement.scrollWidth,
    windowHeight: contentElement.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const pdfWidth = 595; // A4 width in points
  const pdfHeight = 842; // A4 height in points
  
  const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Calculate dimensions
  const margin = 50;
  const contentWidth = pdfWidth - 2 * margin;
  const scale = contentWidth / imgWidth;
  const scaledHeight = imgHeight * scale;
  const pageHeight = pdfHeight - 2 * margin;
  const pagesNeeded = Math.ceil(scaledHeight / pageHeight);

  // Embed the image
  const pngImage = await pdfDoc.embedPng(imgData);
  
  // Create pages with content split across them
  for (let i = 0; i < pagesNeeded; i++) {
    const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
    const { width, height } = page.getSize();

    // Add watermark to each page (centered, semi-transparent)
    // For simplicity, we'll use a non-rotated watermark
    const centerX = width / 2;
    const centerY = height / 2;
    const textWidth = watermarkFont.widthOfTextAtSize(watermark, 40);
    
    page.drawText(watermark, {
      x: centerX - textWidth / 2,
      y: centerY,
      size: 40,
      font: watermarkFont,
      color: rgb(0.85, 0.85, 0.85),
      opacity: 0.15,
    });

    // Calculate Y position for this page's content
    // Position the full image so the correct portion shows on each page
    const yOffset = height - margin - scaledHeight + (pageHeight * i);
    
    // Draw the full image, positioned to show the correct portion
    // The image will be clipped by page boundaries naturally
    page.drawImage(pngImage, {
      x: margin,
      y: yOffset,
      width: contentWidth,
      height: scaledHeight,
    });
  }

  // Add footer to last page
  const lastPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
  const footerText = "ransfordsnotes.com";
  const footerFontSize = 8;
  
  lastPage.drawText(footerText, {
    x: pdfWidth / 2 - (font.widthOfTextAtSize(footerText, footerFontSize) / 2),
    y: 30,
    size: footerFontSize,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  // Convert Uint8Array to Blob - pdfBytes is already compatible
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
