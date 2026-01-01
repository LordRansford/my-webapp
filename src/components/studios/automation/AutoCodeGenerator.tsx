"use client";

import React, { useState, useCallback } from "react";
import { Code, Download, Copy, CheckCircle2, Loader2, FileCode, Settings } from "lucide-react";

interface CodeTemplate {
  id: string;
  name: string;
  language: string;
  template: (params: Record<string, any>) => string;
  description?: string;
}

interface AutoCodeGeneratorProps {
  templates?: CodeTemplate[];
  defaultTemplate?: CodeTemplate;
  onGenerate?: (code: string, language: string) => void;
  className?: string;
}

const defaultTemplates: CodeTemplate[] = [
  {
    id: "python-function",
    name: "Python Function",
    language: "python",
    description: "Generate a Python function with type hints",
    template: (params) => `def ${params.functionName || "process_data"}(data: ${params.inputType || "dict"}) -> ${params.outputType || "dict"}:
    """
    ${params.description || "Process data"}
    
    Args:
        data: Input data
        
    Returns:
        Processed data
    """
    # TODO: Implement function logic
    return data`
  },
  {
    id: "javascript-function",
    name: "JavaScript Function",
    language: "javascript",
    description: "Generate a JavaScript function with JSDoc",
    template: (params) => `/**
 * ${params.description || "Process data"}
 * @param {${params.inputType || "Object"}} data - Input data
 * @returns {${params.outputType || "Object"}} Processed data
 */
function ${params.functionName || "processData"}(data) {
    // TODO: Implement function logic
    return data;
}`
  },
  {
    id: "typescript-function",
    name: "TypeScript Function",
    language: "typescript",
    description: "Generate a TypeScript function with types",
    template: (params) => `/**
 * ${params.description || "Process data"}
 */
export function ${params.functionName || "processData"}(
    data: ${params.inputType || "Record<string, any>"}
): ${params.outputType || "Record<string, any>"} {
    // TODO: Implement function logic
    return data;
}`
  },
  {
    id: "api-route",
    name: "API Route Handler",
    language: "typescript",
    description: "Generate a Next.js API route handler",
    template: (params) => `import { NextRequest, NextResponse } from "next/server";

export async function ${params.method || "GET"}(
    req: NextRequest
): Promise<NextResponse> {
    try {
        // TODO: Implement route logic
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}`
  },
  {
    id: "react-component",
    name: "React Component",
    language: "typescript",
    description: "Generate a React component with TypeScript",
    template: (params) => `"use client";

import React from "react";

interface ${params.componentName || "Component"}Props {
    // TODO: Add props
}

export function ${params.componentName || "Component"}({
    // TODO: Destructure props
}: ${params.componentName || "Component"}Props) {
    return (
        <div>
            {/* TODO: Implement component */}
        </div>
    );
}`
  }
];

export function AutoCodeGenerator({
  templates = defaultTemplates,
  defaultTemplate,
  onGenerate,
  className = ""
}: AutoCodeGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(
    defaultTemplate || templates[0]
  );
  const [params, setParams] = useState<Record<string, any>>({});
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParamChange = useCallback((key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const generateCode = useCallback(() => {
    setIsGenerating(true);
    try {
      const code = selectedTemplate.template(params);
      setGeneratedCode(code);
      if (onGenerate) {
        onGenerate(code, selectedTemplate.language);
      }
    } catch (error) {
      console.error("Code generation failed:", error);
      setGeneratedCode("// Error generating code");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, params, onGenerate]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [generatedCode]);

  const downloadCode = useCallback(() => {
    const extension = selectedTemplate.language === "typescript" ? "ts" 
      : selectedTemplate.language === "javascript" ? "js"
      : selectedTemplate.language === "python" ? "py"
      : "txt";
    
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate.id}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedCode, selectedTemplate]);

  // Extract parameter names from template (simple approach)
  const getTemplateParams = useCallback(() => {
    const paramNames = new Set<string>();
    const code = selectedTemplate.template({});
    const matches = code.match(/\$\{params\.(\w+)\}/g);
    if (matches) {
      matches.forEach(match => {
        const paramName = match.match(/params\.(\w+)/)?.[1];
        if (paramName) paramNames.add(paramName);
      });
    }
    return Array.from(paramNames);
  }, [selectedTemplate]);

  const templateParams = getTemplateParams();

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Auto Code Generator</h3>
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Code Template
        </label>
        <select
          value={selectedTemplate.id}
          onChange={(e) => {
            const template = templates.find(t => t.id === e.target.value);
            if (template) {
              setSelectedTemplate(template);
              setParams({});
              setGeneratedCode("");
            }
          }}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.language})
            </option>
          ))}
        </select>
        {selectedTemplate.description && (
          <p className="text-xs text-slate-500 mt-1">{selectedTemplate.description}</p>
        )}
      </div>

      {/* Template Parameters */}
      {templateParams.length > 0 && (
        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-slate-700">
            Template Parameters
          </label>
          {templateParams.map(param => (
            <div key={param}>
              <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">
                {param.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type="text"
                value={params[param] || ""}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateCode}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Code className="w-4 h-4" />
            Generate Code
          </>
        )}
      </button>

      {/* Generated Code */}
      {generatedCode && (
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                {selectedTemplate.language}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={downloadCode}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="text-xs text-slate-100 overflow-x-auto max-h-96 overflow-y-auto">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
