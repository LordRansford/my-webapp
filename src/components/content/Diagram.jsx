"use client";

import { useMemo } from "react";

export default function Diagram({ 
  type = "flowchart",
  nodes = [],
  edges = [],
  caption,
  number,
  style = {}
}) {
  const svgContent = useMemo(() => {
    if (!nodes || nodes.length === 0) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
          No diagram data provided. Please provide nodes and edges.
        </div>
      );
    }
    if (type === "flowchart") {
      return renderFlowchart(nodes, edges || []);
    } else if (type === "network") {
      return renderNetwork(nodes, edges || []);
    } else if (type === "hierarchy") {
      return renderHierarchy(nodes);
    }
    return null;
  }, [type, nodes, edges]);

  return (
    <figure
      className="premium-diagram"
      style={{
        margin: "2.5rem 0",
        padding: "2rem",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
        border: "1px solid rgba(102, 126, 234, 0.2)",
        borderRadius: "20px",
        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        {svgContent}
      </div>
      {caption && (
        <figcaption
          style={{
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(102, 126, 234, 0.1)",
            fontSize: "0.9rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {number && (
            <span
              style={{
                fontWeight: 600,
                color: "#667eea",
                marginRight: "0.5rem",
              }}
            >
              Diagram {number}:
            </span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderFlowchart(nodes = [], edges = []) {
  if (!nodes || nodes.length === 0) {
    return null;
  }
  
  const width = 600;
  const height = 400;
  const nodeWidth = 120;
  const nodeHeight = 60;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
        </linearGradient>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
        </marker>
      </defs>
      {edges && edges.length > 0 && edges.map((edge, i) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={from.x + nodeWidth / 2}
            y1={from.y + nodeHeight / 2}
            x2={to.x + nodeWidth / 2}
            y2={to.y + nodeHeight / 2}
            stroke="#667eea"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            opacity="0.6"
          />
        );
      })}
      {nodes.map((node, i) => (
        <g key={i}>
          <rect
            x={node.x || 0}
            y={node.y || 0}
            width={nodeWidth}
            height={nodeHeight}
            rx="12"
            fill="url(#nodeGradient)"
            stroke="#667eea"
            strokeWidth="2"
            opacity="0.9"
          />
          <text
            x={(node.x || 0) + nodeWidth / 2}
            y={(node.y || 0) + nodeHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1e293b"
            fontSize="14"
            fontWeight="600"
          >
            {node.label || `Node ${i + 1}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

function renderNetwork(nodes, edges) {
  // Similar to flowchart but with different layout
  return renderFlowchart(nodes, edges);
}

function renderHierarchy(nodes) {
  // Tree/hierarchy layout
  return renderFlowchart(nodes, []);
}

