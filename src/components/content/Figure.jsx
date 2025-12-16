"use client";

export default function Figure({ 
  children, 
  caption, 
  number, 
  className = "",
  style = {}
}) {
  return (
    <figure
      className={`premium-figure ${className}`}
      style={{
        margin: "2.5rem 0",
        padding: "1.5rem",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
        border: "1px solid rgba(102, 126, 234, 0.15)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
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
      <div style={{ marginTop: "0.5rem" }}>{children}</div>
      {caption && (
        <figcaption
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(102, 126, 234, 0.1)",
            fontSize: "0.9rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            fontStyle: "italic",
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
              Figure {number}:
            </span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

