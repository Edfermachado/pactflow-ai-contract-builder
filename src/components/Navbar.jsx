"use client";

export default function Navbar({ onNewContract }) {
  return (
    <nav className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div 
          onClick={onNewContract} 
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "var(--color-primary)" }}>
            PactFlow AI
          </span>
          <span style={{ 
            fontSize: "10px", 
            fontFamily: "var(--font-mono)", 
            padding: "2px 6px", 
            borderRadius: "4px", 
            backgroundColor: "rgba(192, 193, 255, 0.1)", 
            border: "1px solid var(--color-primary)", 
            color: "var(--color-primary)" 
          }}>
            v2.4
          </span>
        </div>

        <div style={{ display: "flex", gap: "20px", marginLeft: "16px" }}>
          <a href="#dashboard" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            Dashboard
          </a>
          <a href="#templates" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "14px", fontWeight: "700", borderBottom: "2px solid var(--color-primary)", paddingBottom: "4px" }}>
            Templates
          </a>
          <a href="#legal-hub" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            Legal Hub
          </a>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button id="btn-new-contract" onClick={onNewContract} className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
          New Contract
        </button>

        <button style={{ background: "none", border: "none", color: "var(--color-on-surface-variant)", cursor: "pointer" }}>
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <button style={{ background: "none", border: "none", color: "var(--color-on-surface-variant)", cursor: "pointer" }}>
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div style={{ 
          width: "32px", 
          height: "32px", 
          borderRadius: "50%", 
          border: "1px solid var(--color-outline-variant)", 
          backgroundColor: "var(--bg-surface-bright)", 
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "700",
          fontFamily: "var(--font-mono)"
        }}>
          AI
        </div>
      </div>
    </nav>
  );
}
