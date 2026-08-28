"use client";

import { Sparkles, Code, Palette, TrendingUp, CheckCircle2 } from "lucide-react";
import templatesData from "@/data/contract_templates.json";

export default function TemplateSelector({ onSelectTemplate, activeTemplateId }) {
  const getIcon = (serviceType) => {
    switch (serviceType) {
      case "web_dev": return <Code size={18} className="text-indigo-400" />;
      case "ui_ux": return <Palette size={18} className="text-purple-400" />;
      case "marketing": return <TrendingUp size={18} className="text-cyan-400" />;
      default: return <Sparkles size={18} className="text-amber-400" />;
    }
  };

  return (
    <div style={{ marginBottom: "28px" }} className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h3 style={{ fontSize: "1.05rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} color="var(--accent-amber)" />
          Cargar Plantilla Base (MCP Context)
        </h3>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Datos pre-configurados desde JSON
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
        {templatesData.templates.map((tpl) => {
          const isSelected = activeTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              id={`template-card-${tpl.id}`}
              onClick={() => onSelectTemplate(tpl)}
              className="glass-card"
              style={{
                padding: "16px",
                cursor: "pointer",
                border: isSelected ? "2px solid var(--accent-indigo)" : "1px solid var(--border-color)",
                background: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--bg-card)",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                position: "relative"
              }}
            >
              {isSelected && (
                <CheckCircle2 
                  size={20} 
                  color="var(--accent-indigo)" 
                  style={{ position: "absolute", top: "12px", right: "12px" }} 
                />
              )}
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ 
                  padding: "8px", 
                  borderRadius: "8px", 
                  background: "rgba(255, 255, 255, 0.05)" 
                }}>
                  {getIcon(tpl.serviceType)}
                </div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{tpl.title}</h4>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {tpl.scope}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span className="badge badge-indigo">
                  ${tpl.totalAmount} {tpl.currency}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {tpl.timelineDays} Días • {tpl.revisionRounds} Revisiones
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
