"use client";

import { FileText, ShieldCheck, Sparkles, Sun, Moon, Cpu } from "lucide-react";

export default function Navbar({ activeStep, theme, onToggleTheme }) {
  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: "16px 24px", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "42px", 
            height: "42px", 
            borderRadius: "12px", 
            background: "var(--gradient-primary)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)"
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
                Auto<span className="gradient-text">Contract</span> AI
              </span>
              <span className="badge badge-indigo" id="badge-agent-status">
                <Cpu size={12} /> legal-clause-agent
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Generación de Contratos Freelance & Audición Legal
            </p>
          </div>
        </div>

        {/* Pasos */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="nav-steps">
          <div style={{ 
            padding: "6px 14px", 
            borderRadius: "20px", 
            fontSize: "0.85rem", 
            fontWeight: "600",
            background: activeStep === 1 ? "rgba(99, 102, 241, 0.2)" : "transparent",
            color: activeStep === 1 ? "var(--accent-indigo)" : "var(--text-muted)",
            border: activeStep === 1 ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent"
          }}>
            1. Formulario Guiado
          </div>
          <span style={{ color: "var(--text-muted)" }}>→</span>
          <div style={{ 
            padding: "6px 14px", 
            borderRadius: "20px", 
            fontSize: "0.85rem", 
            fontWeight: "600",
            background: activeStep === 2 ? "rgba(16, 185, 129, 0.2)" : "transparent",
            color: activeStep === 2 ? "var(--accent-emerald)" : "var(--text-muted)",
            border: activeStep === 2 ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent"
          }}>
            2. Auditoría & Edición
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            id="theme-toggle-btn"
            onClick={onToggleTheme} 
            className="btn-secondary" 
            style={{ padding: "8px 12px" }}
            title="Cambiar Tema Oscuro/Claro"
          >
            {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <span className="badge badge-emerald" id="skill-badge">
            <Sparkles size={12} /> /gen-contract-pdf
          </span>
        </div>

      </div>
    </header>
  );
}
