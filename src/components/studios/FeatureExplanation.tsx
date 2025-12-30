"use client";

import React, { memo, useMemo } from "react";
import { Info } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface FeatureExplanationProps {
  feature: string;
  description: string;
  whatItDoes: string;
  whyItMatters: string;
  howToUse: string[];
  examples: string[];
  technicalTerms?: { term: string; definition: string }[];
  fileFormats?: { format: string; description: string; example: string }[];
}

const FeatureExplanation = memo(function FeatureExplanation({
  feature,
  description,
  whatItDoes,
  whyItMatters,
  howToUse,
  examples,
  technicalTerms = [],
  fileFormats = []
}: FeatureExplanationProps) {
  const helpContent = useMemo(() => (
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
    </div>
  ), [description, whatItDoes, whyItMatters, howToUse, fileFormats, technicalTerms]);

  return (
    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{feature}</h3>
            <HelpTooltip
              title={feature}
              content={helpContent}
              examples={examples}
              technicalTerms={technicalTerms}
            />
          </div>
          <p className="text-sm text-slate-700 mb-2">{description}</p>
          <p className="text-xs text-slate-600">
            <strong>What it does:</strong> {whatItDoes}
          </p>
        </div>
      </div>
    </div>
  );
});

export default FeatureExplanation;

