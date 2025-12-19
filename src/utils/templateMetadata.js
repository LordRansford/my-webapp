const BASE_METADATA = {
  author: "Ransford",
  organization: "Ransfords Notes",
  version: "1.0.0",
};

const forbiddenTokens = ["ai", "openai", "chatgpt", "automation", "auto-generated"];

export const sanitizeField = (value) => {
  if (!value) return "";
  const cleaned = forbiddenTokens.reduce((result, token) => {
    const pattern = new RegExp(`\\b${token}\\b`, "ig");
    return result.replace(pattern, "").trim();
  }, value);
  return cleaned || "Untitled";
};

export function buildTemplateMetadata({
  title,
  category,
  exportedAt = new Date().toISOString(),
  version = BASE_METADATA.version,
  author = BASE_METADATA.author,
  organization = BASE_METADATA.organization,
} = {}) {
  return {
    title: sanitizeField(title),
    author: sanitizeField(author),
    organization: sanitizeField(organization),
    category: sanitizeField(category),
    version: sanitizeField(version),
    exportedAt,
  };
}

export function applyPdfMetadata(pdfDoc, metadata) {
  const compiled = buildTemplateMetadata(metadata);
  pdfDoc.setTitle(compiled.title);
  pdfDoc.setAuthor(compiled.author);
  pdfDoc.setSubject(compiled.category);
  pdfDoc.setCreator(compiled.organization);
  pdfDoc.setProducer(compiled.organization);
  pdfDoc.setKeywords([compiled.organization, compiled.category, "template"]);
  pdfDoc.setCreationDate(new Date(compiled.exportedAt));
  return compiled;
}

export function applyDocxMetadata(doc, metadata) {
  const compiled = buildTemplateMetadata(metadata);
  // docx exposes Properties on the document instance; create if missing for safety.
  doc.Properties = doc.Properties || {};
  doc.Properties.Title = compiled.title;
  doc.Properties.Subject = compiled.category;
  doc.Properties.Creator = compiled.author;
  doc.Properties.Company = compiled.organization;
  doc.Properties.LastModifiedBy = compiled.organization;
  doc.Properties.Revision = compiled.version;
  doc.Properties.Created = new Date(compiled.exportedAt);
  doc.Properties.Modified = new Date(compiled.exportedAt);
  return compiled;
}

export function applyXlsxMetadata(workbook, metadata) {
  const compiled = buildTemplateMetadata(metadata);
  workbook.Props = {
    Title: compiled.title,
    Author: compiled.author,
    Company: compiled.organization,
    CreatedDate: new Date(compiled.exportedAt),
    Subject: compiled.category,
    Keywords: `${compiled.organization}; ${compiled.category}; template`,
    Comments: `Version ${compiled.version}`,
  };
  return compiled;
}
