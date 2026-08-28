"use client";

import { useState } from "react";
import { generateContractPDF } from "@/utils/pdfGenerator";
import confetti from "canvas-confetti";

export default function ContractPreview({ 
  contractText, 
  setContractText, 
  auditResult, 
  formData 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Native Browser Print to Save as PDF
  const handlePrintPDF = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    window.print();
  };

  // Direct jsPDF Download
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await generateContractPDF({
        projectTitle: formData.projectTitle || "Master Services Agreement",
        providerName: formData.providerName || "Service Provider",
        clientName: formData.clientName || "Client",
        contractText: contractText,
        watermark: "OFICIAL"
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(contractText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview-right-panel">
      
      {/* Top Audit Alert Bar */}
      {auditResult && (
        <div style={{ padding: "10px 24px", borderBottom: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container-high)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: auditResult.score >= 85 ? "var(--color-secondary)" : "var(--color-tertiary)" }}>
              {auditResult.score >= 85 ? "verified_user" : "gavel"}
            </span>
            <span style={{ color: "var(--color-on-surface)" }}>
              legal-clause-agent Score: <strong style={{ color: "var(--color-primary)" }}>{auditResult.score}/100</strong>
            </span>
          </div>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: "11px", padding: "4px 10px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
            {isEditing ? "Done Editing" : "Edit Text"}
          </button>
        </div>
      )}

      {/* Document Paper Sheet Container */}
      <div className="paper-sheet-container">
        
        <div className="paper-sheet">
          
          {/* Watermark DRAFT */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyCenter: "center", pointerEvents: "none", opacity: 0.03 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "110px", fontWeight: "800", color: "#0f172a", transform: "rotate(-45deg)", letterSpacing: "0.1em" }}>
              DRAFT
            </span>
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #cbd5e1" }}>
            <h2 style={{ fontFamily: "var(--font-doc)", fontSize: "20px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a" }}>
              {formData.projectTitle ? formData.projectTitle.toUpperCase() : "MASTER SERVICES AGREEMENT"}
            </h2>
            <p style={{ fontSize: "12px", color: "#64748b", fontFamily: "var(--font-body)", marginTop: "4px" }}>
              Effective Date: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Body content / Editor */}
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#4f46e5", fontWeight: "700" }}>
                Live Markdown Editor Active:
              </span>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                style={{ width: "100%", minHeight: "600px", padding: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", backgroundColor: "#f8fafc", border: "1px solid #c7d2fe", borderRadius: "4px", color: "#0f172a", outline: "none" }}
              />
            </div>
          ) : (
            <div style={{ backgroundColor: "#eef2ff", borderLeft: "4px solid #4f46e5", padding: "24px", borderRadius: "0 4px 4px 0", position: "relative" }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", color: "#4f46e5", fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
                VALIDATED CLAUSES
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#1e293b", fontFamily: "var(--font-doc)", fontSize: "14px" }}>
                {contractText || "Complete los campos y haga clic en 'Audit Clauses with Legal Agent'."}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating Bottom Dock */}
      <div className="floating-dock">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "12px", borderRight: "1px solid var(--color-outline-variant)" }}>
          <span className="pulse-badge" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-secondary)", display: "inline-block" }}></span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "600", color: "var(--color-secondary)" }}>
            Gemini: Validated
          </span>
        </div>

        {/* Native Browser Print Button (Guardar como PDF) */}
        <button 
          id="btn-print-pdf-dock"
          type="button"
          onClick={handlePrintPDF}
          style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>print</span>
          Imprimir / Guardar PDF
        </button>

        {/* Direct jsPDF Download */}
        <button 
          id="btn-download-pdf-dock"
          type="button"
          onClick={handleExportPDF}
          disabled={isExporting}
          style={{ background: "none", border: "none", color: "var(--color-on-surface)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
          {isExporting ? "Exportando..." : "Descargar PDF"}
        </button>

        <button 
          type="button"
          onClick={handleCopyMarkdown}
          style={{ background: "none", border: "none", color: "var(--color-on-surface)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>content_copy</span>
          {copied ? "Copied!" : "MD"}
        </button>
      </div>

    </div>
  );
}
