"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Download, 
  Edit3, 
  Check, 
  ArrowLeft,
  Sparkles,
  Award,
  FileCheck
} from "lucide-react";
import { generateContractPDF } from "@/utils/pdfGenerator";
import confetti from "canvas-confetti";

export default function ContractPreview({ 
  contractText, 
  setContractText, 
  auditResult, 
  formData, 
  onBackToWizard 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [watermark, setWatermark] = useState("OFICIAL");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await generateContractPDF({
        projectTitle: formData.projectTitle || "Contrato de Servicios",
        providerName: formData.providerName || "Prestador",
        clientName: formData.clientName || "Cliente",
        contractText: contractText,
        watermark: watermark
      });

      // Efecto de celebración con confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Error al exportar PDF:", err);
      alert("Ocurrió un error al generar el PDF. Por favor inténtelo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 85) return "badge-emerald";
    if (score >= 60) return "badge-amber";
    return "badge-rose";
  };

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px" }}>
      
      {/* Panel Izquierdo: Resultados de Auditoría de legal-clause-agent */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Card de Score */}
        <div className="glass-card" style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.15)", marginBottom: "12px" }}>
            <Award size={32} color="var(--accent-indigo)" />
          </div>
          <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Auditoría de legal-clause-agent
          </h4>
          <div style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-heading)" }} className="gradient-text">
            {auditResult?.score || 100} / 100
          </div>
          <span className={`badge ${getScoreBadgeClass(auditResult?.score || 100)}`} style={{ marginTop: "6px" }}>
            {auditResult?.status || "Coherencia Legal Verificada"}
          </span>
        </div>

        {/* Alertas y Recomendaciones */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={18} color="var(--accent-emerald)" />
            Observaciones del Agente
          </h4>

          {auditResult?.alerts && auditResult.alerts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              {auditResult.alerts.map((alt, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: "10px 12px", 
                    borderRadius: "8px", 
                    background: alt.type === 'danger' ? "rgba(244, 63, 94, 0.1)" : "rgba(245, 158, 11, 0.1)",
                    borderLeft: `3px solid ${alt.type === 'danger' ? "var(--accent-rose)" : "var(--accent-amber)"}`,
                    fontSize: "0.8rem"
                  }}
                >
                  <div style={{ fontWeight: "700", color: alt.type === 'danger' ? "var(--accent-rose)" : "var(--accent-amber)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={14} /> {alt.title}
                  </div>
                  <p style={{ marginTop: "4px", color: "var(--text-secondary)" }}>{alt.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "0.82rem", color: "var(--accent-emerald)", padding: "8px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.1)", marginBottom: "14px" }}>
              <Check size={14} style={{ display: "inline", marginRight: "4px" }} />
              No se detectaron incoherencias críticas en la estructura del contrato.
            </div>
          )}

          {auditResult?.recommendations && auditResult.recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: "10px 12px", 
                borderRadius: "8px", 
                background: "rgba(99, 102, 241, 0.1)", 
                borderLeft: "3px solid var(--accent-indigo)",
                fontSize: "0.8rem",
                marginTop: "8px"
              }}
            >
              <div style={{ fontWeight: "700", color: "#818cf8", display: "flex", alignItems: "center", gap: "6px" }}>
                <Info size={14} /> {rec.title}
              </div>
              <p style={{ marginTop: "4px", color: "var(--text-secondary)" }}>{rec.message}</p>
            </div>
          ))}
        </div>

        {/* Opciones de Exportación */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
            Configuración de PDF
          </h4>

          <div className="form-group">
            <label className="form-label" htmlFor="watermark-select">Marca de Agua</label>
            <select
              id="watermark-select"
              className="form-select"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
            >
              <option value="OFICIAL">OFICIAL (Documento Final)</option>
              <option value="BORRADOR">BORRADOR (En Revisión)</option>
              <option value="">Sin Marca de Agua</option>
            </select>
          </div>

          <button
            id="export-pdf-btn"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-emerald"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            <Download size={18} />
            {isExporting ? "Compilando PDF..." : "Ejecutar /gen-contract-pdf"}
          </button>
        </div>

        <button 
          id="btn-back-wizard"
          onClick={onBackToWizard} 
          className="btn-secondary" 
          style={{ justifyContent: "center" }}
        >
          <ArrowLeft size={16} /> Modificar Formulario
        </button>

      </div>

      {/* Panel Derecho: Visualizador / Editor de Contrato */}
      <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", minHeight: "650px" }}>
        
        {/* Bar de Acciones del Documento */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileCheck size={22} color="var(--accent-indigo)" />
            <h3 style={{ fontSize: "1.1rem" }}>Vista Previa del Contrato Legal</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              id="toggle-edit-mode-btn"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "btn-emerald" : "btn-secondary"}
              style={{ padding: "6px 14px", fontSize: "0.85rem" }}
            >
              {isEditing ? (
                <>
                  <Check size={16} /> Guardar Cambios
                </>
              ) : (
                <>
                  <Edit3 size={16} /> Editar Documento
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cuerpo del Contrato (Vista de Lectura vs Modo Edición) */}
        {isEditing ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--accent-amber)", marginBottom: "8px" }}>
              Modo Edición Directa Activado: Puedes personalizar o agregar cualquier cláusula específica.
            </p>
            <textarea
              id="contract-editor-textarea"
              className="form-textarea"
              style={{ flex: 1, minHeight: "500px", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.6" }}
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
            />
          </div>
        ) : (
          <div 
            id="contract-preview-content"
            style={{ 
              flex: 1, 
              padding: "24px", 
              borderRadius: "12px", 
              background: "rgba(0, 0, 0, 0.25)", 
              border: "1px solid rgba(255, 255, 255, 0.05)",
              whiteSpace: "pre-wrap",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              lineHeight: "1.7",
              color: "var(--text-primary)",
              overflowY: "auto",
              maxHeight: "650px"
            }}
          >
            {contractText}
          </div>
        )}

      </div>

    </div>
  );
}
