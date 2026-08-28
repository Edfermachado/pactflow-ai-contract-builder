"use client";

export default function Navbar({ onNewContract, mobileView, setMobileView }) {
  return (
    <nav className="top-navbar">
      {/* Brand Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "var(--color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>gavel</span>
        </div>
        <div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.02em", color: "var(--color-on-surface)" }}>
            PactFlow <span style={{ color: "var(--color-primary)" }}>AI</span>
          </span>
          <span style={{ fontSize: "10px", color: "var(--color-on-surface-variant)", marginLeft: "6px", fontFamily: "var(--font-mono)" }}>
            v1.0
          </span>
        </div>
      </div>

      {/* Mobile Toggle Bar (Visible on mobile screens < 1024px) */}
      <div className="mobile-view-toggle" style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-surface-container-highest)", padding: "3px", borderRadius: "6px" }}>
        <button
          type="button"
          onClick={() => setMobileView("wizard")}
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            backgroundColor: mobileView === "wizard" ? "var(--color-primary-container)" : "transparent",
            color: mobileView === "wizard" ? "#ffffff" : "var(--color-on-surface-variant)"
          }}
        >
          Formulario
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            backgroundColor: mobileView === "preview" ? "var(--color-primary-container)" : "transparent",
            color: mobileView === "preview" ? "#ffffff" : "var(--color-on-surface-variant)"
          }}
        >
          Contrato
        </button>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button 
          id="btn-new-contract"
          type="button" 
          onClick={onNewContract} 
          className="btn-secondary"
          style={{ fontSize: "11px", padding: "6px 10px" }}
          title="Reiniciar formulario y borrador"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>add</span>
          <span className="hide-mobile">Nuevo Contrato</span>
        </button>
      </div>

      {/* Responsive Inline CSS for Mobile Toggle visibility */}
      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-view-toggle {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
