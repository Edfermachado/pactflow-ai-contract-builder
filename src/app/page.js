"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContractWizard from "@/components/ContractWizard";
import ContractPreview from "@/components/ContractPreview";
import templatesData from "@/data/contract_templates.json";

// Generador reactivo del texto del contrato basado en el estado del formulario
export function buildContractDraft(data) {
  const provider = data.providerName || "[PRESTADOR DE SERVICIOS]";
  const providerId = data.providerTaxId || "[RIF/DNI PRESTADOR]";
  const client = data.clientName || "[CLIENTE]";
  const clientId = data.clientTaxId || "[RIF/DNI CLIENTE]";
  const title = data.projectTitle || "ACUERDO MARCO DE SERVICIOS LEGALES";
  const scope = data.scope || "[Alcance de los servicios por definir]";
  const amount = data.totalAmount || "0";
  const currency = data.currency || "USD";
  const days = data.timelineDays || "30";
  const jurisdiction = data.jurisdiction || "Delaware (Recomendado)";
  const lateFee = data.lateFeePercentage || 1.5;

  let deliverablesText = "";
  if (data.deliverables && data.deliverables.length > 0) {
    deliverablesText = data.deliverables.filter(d => d && d.trim()).map(d => `- ${d}`).join("\n");
  } 
  if (!deliverablesText) {
    deliverablesText = "- Entregables por definir";
  }

  let paymentStructureDesc = "50% como anticipo inicial para dar inicio al proyecto y 50% al momento de la entrega final.";
  if (data.paymentStructure === "33_33_34") {
    paymentStructureDesc = "33% como anticipo inicial, 33% al alcanzar el 50% de avance y 34% al momento de la entrega final.";
  } else if (data.paymentStructure === "100_upfront") {
    paymentStructureDesc = "100% por adelantado a la firma y formalización de este acuerdo.";
  } else if (data.paymentStructure === "monthly_retainer") {
    paymentStructureDesc = "Iguala mensual recurrente a ser cancelada por adelantado en los primeros 5 días calendarios de cada mes.";
  }

  let customClausesText = "";
  if (data.customClauses && data.customClauses.trim()) {
    customClausesText = `\n---\n\n## CLÁUSULA SÉPTIMA: ESTIPULACIONES Y PROTECCIONES ESPECIALES\n${data.customClauses.trim()}`;
  }

  return `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

## ENCABEZADO Y PARTES CONTRATANTES
En la fecha de firma del presente documento, comparecen por una parte ${provider} (en adelante, el "PRESTADOR"), identificado con RIF/DNI N° ${providerId}; y por la otra parte ${client} (en adelante, el "CLIENTE"), identificado con RIF/DNI N° ${clientId}.

---

## CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
El PRESTADOR se compromete a prestar a favor del CLIENTE los servicios profesionales de "${title}".

**Detalle del Alcance:**
${scope}

---

## CLÁUSULA SEGUNDA: ENTREGABLES Y CRONOGRAMA DE EJECUCIÓN
El proyecto se ejecutará en un plazo estimado de ${days} días calendarios, contados a partir de la firma de este acuerdo y la recepción del primer pago.

**Entregables Aceptados:**
${deliverablesText}

---

## CLÁUSULA TERCERA: HONORARIOS Y CONDICIONES DE PAGO
Como contraprestación total por los servicios prestados, el CLIENTE se obliga a pagar la suma de ${amount} ${currency}.

- **Estructura de Pago:** ${paymentStructureDesc}
- **Penalización por Mora:** Toda factura no cancelada tras 5 días de su vencimiento devengará un interés de mora del ${lateFee}% mensual.

---

## CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL
${data.includeIPClause !== false 
  ? 'La propiedad intelectual y los derechos de autor patrimoniales sobre los entregables finales desarrollados se transferirán al CLIENTE de manera exclusiva e irrevocable ÚNICAMENTE tras la recepción total y efectiva del 100% de los honorarios acordados.' 
  : 'El PRESTADOR conserva los derechos patrimoniales sobre el código o material desarrollado, concediendo al CLIENTE una licencia de uso no exclusiva.'}

---

## CLÁUSULA QUINTA: CONFIDENCIALIDAD (NDA)
${data.includeNDA !== false 
  ? 'Ambas partes acuerdan mantener en estricta confidencialidad toda la información técnica, comercial o financiera compartida durante la ejecución de este proyecto.' 
  : 'Este contrato no incluye cláusulas especiales de confidencialidad salvo lo dispuesto por la legislación civil ordinaria.'}

---

## CLÁUSULA SEXTA: JURISDICCIÓN Y LEY APLICABLE
Este contrato se regirá e interpretará conforme a las leyes vigentes en ${jurisdiction}.${customClausesText}

---

## FIRMAS DE CONFORMIDAD

_________________________________             _________________________________
**POR EL PRESTADOR**                           **POR EL CLIENTE**
${provider}                                    ${client}
`;
}

export default function Home() {
  const [activeTemplateId, setActiveTemplateId] = useState("tpl_web_fullstack");
  const [activeStepTab, setActiveStepTab] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState("wizard"); // 'wizard' | 'preview'

  // Formulario inicial rellenado con la plantilla por defecto en español
  const initialFormData = {
    providerName: "DevStudio Freelance C.A.",
    providerTaxId: "J-40912345-0",
    clientName: "Acme Corp LLC",
    clientTaxId: "XX-9876543",
    projectTitle: "Desarrollo Web Next.js",
    scope: "Desarrollo completo de aplicación web responsive utilizando Next.js, integración de API backend, base de datos y sistema de autenticación de usuarios. Pruebas unitarias básicas y optimización SEO.",
    deliverables: [
      "Código fuente completo en repositorio GitHub",
      "Documentación técnica de despliegue",
      "Web pública desplegada en producción (Vercel/AWS)",
      "Garantía de 30 días para corrección de bugs"
    ],
    totalAmount: 1500,
    currency: "USD",
    timelineDays: 21,
    paymentStructure: "50_50",
    lateFeePercentage: 1.5,
    revisionRounds: 2,
    jurisdiction: "Delaware (Recomendado)",
    includeIPClause: true,
    includeNDA: true,
    customClauses: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [contractText, setContractText] = useState(() => buildContractDraft(initialFormData));

  const [auditResult, setAuditResult] = useState({
    score: 95,
    status: "Auditado",
    alerts: [],
    recommendations: [
      { title: "Coherencia de Estructura", message: "La relación entre plazo (21 días) y entregables es proporcional y equilibrada." }
    ]
  });

  // Selector de plantillas que actualiza reactivamente los datos Y el borrador en la hoja de papel
  const handleSelectTemplate = (template) => {
    setActiveTemplateId(template.id);
    const updatedData = {
      providerName: formData.providerName || "DevStudio Freelance C.A.",
      providerTaxId: formData.providerTaxId || "J-40912345-0",
      clientName: formData.clientName || "Acme Corp LLC",
      clientTaxId: formData.clientTaxId || "XX-9876543",
      projectTitle: template.title,
      scope: template.scope,
      deliverables: [...template.deliverables],
      totalAmount: template.totalAmount,
      currency: template.currency,
      timelineDays: template.timelineDays,
      paymentStructure: template.paymentStructure,
      lateFeePercentage: template.lateFeePercentage,
      revisionRounds: template.revisionRounds,
      jurisdiction: formData.jurisdiction || "Delaware (Recomendado)",
      includeIPClause: true,
      includeNDA: true,
      customClauses: formData.customClauses || ""
    };

    setFormData(updatedData);
    setContractText(buildContractDraft(updatedData));
    
    // Actualizar también la recomendación de auditoría base
    setAuditResult({
      score: 92,
      status: "Plantilla Inyectada",
      alerts: [],
      recommendations: [
        { title: "Plantilla Aplicada", message: `Plantilla "${template.title}" inyectada con éxito.` }
      ]
    });
  };

  // Wrapper para setFormData que actualiza también el borrador reactivamente
  const handleSetFormData = (updater) => {
    setFormData(prev => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      // Actualizar automáticamente el borrador reactivo
      setContractText(buildContractDraft(nextState));
      return nextState;
    });
  };

  // Reseteo completo a borrador limpio (Botón + Nuevo Contrato)
  const handleResetForm = () => {
    setActiveTemplateId(null);
    setActiveStepTab(1); // Siempre redirige al Paso 1: Partes y Ley
    setMobileView("wizard"); // En vista móvil redirige a la pestaña de Formulario

    const emptyData = {
      providerName: "",
      providerTaxId: "",
      clientName: "",
      clientTaxId: "",
      projectTitle: "",
      scope: "",
      deliverables: [""],
      totalAmount: "",
      currency: "USD",
      timelineDays: "",
      paymentStructure: "50_50",
      lateFeePercentage: 1.5,
      revisionRounds: 2,
      jurisdiction: "Delaware (Recomendado)",
      includeIPClause: true,
      includeNDA: true,
      customClauses: ""
    };

    setFormData(emptyData);
    setContractText(buildContractDraft(emptyData));
    setAuditResult(null);
  };

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
        // Switch to preview tab automatically on mobile after generation
        setMobileView("preview");
      } else {
        alert(data.error || "Error al generar el contrato.");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("Error de comunicación con la API de generación.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      
      {/* TopNavBar con soporte de vista móvil */}
      <Navbar 
        onNewContract={handleResetForm}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

      {/* Split Main Area: Izquierda Formulario (52%) | Derecha Previsualización (48%) */}
      <div className="main-split-container">
        
        <ContractWizard
          formData={formData}
          setFormData={handleSetFormData}
          onGenerate={handleGenerateContract}
          isGenerating={isGenerating}
          onSelectTemplate={handleSelectTemplate}
          activeTemplateId={activeTemplateId}
          isMobileHidden={mobileView !== "wizard"}
          activeStepTab={activeStepTab}
          setActiveStepTab={setActiveStepTab}
        />

        <ContractPreview
          contractText={contractText}
          setContractText={setContractText}
          auditResult={auditResult}
          formData={formData}
          isMobileHidden={mobileView !== "preview"}
        />

      </div>

    </div>
  );
}
