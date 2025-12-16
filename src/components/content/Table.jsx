"use client";

export default function Table({ 
  headers = [], 
  rows = [], 
  caption,
  striped = true,
  className = ""
}) {
  return (
    <div
      style={{
        margin: "2rem 0",
        overflowX: "auto",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(102, 126, 234, 0.15)",
      }}
    >
      <table
        className={`premium-table ${className}`}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
        }}
      >
        {caption && (
          <caption
            style={{
              padding: "1rem 1.5rem",
              textAlign: "left",
              fontWeight: 600,
              color: "#667eea",
              fontSize: "0.9rem",
              borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr
            style={{
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            }}
          >
            {headers.map((header, i) => (
              <th
                key={i}
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#1e293b",
                  fontSize: "0.9rem",
                  borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                background: striped && rowIndex % 2 === 0 
                  ? "rgba(102, 126, 234, 0.03)" 
                  : "transparent",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(102, 126, 234, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 
                  striped && rowIndex % 2 === 0 
                    ? "rgba(102, 126, 234, 0.03)" 
                    : "transparent";
              }}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    padding: "0.875rem 1.5rem",
                    borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
                    color: "var(--text)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

