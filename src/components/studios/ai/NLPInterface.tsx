"use client";

import React, { useState, useCallback, useMemo } from "react";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";

interface NLPCommand {
  intent: string;
  confidence: number;
  parameters: Record<string, any>;
  action: string;
}

interface NLPInterfaceProps {
  onCommand?: (command: NLPCommand) => Promise<any>;
  placeholder?: string;
  showHistory?: boolean;
  className?: string;
}

const parseIntent = (input: string): NLPCommand | null => {
  const lower = input.toLowerCase().trim();

  // Simple intent parsing (would use NLP/ML in production)
  if (lower.includes("generate") || lower.includes("create")) {
    if (lower.includes("code") || lower.includes("function")) {
      return {
        intent: "generate-code",
        confidence: 0.8,
        parameters: { type: "code" },
        action: "generate"
      };
    }
    if (lower.includes("config") || lower.includes("configuration")) {
      return {
        intent: "generate-config",
        confidence: 0.8,
        parameters: { type: "config" },
        action: "generate"
      };
    }
  }

  if (lower.includes("process") || lower.includes("run") || lower.includes("execute")) {
    return {
      intent: "execute-workflow",
      confidence: 0.7,
      parameters: {},
      action: "execute"
    };
  }

  if (lower.includes("deploy") || lower.includes("publish")) {
    const target = lower.includes("github") ? "github"
      : lower.includes("aws") ? "aws"
      : lower.includes("azure") ? "azure"
      : "default";
    
    return {
      intent: "deploy",
      confidence: 0.9,
      parameters: { target },
      action: "deploy"
    };
  }

  if (lower.includes("validate") || lower.includes("check")) {
    return {
      intent: "validate",
      confidence: 0.8,
      parameters: {},
      action: "validate"
    };
  }

  if (lower.includes("help") || lower.includes("how") || lower.includes("what")) {
    return {
      intent: "help",
      confidence: 0.9,
      parameters: { query: input },
      action: "help"
    };
  }

  return null;
};

export function NLPInterface({
  onCommand,
  placeholder = "Type a command in natural language...",
  showHistory = true,
  className = ""
}: NLPInterfaceProps) {
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<Array<{ input: string; command: NLPCommand; result?: any }>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || processing) return;

    const command = parseIntent(input);
    if (!command) {
      setError("I didn't understand that command. Try: 'generate code', 'process data', 'deploy to github', etc.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      let result;
      if (onCommand) {
        result = await onCommand(command);
      } else {
        // Default action simulation
        result = { success: true, message: `Executed: ${command.intent}` };
      }

      setHistory(prev => [...prev, { input, command, result }]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Command failed");
    } finally {
      setProcessing(false);
    }
  }, [input, processing, onCommand]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-slate-900">Natural Language Interface</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={processing}
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={processing || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-sky-600 hover:text-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800">
            {error}
          </div>
        )}

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Try:</span>
          {["Generate code", "Process data", "Deploy to GitHub", "Validate output"].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => setInput(cmd)}
              className="px-3 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </form>

      {/* Command History */}
      {showHistory && history.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Commands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredHistory.map((entry, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">"{entry.input}"</span>
                  <span className="text-xs text-slate-500">
                    → {entry.command.intent} ({Math.round(entry.command.confidence * 100)}%)
                  </span>
                </div>
                {entry.result && (
                  <div className="text-xs text-slate-600 mt-1">
                    {typeof entry.result === "string" 
                      ? entry.result 
                      : entry.result.message || "Command executed"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
