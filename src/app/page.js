"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ContractWizard from "@/components/ContractWizard";
import ContractPreview from "@/components/ContractPreview";
import templatesData from "@/data/contract_templates.json";

export default function Home() {
  const [activeTemplateId, setActiveTemplateId] = useState("tpl_web_fullstack");
  const [isGenerating, setIsGenerating] = useState(false);

  // Formulario inicial rellenado con la plantilla por defecto en español
  const [formData, setFormData] = useState({
    providerName: "DevStudio Freelance C.A.",
    providerTaxId: "J-40912345-0",
    clientName: "Acme Corp LLC",
    clientTaxId: "XX-9876543",
    projectTitle: "Desarrollo Web Full-Stack Next.js",
    scope: "Desarrollo completo de aplicación web responsive utilizando Next.js, integración de API backend, base de datos y sistema de autenticación de usuarios. Pruebas unitarias básicas y optimización de velocidad de carga (SEO técnico).",
    deliverables: [
      "Código fuente completo en repositorio GitHub/GitLab",
      "Documentación técnica de despliegue y variables de entorno",
      "Web pública desplegada en producción (Vercel/AWS)",
      "30 días de garantía para corrección de bugs o errores de código"
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
  });

  // Texto del contrato inicial por defecto en español
  const [contractText, setContractText] = useState(`CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

## ENCABEZADO Y PARTES CONTRATANTES
En la fecha de firma del presente documento, comparecen por una parte DevStudio Freelance C.A. (en adelante, el "PRESTADOR"), identificado con RIF/DNI N° J-40912345-0; y por la otra parte Acme Corp LLC (en adelante, el "CLIENTE"), identificado con RIF/DNI N° XX-9876543.

---

## CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
El PRESTADOR se compromete a prestar a favor del CLIENTE los servicios profesionales consistentes en: "Desarrollo Web Full-Stack Next.js".

**Detalle del Alcance:**
Desarrollo completo de aplicación web responsive utilizando Next.js, integración de API backend, base de datos y sistema de autenticación de usuarios. Pruebas unitarias básicas y optimización de velocidad de carga (SEO técnico).

---

## CLÁUSULA SEGUNDA: ENTREGABLES Y CRONOGRAMA DE EJECUCIÓN
El proyecto se ejecutará en un plazo estimado de 21 días calendarios, contados a partir de la firma de este acuerdo y la recepción del primer pago.

**Entregables Aceptados:**
- Código fuente completo en repositorio GitHub/GitLab
- Documentación técnica de despliegue y variables de entorno
- Web pública desplegada en producción (Vercel/AWS)
- 30 días de garantía para corrección de bugs o errores de código

---

## CLÁUSULA TERCERA: HONORARIOS Y CONDICIONES DE PAGO
Como contraprestación total por los servicios prestados, el CLIENTE se obliga a pagar la suma fija e incondicional de 1500 USD.

- **Estructura de Pago:** 50% como anticipo inicial para dar inicio al proyecto y 50% al momento de la entrega final.
- **Penalización por Mora:** Toda factura no cancelada tras 5 días de su vencimiento devengará un interés de mora del 1.5% mensual hasta su total pago.

---

## CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL
La propiedad intelectual y los derechos de autor patrimoniales sobre los productos y entregables finales desarrollados en virtud de este contrato se transferirán al CLIENTE de manera exclusiva e irrevocable ÚNICAMENTE tras la recepción total y efectiva del 100% de los honorarios acordados.

---

## CLÁUSULA QUINTA: CONFIDENCIALIDAD (NDA)
Ambas partes acuerdan mantener en estricta confidencialidad toda la información técnica, comercial o financiera compartida durante la ejecución de este proyecto.

---

## CLÁUSULA SEXTA: JURISDICCIÓN Y LEY APLICABLE
Este contrato se regirá e interpretará conforme a las leyes vigentes en Delaware (Recomendado).

---

## FIRMAS DE CONFORMIDAD

_________________________________             _________________________________
**POR EL PRESTADOR**                           **POR EL CLIENTE**
DevStudio Freelance C.A.                       Acme Corp LLC
`);

  const [auditResult, setAuditResult] = useState({
    score: 95,
    status: "Auditado",
    alerts: [],
    recommendations: [
      { title: "Coherencia de Estructura", message: "La relación entre plazo (21 días) y entregables es proporcional y equilibrada." }
    ]
  });

  const handleSelectTemplate = (template) => {
    setActiveTemplateId(template.id);
    setFormData({
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
      customClauses: ""
    });
  };

  // Reseteo completo a borrador limpio
  const handleResetForm = () => {
    setActiveTemplateId(null);
    setFormData({
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
    });

    setContractText(`CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

## ENCABEZADO Y PARTES CONTRATANTES
En la fecha [FECHA DE FIRMA], comparecen por una parte [NOMBRE DEL PRESTADOR DE SERVICIOS], (en adelante, el "PRESTADOR"); y por la otra parte [NOMBRE DEL CLIENTE], (en adelante, el "CLIENTE").

---

## CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
[Complete el formulario con el alcance y haga clic en 'Auditar y Generar Contrato con IA' para redactar automáticamente con IA]

---

## CLÁUSULA SEGUNDA: ENTREGABLES Y CRONOGRAMA
[Pendiente de definir alcance y entregables...]

---

## CLÁUSULA TERCERA: HONORARIOS Y FORMA DE PAGO
[Pendiente de definir monto y estructura de pago...]

---

## FIRMAS DE CONFORMIDAD

_________________________________             _________________________________
**POR EL PRESTADOR**                           **POR EL CLIENTE**
`);

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
      
      {/* TopNavBar */}
      <Navbar onNewContract={handleResetForm} />

      {/* Split Main Area: Izquierda Formulario (52%) | Derecha Previsualización (48%) */}
      <div className="main-split-container">
        
        {/* Panel Izquierdo (52%) - Formulario */}
        <ContractWizard
          formData={formData}
          setFormData={setFormData}
          onGenerate={handleGenerateContract}
          isGenerating={isGenerating}
          onSelectTemplate={handleSelectTemplate}
          activeTemplateId={activeTemplateId}
        />

        {/* Panel Derecho (48%) - Vista Previa en Hoja de Papel */}
        <ContractPreview
          contractText={contractText}
          setContractText={setContractText}
          auditResult={auditResult}
          formData={formData}
        />

      </div>

    </div>
  );
}
