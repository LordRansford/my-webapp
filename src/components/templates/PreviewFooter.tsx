import React from "react";

type PreviewFooterProps = {
  page?: string;
  confidentiality?: string;
};

export function PreviewFooter({
  page = "Page 1",
  confidentiality = "Confidential - For intended recipients only",
}: PreviewFooterProps) {
  return (
    <footer className="preview-footer" aria-label="Document footer">
      <div className="preview-footer__left">
        <p className="preview-footer__notice">{confidentiality}</p>
        <p className="preview-footer__product">Generated using Ransfords Notes</p>
      </div>
      <div className="preview-footer__page">{page}</div>
    </footer>
  );
}
