"use client";

import React, { useState, memo, useMemo } from "react";
import { Info, FileCode, Database, Layers, CheckCircle2 } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface TemplateStructureGuideProps {
  templateType: "data" | "api" | "schema" | "pipeline" | "workflow";
  structure: {
    required: string[];
    optional?: string[];
    format?: string;
    example?: Record<string, unknown> | unknown[];
  };
  className?: string;
}

const TemplateStructureGuide = memo(function TemplateStructureGuide({
  templateType,
  structure,
  className = ""
}: TemplateStructureGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeExplanations = {
    data: {
      title: "Data Template Structure",
      why: "Data templates must follow a specific structure so that computers can read and process the information correctly. Think of it like filling out a form: each field has a specific place and format.",
      analogy: "Like a form at the doctor's office. You must write your name in the 'Name' field, your date of birth in the 'Date of Birth' field, and so on. If you write your name in the wrong field, the computer cannot understand it."
    },
    api: {
      title: "API Template Structure",
      why: "API templates define how programs communicate with each other. The structure must be consistent so that both programs understand the same format.",
      analogy: "Like speaking a common language. If you say 'Hello' in English, the other person must understand English to respond. Similarly, APIs must use the same structure so programs can understand each other."
    },
    schema: {
      title: "Database Schema Structure",
      why: "Database schemas define how information is organised. The structure ensures data is stored consistently and can be found easily.",
      analogy: "Like organising a library. Books are organised by sections (Fiction, Non-fiction), then by author, then by title. This structure makes it easy to find any book. Without this structure, books would be scattered randomly and impossible to find."
    },
    pipeline: {
      title: "Pipeline Structure",
      why: "Data pipelines process information step by step. The structure defines the order of operations so data flows correctly from one step to the next.",
      analogy: "Like a factory assembly line. Each station does a specific job in order: first, parts are assembled; then, they are painted; finally, they are packaged. If the order is wrong, the product cannot be made correctly."
    },
    workflow: {
      title: "Workflow Structure",
      why: "Workflows define a series of steps that must be completed in order. The structure ensures each step happens at the right time.",
      analogy: "Like following a recipe. You must add ingredients in a specific order: first, mix dry ingredients; then, add wet ingredients; finally, bake. If you do it in the wrong order, the cake will not turn out correctly."
    }
  };

  const explanation = typeExplanations[templateType];

  return (
    <div className={`rounded-2xl bg-blue-50 border border-blue-200 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{explanation.title}</h3>
            <HelpTooltip
              title="Why Structure Matters"
              content={
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Why must templates be structured in a certain way?</h3>
                    <p className="text-sm text-slate-700 mb-3">{explanation.why}</p>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Simple Analogy:</p>
                      <p className="text-xs text-blue-800">{explanation.analogy}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">What happens if the structure is wrong?</h3>
                    <p className="text-sm text-slate-700">
                      If the structure is incorrect, the computer cannot read or process the information. It is like trying 
                      to read a book where all the words are scrambled: you can see the letters, but they do not make sense.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Required Fields</h3>
                    <p className="text-sm text-slate-700 mb-2">
                      These fields must be included for the template to work:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                      {structure.required.map((field, idx) => (
                        <li key={idx}>{field}</li>
                      ))}
                    </ul>
                  </div>
                  {structure.optional && structure.optional.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Optional Fields</h3>
                      <p className="text-sm text-slate-700 mb-2">
                        These fields can be included but are not required:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                        {structure.optional.map((field, idx) => (
                          <li key={idx}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              }
              examples={[
                `A ${templateType} template must include: ${structure.required.join(", ")}`,
                "Follow the structure exactly as shown in the example",
                "If a required field is missing, the template will not work"
              ]}
            />
          </div>
          
          <p className="text-sm text-slate-700 mb-3">{explanation.why}</p>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? "Hide" : "Show"} structure details
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-2">Required Fields</h4>
                <div className="space-y-1">
                  {structure.required.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>

              {structure.optional && structure.optional.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">Optional Fields</h4>
                  <div className="space-y-1">
                    {structure.optional.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-3 h-3 rounded-full border border-slate-300" />
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {structure.format && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">Format</h4>
                  <p className="text-xs text-slate-700">{structure.format}</p>
                </div>
              )}

              {structure.example && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">Example</h4>
                  <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(structure.example, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TemplateStructureGuide;