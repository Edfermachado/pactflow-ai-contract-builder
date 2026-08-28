"use client";

export default function Navbar({ onNewContract }) {
  return (
    <nav className="top-navbar">
      {/* Brand Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "var(--color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>gavel</span>
        </div>
        <div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "16px", letterSpacing: "-0.02em", color: "var(--color-on-surface)" }}>
            PactFlow <span style={{ color: "var(--color-primary)" }}>AI</span>
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-on-surface-variant)", marginLeft: "8px", fontFamily: "var(--font-mono)" }}>
            MVP v1.0
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button 
          id="btn-new-contract"
          type="button" 
          onClick={onNewContract} 
          className="btn-secondary"
          title="Reiniciar formulario y borrador"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
          Nuevo Contrato
        </button>
      </div>
    </nav>
  );
}
