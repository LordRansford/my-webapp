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

  // Helper function to convert any color value to RGB
  const convertColorToRGB = (colorValue: string, property: string): string => {
    if (!colorValue || colorValue === "none" || colorValue === "transparent") {
      return colorValue;
    }
    
    // Check if it contains unsupported color functions
    const hasUnsupportedColor = /(lab|lch|oklab|oklch)\(/i.test(colorValue);
    if (!hasUnsupportedColor) {
      return colorValue;
    }
    
    // Try multiple conversion strategies
    try {
      // Strategy 1: Use a temporary element to force browser conversion
      const tempEl = document.createElement("div");
      tempEl.style.setProperty(property, colorValue, "important");
      tempEl.style.position = "fixed";
      tempEl.style.top = "-9999px";
      tempEl.style.left = "-9999px";
      tempEl.style.width = "1px";
      tempEl.style.height = "1px";
      tempEl.style.opacity = "0";
      tempEl.style.pointerEvents = "none";
      tempEl.style.visibility = "hidden";
      document.body.appendChild(tempEl);
      
      // Force a reflow to ensure styles are computed
      void tempEl.offsetHeight;
      
      const computed = window.getComputedStyle(tempEl);
      let rgbValue = computed.getPropertyValue(property);
      
      // If property name doesn't match, try camelCase version
      if (!rgbValue || rgbValue === colorValue) {
        const camelProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        rgbValue = computed.getPropertyValue(camelProp);
      }
      
      document.body.removeChild(tempEl);
      
      // Check if conversion was successful (should be rgb(), rgba(), or hex)
      if (rgbValue && rgbValue.trim() && !/(lab|lch|oklab|oklch)\(/i.test(rgbValue)) {
        return rgbValue.trim();
      }
      
      // Strategy 2: If browser didn't convert, try to parse and approximate
      // This is a fallback - modern browsers should handle the conversion above
      const labMatch = colorValue.match(/lab\(([^)]+)\)/i);
      const lchMatch = colorValue.match(/lch\(([^)]+)\)/i);
      const oklabMatch = colorValue.match(/oklab\(([^)]+)\)/i);
      const oklchMatch = colorValue.match(/oklch\(([^)]+)\)/i);
      
      // For now, just return a safe fallback - proper color space conversion would require a library
      // The browser conversion above should work in most cases
    } catch (e) {
      console.warn("Color conversion failed:", e);
    }
    
    // Fallback to safe colors based on property type
    if (property.includes("background") || property.includes("Background")) {
      return "#ffffff";
    } else if (property.includes("border") || property.includes("Border") || property.includes("outline") || property.includes("Outline")) {
      return "#000000";
    } else {
      // For text color, use black
      return "#000000";
    }
  };
  
  // First, scan for elements with modern color functions and create targeted CSS overrides
  // This is more efficient than processing each element individually
  const styleId = "pdf-color-override";
  let overrideStyle: HTMLStyleElement | null = null;
  
  const allElementsToCheck = [contentElement, ...Array.from(contentElement.querySelectorAll("*"))] as HTMLElement[];
  const overrideRules: string[] = [];
  const processedSelectors = new Set<string>();
  
  allElementsToCheck.forEach((el, index) => {
    const computedStyle = window.getComputedStyle(el);
    const styleProps = ["color", "backgroundColor", "borderColor"];
    
    styleProps.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && /(lab|lch|oklab|oklch)\(/i.test(value)) {
        // Create a unique selector for this element
        let selector: string;
        if (el.id) {
          selector = `#${el.id}`;
        } else if (el.className) {
          selector = `.${el.className.split(" ").filter(c => c).join(".")}`;
        } else {
          selector = `[data-pdf-override-${index}]`;
          el.setAttribute(`data-pdf-override-${index}`, "");
        }
        
        if (!processedSelectors.has(selector)) {
          processedSelectors.add(selector);
          const rgbValue = convertColorToRGB(value, prop);
          const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          overrideRules.push(`${selector} { ${cssProp}: ${rgbValue} !important; }`);
        }
      }
    });
  });
  
  // Inject CSS override if we found modern color functions
  if (overrideRules.length > 0) {
    overrideStyle = document.createElement("style");
    overrideStyle.id = styleId;
    overrideStyle.textContent = overrideRules.join("\n");
    document.head.appendChild(overrideStyle);
    
    // Wait a frame for styles to apply
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  
  // Also process elements directly to ensure all colors are converted
  const originalStyles: Map<HTMLElement, string> = new Map();
  const allElements = [contentElement, ...Array.from(contentElement.querySelectorAll("*"))] as HTMLElement[];
  
  // Process all elements including the root
  allElements.forEach((htmlEl) => {
    const computedStyle = window.getComputedStyle(htmlEl);
    const styleProps = [
      "color",
      "backgroundColor", 
      "borderColor",
      "borderTopColor",
      "borderRightColor", 
      "borderBottomColor",
      "borderLeftColor",
      "outlineColor",
      "textDecorationColor",
      "columnRuleColor"
    ];
    
    const replacements: { prop: string; value: string }[] = [];
    let needsReplacement = false;
    
    // Check all color properties
    styleProps.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && /(lab|lch|oklab|oklch)\(/i.test(value)) {
        needsReplacement = true;
        const rgbValue = convertColorToRGB(value, prop);
        replacements.push({ prop, value: rgbValue });
      }
    });
    
    // Also check inline styles
    const inlineStyle = htmlEl.getAttribute("style");
    if (inlineStyle && /(lab|lch|oklab|oklch)\(/i.test(inlineStyle)) {
      needsReplacement = true;
      // Parse and replace inline style colors
      const styleDeclarations = inlineStyle.split(";").filter(s => s.trim());
      const newDeclarations: string[] = [];
      
      styleDeclarations.forEach((decl) => {
        const [prop, value] = decl.split(":").map(s => s.trim());
        if (prop && value && /(lab|lch|oklab|oklch)\(/i.test(value)) {
          const rgbValue = convertColorToRGB(value, prop);
          newDeclarations.push(`${prop}: ${rgbValue}`);
        } else {
          newDeclarations.push(decl);
        }
      });
      
      if (newDeclarations.length > 0) {
        htmlEl.setAttribute("style", newDeclarations.join("; "));
      }
    }
    
    if (needsReplacement) {
      // Store original inline style
      originalStyles.set(htmlEl, htmlEl.getAttribute("style") || "");
      
      // Apply replacements with !important to override computed styles
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
    // Remove the override style
    if (overrideStyle && overrideStyle.parentNode) {
      overrideStyle.parentNode.removeChild(overrideStyle);
    }
    
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
