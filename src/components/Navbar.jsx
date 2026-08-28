"use client";

export default function Navbar({ onNewContract }) {
  return (
    <nav className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div 
          onClick={onNewContract} 
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "var(--color-primary)", tracking: "-0.02em" }}>
            PactFlow AI
          </span>
          <span style={{ 
            fontSize: "10px", 
            fontFamily: "var(--font-mono)", 
            padding: "2px 8px", 
            borderRadius: "4px", 
            backgroundColor: "rgba(192, 193, 255, 0.12)", 
            border: "1px solid var(--color-primary)", 
            color: "var(--color-primary)",
            fontWeight: "600"
          }}>
            MVP v1.0
          </span>
        </div>

        <span style={{ color: "var(--color-outline)", fontSize: "14px" }}>|</span>

        <span style={{ fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
          Generador de Contratos & Auditoría Legal con IA
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button id="btn-new-contract" onClick={onNewContract} className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>refresh</span>
          Nuevo Contrato
        </button>
      </div>
    </nav>
  );
}
