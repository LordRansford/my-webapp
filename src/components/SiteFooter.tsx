"use client";

import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-sm text-slate-600">
              © {currentYear} RansfordsNotes. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link 
              href="/privacy" 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
