/**
 * Help modal for keyboard shortcuts and features
 */

import React, { memo } from "react";
import { X } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = memo(function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="help-title" className="text-2xl font-bold text-slate-900">
            Keyboard Shortcuts & Features
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            aria-label="Close help"
            type="button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Focus search</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">/</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Focus filters</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">f</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Export</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">e</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Show/hide help</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">?</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Next item</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">j</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">Previous item</span>
                <kbd className="px-2 py-1 bg-white rounded border text-xs font-mono">k</kbd>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• <strong>Bookmark items:</strong> Click the star icon to save favorites</li>
              <li>• <strong>Share items:</strong> Use the share button to copy links or use native sharing</li>
              <li>• <strong>Export data:</strong> Export filtered results as JSON or CSV</li>
              <li>• <strong>RSS feed:</strong> Subscribe to updates via RSS</li>
              <li>• <strong>Saved filters:</strong> Save and reuse filter combinations</li>
              <li>• <strong>Print-friendly:</strong> Use browser print for clean output</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Accessibility</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Full keyboard navigation support</li>
              <li>• Screen reader announcements for dynamic content</li>
              <li>• Skip links for quick navigation</li>
              <li>• High contrast focus indicators</li>
              <li>• WCAG 2.2 AA compliant</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
});

export default HelpModal;
