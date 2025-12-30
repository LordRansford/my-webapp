"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface UniversalHelpButtonProps {
  feature: string;
  description: string;
  whatItDoes: string;
  whyItMatters: string;
  howToUse: string[];
  examples: string[];
  technicalTerms?: { term: string; definition: string }[];
  fileFormats?: { format: string; description: string; example: string }[];
  className?: string;
}

/**
 * A universal help button that can be placed next to any feature or tool
 * to provide comprehensive explanations suitable for all audiences.
 */
export default function UniversalHelpButton({
  feature,
  description,
  whatItDoes,
  whyItMatters,
  howToUse,
  examples,
  technicalTerms = [],
  fileFormats = [],
  className = ""
}: UniversalHelpButtonProps) {
  const helpContent = (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">What is this?</h3>
        <p className="text-sm text-slate-700">{description}</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">What does it do?</h3>
        <p className="text-sm text-slate-700">{whatItDoes}</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">Why does this matter?</h3>
        <p className="text-sm text-slate-700">{whyItMatters}</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">How do I use it?</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
          {howToUse.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      {fileFormats.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Supported File Formats</h3>
          <div className="space-y-2">
            {fileFormats.map(({ format, description, example }, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                <div className="font-semibold text-slate-900 text-sm">{format}</div>
                <div className="text-xs text-slate-600 mt-1">{description}</div>
                <div className="text-xs text-slate-500 mt-1 italic">Example: {example}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {technicalTerms.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Technical Terms Explained</h3>
          <dl className="space-y-2">
            {technicalTerms.map(({ term, definition }, idx) => (
              <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                <dt className="font-semibold text-slate-900 mb-1 text-sm">{term}</dt>
                <dd className="text-xs text-slate-700">{definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );

  return (
    <HelpTooltip
      title={feature}
      content={helpContent}
      examples={examples}
      technicalTerms={technicalTerms}
      className={className}
    />
  );
}



