"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function WiresharkIntro() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "wireshark-intro",
    initial_state: {},
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Wireshark is a network protocol analyzer. This tool provides guidance on using Wireshark or CloudShark for packet analysis.
      </p>

      <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <div className="font-semibold text-blue-900 mb-2">Learning Objectives</div>
        <ul className="text-xs text-blue-800 space-y-1 ml-4">
          <li className="list-disc">Identify unencrypted HTTP traffic</li>
          <li className="list-disc">Recognize common protocols (DNS, HTTPS, TCP)</li>
          <li className="list-disc">Spot suspicious network patterns</li>
          <li className="list-disc">Understand packet headers vs payload</li>
        </ul>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold mb-2">Recommended Resources</div>
        <div className="text-xs space-y-2">
          <div>
            <strong>CloudShark:</strong> Web-based packet analysis (cloudshark.org)
          </div>
          <div>
            <strong>Wireshark Download:</strong> wireshark.org
          </div>
          <div>
            <strong>Sample PCAP files:</strong> wireshark.org/download/samples
          </div>
        </div>
      </div>

      <ToolStateActions
        onReset={reset}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}
