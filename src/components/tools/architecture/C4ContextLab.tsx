"use client";

import React, { useState } from "react";
import { Box } from "lucide-react";

type NodeType = "person" | "system";

type Node = {
  id: number;
  name: string;
  description: string;
  type: NodeType;
};

type Relation = {
  id: number;
  fromId: number;
  toId: number;
  label: string;
};

export function C4ContextLab() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 1,
      name: "User",
      description: "Person who uses the system.",
      type: "person",
    },
    {
      id: 2,
      name: "Ransfords Notes",
      description: "Learning website where notes and tools live.",
      type: "system",
    },
    {
      id: 3,
      name: "Identity provider",
      description: "External system for login and accounts.",
      type: "system",
    },
  ]);

  const [relations, setRelations] = useState<Relation[]>([
    {
      id: 1,
      fromId: 1,
      toId: 2,
      label: "Reads notes and uses tools",
    },
    {
      id: 2,
      fromId: 2,
      toId: 3,
      label: "Delegates login to",
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(1);

  const addNode = (type: NodeType) => {
    const nextId = nodes.length ? Math.max(...nodes.map((n) => n.id)) + 1 : 1;
    setNodes((prev) => [
      ...prev,
      {
        id: nextId,
        name: type === "person" ? "New person" : "New system",
        description: "",
        type,
      },
    ]);
    setSelectedNodeId(nextId);
  };

  const addRelation = () => {
    if (nodes.length < 2) return;
    const fromId = nodes[0]?.id;
    const toId = nodes[1]?.id;
    const nextId = relations.length
      ? Math.max(...relations.map((r) => r.id)) + 1
      : 1;
    setRelations((prev) => [
      ...prev,
      { id: nextId, fromId, toId, label: "Interacts with" },
    ]);
  };

  const updateNode = (id: number, patch: Partial<Node>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const removeNode = (id: number) => {
    const remaining = nodes.filter((n) => n.id !== id);
    if (!remaining.length) return;
    setNodes(remaining);
    setRelations((prev) => prev.filter((r) => r.fromId !== id && r.toId !== id));
    setSelectedNodeId(remaining[0].id);
  };

  const updateRelation = (id: number, patch: Partial<Relation>) => {
    setRelations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const removeRelation = (id: number) => {
    setRelations((prev) => prev.filter((r) => r.id !== id));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <section
      aria-labelledby="c4-context-lab-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Box className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="c4-context-lab-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              C4 context sketch
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Capture the people and systems around your product and the
              relationships between them. This is a text based helper for a C4
              context view that keeps everything in one place.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Nodes</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addNode("person")}
                className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                aria-label="Add person"
              >
                Add person
              </button>
              <button
                type="button"
                onClick={() => addNode("system")}
                className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                aria-label="Add system"
              >
                Add system
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`flex items-center justify-between w-full rounded-2xl px-3 py-2 text-xs ${
                  selectedNodeId === node.id
                    ? "bg-sky-50 border border-sky-200 text-sky-900"
                    : "bg-white border border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                      node.type === "person"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {node.type === "person" ? "P" : "S"}
                  </span>
                  <span className="truncate">{node.name}</span>
                </div>
                <span className="text-[11px] text-slate-500" aria-hidden="true">
                  ✎
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>Click a node to edit details.</span>
            <span>{nodes.length} nodes</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Node details
            </h3>
            {selectedNode ? (
              <div className="space-y-2 text-xs text-slate-700">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) =>
                      updateNode(selectedNode.id, { name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={selectedNode.description}
                    onChange={(e) =>
                      updateNode(selectedNode.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full h-20 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 resize-none focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    Type:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedNode.type === "person" ? "Person" : "System"}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => removeNode(selectedNode.id)}
                    className="text-xs rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-medium text-rose-700 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    aria-label="Remove node"
                  >
                    Remove node
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Add a node on the left and then select it to edit details.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Relationships
              </h3>
              <button
                type="button"
                onClick={addRelation}
                className="text-xs rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                aria-label="Add relation"
              >
                Add relation
              </button>
            </div>

            {relations.length ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {relations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <select
                      value={r.fromId}
                      onChange={(e) =>
                        updateRelation(r.id, { fromId: Number(e.target.value) })
                      }
                      className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={r.label}
                      onChange={(e) =>
                        updateRelation(r.id, { label: e.target.value })
                      }
                      className="flex-1 text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                    <select
                      value={r.toId}
                      onChange={(e) =>
                        updateRelation(r.id, { toId: Number(e.target.value) })
                      }
                      className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeRelation(r.id)}
                      className="text-[11px] px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      aria-label="Remove relation"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Add relationships between people and systems to describe how
                they interact.
              </p>
            )}

            <p className="text-xs text-slate-600">
              This text view can sit beside a visual diagram. It keeps the
              important names and relationships editable without needing
              drawing tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
