import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auditContractData, buildEnrichedLegalPrompt } from "@/agents/legalClauseAgent";

export async function POST(req) {
  try {
    const formData = await req.json();
    
    // 1. Auditoría mediante el agente especializado legal-clause-agent
    const auditResult = auditContractData(formData);

    const apiKey = process.env.GEMINI_API_KEY;

    let contractText = "";

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = buildEnrichedLegalPrompt(formData, auditResult);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        contractText = response.text();
      } catch (geminiError) {
        console.warn("Error al invocar la API de Gemini, utilizando fallback resiliente:", geminiError);
        contractText = generateFallbackContract(formData, auditResult);
      }
    } else {
      console.warn("No se detectó GEMINI_API_KEY válida, usando fallback resiliente.");
      contractText = generateFallbackContract(formData, auditResult);
    }

    return NextResponse.json({
      success: true,
      contractText,
      auditResult
    });

  } catch (error) {
    console.error("Error en /api/generate-contract:", error);
    return NextResponse.json(
      {
        success: false,
        error: "No se pudo generar el contrato. Inténtelo de nuevo.",
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * Fallback resiliente para generación de contratos si la API de Gemini no responde.
 */
function generateFallbackContract(formData, auditResult) {
  const {
    projectTitle = "Servicios Profesionales de Desarrollo",
    providerName = "[NOMBRE DEL PRESTADOR]",
    providerTaxId = "[RIF/DNI PRESTADOR]",
    clientName = "[NOMBRE DEL CLIENTE]",
    clientTaxId = "[RIF/DNI CLIENTE]",
    scope = "Prestación de servicios profesionales de desarrollo y consultoría.",
    totalAmount = "1000",
    currency = "USD",
    timelineDays = "15",
    paymentStructure = "50_50",
    jurisdiction = "General / Comercio Digital",
    lateFeePercentage = "1.5",
    revisionRounds = "2",
    includeNDA = true,
    includeIPClause = true
  } = formData || {};

  const deliverablesList = auditResult.validDeliverables.length > 0 
    ? auditResult.validDeliverables.map(d => `- ${d}`).join("\n")
    : "- Entregables especificados según requerimientos del proyecto";

  return `# CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

## ENCABEZADO Y PARTES CONTRATANTES
En la fecha de firma del presente documento, comparecen por una parte **${providerName}** (en adelante, el **"PRESTADOR"**), identificado con RIF/DNI N° **${providerTaxId}**; y por la otra parte **${clientName}** (en adelante, el **"CLIENTE"**), identificado con RIF/DNI N° **${clientTaxId}**.

Ambas partes se reconocen mutuamente la capacidad legal necesaria para contratar y obligarse en los términos de este instrumento.

---

## CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
El PRESTADOR se compromete a prestar a favor del CLIENTE los servicios profesionales consistentes en: **"${projectTitle}"**.

**Detalle del Alcance:**
${scope}

---

## CLÁUSULA SEGUNDA: ENTREGABLES Y CRONOGRAMA DE EJECUCIÓN
El proyecto se ejecutará en un plazo estimado de **${timelineDays} días calendarios**, contados a partir de la firma de este acuerdo y la recepción del primer pago.

**Entregables Aceptados:**
${deliverablesList}

El CLIENTE tendrá derecho a **${revisionRounds} ronda(s) de revisión** para solicitar ajusten menores sobre los entregables iniciales dentro de los 5 días posteriores a la entrega.

---

## CLÁUSULA TERCERA: HONORARIOS Y CONDICIONES DE PAGO
Como contraprestación total por los servicios prestados, el CLIENTE se obliga a pagar la suma fija e incondicional de **${totalAmount} ${currency}**.

- **Estructura de Pago:** ${paymentStructure === '50_50' ? '50% como anticipo inicial para dar inicio al proyecto y 50% al momento de la entrega final.' : paymentStructure}.
- **Penalización por Mora:** Toda factura no cancelada tras 5 días de su vencimiento devengará un interés de mora del **${lateFeePercentage}% mensual** hasta su total pago.

---

## CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL
${includeIPClause 
  ? "La propiedad intelectual y los derechos de autor patrimoniales sobre los productos y entregables finales desarrollados en virtud de este contrato se transferirán al CLIENTE de manera exclusiva e irrevocable ÚNICAMENTE tras la recepción total y efectiva del 100% de los honorarios acordados."
  : "Se otorga una licencia de uso no exclusiva para el CLIENTE sobre los entregables finales."}

---

## CLÁUSULA QUINTA: CONFIDENCIALIDAD (NDA)
${includeNDA 
  ? "Ambas partes acuerdan mantener en estricta confidencialidad toda la información técnica, comercial o financiera compartida durante la ejecución de este proyecto. Esta obligación subsistirá durante 2 años posteriores a la finalización del contrato."
  : "Las partes acuerdan no requerir acuerdos de confidencialidad adicionales."}

---

## CLÁUSULA SEXTA: JURISDICCIÓN Y LEY APLICABLE
Este contrato se regirá e interpretará conforme a las leyes vigentes en **${jurisdiction}**. Para cualquier controversia no resuelta amigablemente, las partes se someten expresamente a los tribunales de dicha jurisdicción.

---

## FIRMAS DE CONFORMIDAD

_________________________________             _________________________________
**POR EL PRESTADOR**                           **POR EL CLIENTE**
${providerName}                                ${clientName}
`;
}
