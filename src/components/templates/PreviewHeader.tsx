import React from "react";

type PreviewHeaderProps = {
  title: string;
  organisation?: string;
  department?: string;
  classification?: string;
  author?: string;
  date?: string;
  logoPlaceholder?: string;
};

export function PreviewHeader({
  title,
  organisation = "Organisation name",
  department = "Department",
  classification = "Classification",
  author = "Author",
  date = new Date().toLocaleDateString(),
  logoPlaceholder = "Logo placeholder",
}: PreviewHeaderProps) {
  return (
    <header className="preview-header" aria-label="Document header">
      <div className="preview-header__branding">
        <div className="preview-header__logo">{logoPlaceholder}</div>
        <div>
          <p className="preview-header__org">{organisation}</p>
          <p className="preview-header__dept">
            {department} · {classification}
          </p>
        </div>
      </div>
      <div className="preview-header__meta">
        <p className="preview-header__date">Generated: {date}</p>
        <p className="preview-header__author">Author: {author}</p>
        <p className="preview-header__product">Generated using Ransfords Notes</p>
      </div>
      <h1 className="preview-header__title">{title}</h1>
    </header>
  );
}
