"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TemplateSelector from "@/components/TemplateSelector";
import ContractWizard from "@/components/ContractWizard";
import ContractPreview from "@/components/ContractPreview";
import { Sparkles, Shield, Cpu, Code2, DownloadCloud } from "lucide-react";
import templatesData from "@/data/contract_templates.json";

export default function Home() {
  const [activeStep, setActiveStep] = useState(1); // 1 = Wizard, 2 = Preview
  const [theme, setTheme] = useState("dark");
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  
  // Estado del Formulario
  const [formData, setFormData] = useState({
    providerName: "",
    providerTaxId: "",
    clientName: "",
    clientTaxId: "",
    projectTitle: "",
    scope: "",
    deliverables: ["", ""],
    totalAmount: 1200,
    currency: "USD",
    timelineDays: 15,
    paymentStructure: "50_50",
    lateFeePercentage: 1.5,
    revisionRounds: 2,
    jurisdiction: "general",
    includeIPClause: true,
    includeNDA: true,
    customClauses: ""
  });

  // Estado del Contrato Generado y Auditoría
  const [contractText, setContractText] = useState("");
  const [auditResult, setAuditResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Carga de Plantilla desde MCP Context
  const handleSelectTemplate = (template) => {
    setActiveTemplateId(template.id);
    setFormData(prev => ({
      ...prev,
      projectTitle: template.title,
      scope: template.scope,
      deliverables: [...template.deliverables],
      totalAmount: template.totalAmount,
      currency: template.currency,
      timelineDays: template.timelineDays,
      paymentStructure: template.paymentStructure,
      lateFeePercentage: template.lateFeePercentage,
      revisionRounds: template.revisionRounds
    }));
  };

  // Disparador del Agente e Integración con Gemini
  const handleGenerateContract = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setContractText(data.contractText);
        setAuditResult(data.auditResult);
        setActiveStep(2); // Avanzar a vista previa
      } else {
        alert(data.error || "Ocurrió un error al generar el contrato.");
      }
    } catch (err) {
      console.error("Error al conectar con la API de generación:", err);
      alert("Error de conexión con el servidor.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      <Navbar 
        activeStep={activeStep} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />

      <main className="app-container" style={{ flex: 1 }}>
        
        {/* Banner Hero */}
        <div className="glass-card animate-fade-in" style={{ padding: "32px", marginBottom: "32px", background: "var(--gradient-card)" }}>
          <div style={{ maxWidth: "800px" }}>
            <span className="badge badge-indigo" style={{ marginBottom: "12px" }}>
              <Cpu size={12} /> Powered by Gemini Flash & Antigravity Agent
            </span>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
              Generador Inteligente de <span className="gradient-text">Contratos & Acuerdos</span> para Freelancers
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              Protege tus proyectos y honorarios en minutos. Configura el alcance, audita la coherencia entre entregables y pago con <strong style={{ color: "var(--accent-indigo)" }}>legal-clause-agent</strong> y exporta a PDF formal con el comando <strong style={{ color: "var(--accent-emerald)" }}>/gen-contract-pdf</strong>.
            </p>
          </div>
        </div>

        {activeStep === 1 ? (
          <>
            {/* Carga de Plantilla (MCP Data Context) */}
            <TemplateSelector 
              onSelectTemplate={handleSelectTemplate} 
              activeTemplateId={activeTemplateId} 
            />

            {/* Formulario Guiado Paso a Paso */}
            <ContractWizard 
              formData={formData} 
              setFormData={setFormData} 
              onGenerate={handleGenerateContract} 
              isGenerating={isGenerating} 
            />
          </>
        ) : (
          /* Vista Previa, Auditoría del Agente y Exportación PDF */
          <ContractPreview 
            contractText={contractText} 
            setContractText={setContractText} 
            auditResult={auditResult} 
            formData={formData} 
            onBackToWizard={() => setActiveStep(1)} 
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        AutoContract AI © {new Date().getFullYear()} — Proyecto Final de Desarrollo con Inteligencia Artificial.
      </footer>

    </div>
  );
}
