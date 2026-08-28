"use client";

import { useState } from "react";
import { generateContractPDF } from "@/utils/pdfGenerator";
import confetti from "canvas-confetti";

export default function ContractPreview({ 
  contractText, 
  setContractText, 
  auditResult, 
  formData,
  isMobileHidden
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Acción principal: Descargar PDF listo
  const handleExportPDF = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isExporting) return;

    try {
      setIsExporting(true);
      await generateContractPDF({
        projectTitle: formData.projectTitle || "Acuerdo Marco de Servicios Legales",
        providerName: formData.providerName || "Prestador de Servicios",
        clientName: formData.clientName || "Cliente",
        contractText: contractText,
        watermark: null
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Ocurrió un error al generar el PDF. Por favor reintente.");
    } finally {
      setIsExporting(false);
    }
  };

  // Impresión nativa del navegador para Guardar como PDF
  const handlePrintPDF = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    window.print();
  };

  const handleCopyMarkdown = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    navigator.clipboard.writeText(contractText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formateador elegante de Markdown para el borrador en la hoja de papel
  const renderFormattedContract = (text) => {
    if (!text) return <p style={{ color: "#64748b" }}>Complete los campos y haga clic en 'Auditar y Generar Contrato con IA'.</p>;

    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} style={{ height: "10px" }} />;
      }

      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} style={{ fontFamily: "var(--font-doc)", fontSize: "18px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", marginBottom: "12px", marginTop: "16px", borderBottom: "2px solid #6366f1", paddingBottom: "4px" }}>
            {trimmed.replace(/^#\s*/, "")}
          </h1>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} style={{ fontFamily: "var(--font-doc)", fontSize: "15px", fontWeight: "700", color: "#1e293b", textTransform: "uppercase", marginBottom: "8px", marginTop: "14px" }}>
            {trimmed.replace(/^##\s*/, "")}
          </h2>
        );
      }

      if (trimmed.startsWith("---")) {
        return <hr key={idx} style={{ border: "none", borderTop: "1px solid #cbd5e1", margin: "16px 0" }} />;
      }

      if (trimmed.startsWith("- ")) {
        return (
          <div key={idx} style={{ display: "flex", gap: "8px", marginLeft: "12px", marginBottom: "4px", fontSize: "13.5px", color: "#334155" }}>
            <span style={{ color: "#6366f1", fontWeight: "bold" }}>•</span>
            <span>{trimmed.replace(/^-\s*/, "")}</span>
          </div>
        );
      }

      // Parrafo normal con soporte negrita **bold**
      const formattedParts = trimmed.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx} style={{ color: "#0f172a", fontWeight: "700" }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <p key={idx} style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#334155", marginBottom: "6px" }}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className={`preview-right-panel ${isMobileHidden ? "mobile-hidden" : ""}`}>
      
      {/* Barra Superior de Auditoría Legal */}
      {auditResult && (
        <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container-high)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: auditResult.score >= 85 ? "var(--color-secondary)" : "var(--color-tertiary)" }}>
              {auditResult.score >= 85 ? "verified_user" : "gavel"}
            </span>
            <span style={{ color: "var(--color-on-surface)" }}>
              Puntuación legal-clause-agent: <strong style={{ color: "var(--color-primary)" }}>{auditResult.score}/100</strong>
            </span>
          </div>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: "11px", padding: "4px 10px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
            {isEditing ? "Finalizar Edición" : "Editar Texto"}
          </button>
        </div>
      )}

      {/* Contenedor de Hoja de Papel */}
      <div className="paper-sheet-container">
        
        <div className="paper-sheet">
          
          {/* Marca de Agua BORRADOR */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", opacity: 0.02 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "100px", fontWeight: "800", color: "#0f172a", transform: "rotate(-45deg)", letterSpacing: "0.1em" }}>
              BORRADOR
            </span>
          </div>

          {/* Encabezado del Documento */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "2px solid #cbd5e1" }}>
            <h2 style={{ fontFamily: "var(--font-doc)", fontSize: "18px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a" }}>
              {formData.projectTitle ? formData.projectTitle.toUpperCase() : "ACUERDO MARCO DE SERVICIOS LEGALES"}
            </h2>
            <p style={{ fontSize: "11px", color: "#64748b", fontFamily: "var(--font-body)", marginTop: "4px" }}>
              Fecha de Emisión: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Cuerpo del Contrato / Editor */}
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#4f46e5", fontWeight: "700" }}>
                Editor Markdown en Vivo Activo:
              </span>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                style={{ width: "100%", minHeight: "600px", padding: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", backgroundColor: "#f8fafc", border: "1px solid #c7d2fe", borderRadius: "4px", color: "#0f172a", outline: "none" }}
              />
            </div>
          ) : (
            <div style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid #4f46e5", padding: "24px", borderRadius: "0 4px 4px 0", position: "relative" }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", color: "#4f46e5", fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span>
                CLÁUSULAS VALIDADAS
              </div>
              <div style={{ fontFamily: "var(--font-doc)", color: "#1e293b" }}>
                {renderFormattedContract(contractText)}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Dock Flotante Inferior — Sin Ambigüedad */}
      <div className="floating-dock">
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingRight: "10px", borderRight: "1px solid var(--color-outline-variant)" }}>
          <span className="pulse-badge" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-secondary)", display: "inline-block" }}></span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "600", color: "var(--color-secondary)" }}>
            Gemini OK
          </span>
        </div>

        {/* ÚNICO BOTÓN PRINCIPAL DE EXPEDICIÓN DE PDF (Cero Ambigüedad) */}
        <button 
          id="btn-download-pdf-dock"
          type="button"
          onClick={handleExportPDF}
          disabled={isExporting}
          className="btn-primary"
          style={{ padding: "6px 14px", fontSize: "11px", borderRadius: "9999px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>download</span>
          {isExporting ? "Generando..." : "Descargar PDF"}
        </button>

        {/* Opción Secundaria: Imprimir */}
        <button 
          id="btn-print-pdf-dock"
          type="button"
          onClick={handlePrintPDF}
          style={{ background: "none", border: "none", color: "var(--color-on-surface-variant)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
          title="Abrir diálogo de impresión del navegador"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>print</span>
          Imprimir
        </button>

        {/* Opción Secundaria: Copiar Texto Markdown */}
        <button 
          type="button"
          onClick={handleCopyMarkdown}
          style={{ background: "none", border: "none", color: "var(--color-on-surface-variant)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
          title="Copiar contenido en formato Markdown"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>content_copy</span>
          {copied ? "¡Copiado!" : "Copiar MD"}
        </button>
      </div>

    </div>
  );
}
