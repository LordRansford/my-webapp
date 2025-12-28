import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePostPDF(
  title: string,
  contentElement: HTMLElement,
  watermark: string = "Ransford's Notes"
): Promise<Blob> {
  if (!contentElement) {
    throw new Error("Content element is required");
  }

  // Temporarily replace unsupported CSS color functions (like lab(), lch(), oklab(), oklch())
  // html2canvas doesn't support these modern color functions
  const originalStyles: Map<HTMLElement, string> = new Map();
  const allElements = contentElement.querySelectorAll("*");
  
  // Store and replace unsupported color functions
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlEl);
    const styleProps = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"];
    
    let needsReplacement = false;
    const replacements: { prop: string; value: string }[] = [];
    
    styleProps.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && (value.includes("lab(") || value.includes("lch(") || value.includes("oklab(") || value.includes("oklch("))) {
        needsReplacement = true;
        
        // Try to convert to RGB using a temporary element
        try {
          const tempEl = document.createElement("div");
          tempEl.style.setProperty(prop, value);
          tempEl.style.position = "absolute";
          tempEl.style.visibility = "hidden";
          document.body.appendChild(tempEl);
          const rgbValue = window.getComputedStyle(tempEl).getPropertyValue(prop);
          document.body.removeChild(tempEl);
          
          if (rgbValue && !rgbValue.includes("lab(") && !rgbValue.includes("lch(")) {
            replacements.push({ prop, value: rgbValue });
          } else {
            // Fallback to safe colors
            if (prop === "color") {
              replacements.push({ prop, value: "#000000" });
            } else if (prop.includes("background")) {
              replacements.push({ prop, value: "#ffffff" });
            } else {
              replacements.push({ prop, value: "#000000" });
            }
          }
        } catch {
          // Fallback to safe colors
          if (prop === "color") {
            replacements.push({ prop, value: "#000000" });
          } else if (prop.includes("background")) {
            replacements.push({ prop, value: "#ffffff" });
          } else {
            replacements.push({ prop, value: "#000000" });
          }
        }
      }
    });
    
    if (needsReplacement) {
      // Store original inline style
      originalStyles.set(htmlEl, htmlEl.getAttribute("style") || "");
      
      // Apply replacements
      replacements.forEach(({ prop, value }) => {
        htmlEl.style.setProperty(prop, value, "important");
      });
    }
  });

  // Convert HTML content to canvas
  let canvas;
  try {
    canvas = await html2canvas(contentElement, {
      scale: 1.5, // Reduced from 2 to avoid memory issues
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: contentElement.scrollWidth,
      height: contentElement.scrollHeight,
      windowWidth: contentElement.scrollWidth,
      windowHeight: contentElement.scrollHeight,
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.classList?.contains("blog-reading-progress") || false;
      },
    });
  } catch (error) {
    console.error("html2canvas error:", error);
    throw new Error(`Failed to capture content: ${error instanceof Error ? error.message : "Unknown error"}`);
  } finally {
    // Restore original styles
    originalStyles.forEach((style, element) => {
      if (style) {
        element.setAttribute("style", style);
      } else {
        element.removeAttribute("style");
      }
    });
  }

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

    // Calculate Y position for this page's content
    // Position the full image so the correct portion shows on each page
    const yOffset = height - margin - scaledHeight + (pageHeight * i);
    
    // Draw the content image first
    try {
      page.drawImage(pngImage, {
        x: margin,
        y: yOffset,
        width: contentWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error(`Error drawing image on page ${i + 1}:`, error);
      throw new Error(`Failed to add content to page ${i + 1}`);
    }

    // CRITICAL: Add watermark to EVERY page AFTER content (so it appears on top)
    // This ensures watermark is visible on all pages
    const centerX = width / 2;
    const centerY = height / 2;
    const watermarkSize = 50;
    const textWidth = watermarkFont.widthOfTextAtSize(watermark, watermarkSize);
    
    // Draw watermark on every page - MUST be on every page, drawn last so it's visible
    try {
      page.drawText(watermark, {
        x: centerX - textWidth / 2,
        y: centerY,
        size: watermarkSize,
        font: watermarkFont,
        color: rgb(0.85, 0.85, 0.85),
        opacity: 0.2, // Semi-transparent but visible
      });
    } catch (watermarkError) {
      console.error(`Failed to add watermark to page ${i + 1}:`, watermarkError);
      // Continue anyway - watermark failure shouldn't stop PDF generation
    }
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

  let pdfBytes;
  try {
    pdfBytes = await pdfDoc.save();
  } catch (error) {
    console.error("PDF save error:", error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  // Convert Uint8Array to Blob - pdfBytes is already compatible
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
