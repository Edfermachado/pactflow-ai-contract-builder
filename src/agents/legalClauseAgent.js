/**
 * Agente Especializado: legal-clause-agent
 * Audita coherencia entre el alcance del proyecto y las cláusulas de pago / propiedad intelectual.
 */

export function auditContractData(formData) {
  const alerts = [];
  const recommendations = [];
  let riskScore = 100; // 100 = Excelente, sin riesgos detectados

  const {
    providerName = "",
    clientName = "",
    scope = "",
    deliverables = [],
    totalAmount = 0,
    paymentStructure = "50_50",
    timelineDays = 0,
    lateFeePercentage = 0,
    revisionRounds = 0,
    includeIPClause = true,
    includeNDA = true,
    jurisdiction = "general"
  } = formData || {};

  // 1. Auditoría de Identidades
  if (!providerName.trim()) {
    alerts.push({
      type: "danger",
      field: "providerName",
      title: "Prestador Indefinido",
      message: "Es imprescindible indicar el nombre o razón social del prestador del servicio."
    });
    riskScore -= 20;
  }

  if (!clientName.trim()) {
    alerts.push({
      type: "danger",
      field: "clientName",
      title: "Cliente Indefinido",
      message: "Indicar el nombre del cliente o empresa contratante otorga validez jurídica al acuerdo."
    });
    riskScore -= 20;
  }

  // 2. Auditoría de Alcance y Entregables
  if (!scope || scope.trim().length < 20) {
    alerts.push({
      type: "warning",
      field: "scope",
      title: "Alcance Ambiguo o Insuficiente",
      message: "Un alcance breve o ambiguo suele causar controversias por incremento de requerimientos (Scope Creep)."
    });
    riskScore -= 15;
  }

  const validDeliverables = Array.isArray(deliverables) 
    ? deliverables.filter(d => d && d.trim().length > 0)
    : [];

  if (validDeliverables.length === 0) {
    alerts.push({
      type: "warning",
      field: "deliverables",
      title: "Sin Entregables Explicitos",
      message: "No se detallaron ítems verificables de entrega. Se recomienda listar al menos 2 entregables medibles."
    });
    riskScore -= 10;
  }

  // 3. Auditoría de Finanzas y Formatos de Pago
  const numericAmount = Number(totalAmount) || 0;
  if (numericAmount >= 2000 && paymentStructure === "100_upfront") {
    recommendations.push({
      type: "info",
      title: "Recomendación de Financiación",
      message: "Para montos elevados (>= $2,000 USD), el esquema de pagos por Hitos (30/40/30) suele generar mayor confianza en el cliente."
    });
  }

  if (numericAmount >= 1500 && paymentStructure === "100_at_end") {
    alerts.push({
      type: "warning",
      field: "paymentStructure",
      title: "Riesgo de Impago Elevado",
      message: "Cobrar el 100% al finalizar en proyectos de alto valor te expone a mora prolongada o cancelación unilateral."
    });
    riskScore -= 15;
  }

  // 4. Auditoría de Plazos y Revisiones
  const numericTimeline = Number(timelineDays) || 0;
  const numericRevisions = Number(revisionRounds) || 0;

  if (numericRevisions > 3 && numericTimeline < 15) {
    alerts.push({
      type: "warning",
      field: "revisionRounds",
      title: "Incoherencia en Rondas de Revisión",
      message: `Otorgar ${numericRevisions} rondas de revisión en solo ${numericTimeline} días puede ocasionar retrasos graves en el cronograma.`
    });
    riskScore -= 10;
  }

  // 5. Auditoría de Propiedad Intelectual
  if (includeIPClause) {
    recommendations.push({
      type: "success",
      title: "Cláusula de PI Incondicional",
      message: "Se incluye retención de derechos de propiedad intelectual hasta la recepción del pago 100% efectivo."
    });
  } else {
    alerts.push({
      type: "danger",
      field: "includeIPClause",
      title: "Sin Cláusula de Propiedad Intelectual",
      message: "Al no especificar la cláusula de PI, el cliente podría reclamar la autoría o ceder tu trabajo a terceros sin haber pagado."
    });
    riskScore -= 20;
  }

  // Normalización del Score
  const finalScore = Math.max(0, Math.min(100, riskScore));
  let status = "Bajo Riesgo";
  if (finalScore < 60) status = "Alto Riesgo";
  else if (finalScore < 85) status = "Riesgo Moderado";

  return {
    score: finalScore,
    status,
    alerts,
    recommendations,
    validDeliverables,
    auditTimestamp: new Date().toISOString()
  };
}

/**
 * Prepara el prompt perfeccionado para la API de Gemini basándose en la auditoría del Agente.
 */
export function buildEnrichedLegalPrompt(formData, auditResult) {
  const {
    providerName,
    providerTaxId,
    clientName,
    clientTaxId,
    projectTitle,
    scope,
    totalAmount,
    currency = "USD",
    timelineDays,
    paymentStructure,
    jurisdiction,
    lateFeePercentage,
    revisionRounds,
    includeNDA,
    includeIPClause,
    customClauses
  } = formData;

  return `
Eres el agente especializado en redacción jurídica de contratos internacionales "legal-clause-agent".
Tu tarea es redactar un CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES impecable, formal, legalmente vinculante y adaptado.

REGLAS DE AUDITORÍA Y REDACCIÓN:
1. El contrato debe estar redactado en ESPAÑOL formal, con numeración clara de cláusulas (PRIMERA, SEGUNDA, TERCERA...).
2. Debe utilizar términos legales precisos para la jurisdicción seleccionada (${jurisdiction}).
3. Si el campo de cliente o prestador es ambiguo, utiliza corchetes formales como [PRESTADOR DEL SERVICIO] o [CLIENTE].
4. Incluye expresamente:
   - ENCABEZADO Y PARTES VINCULADAS (Prestador: ${providerName || "[PRESTADOR]"}, RIF/DNI: ${providerTaxId || "N/A"} vs Cliente: ${clientName || "[CLIENTE]"}, RIF/DNI: ${clientTaxId || "N/A"}).
   - CLÁUSULA 1: OBJETO Y ALCANCE DEL PROYECTO (${projectTitle || "Servicios Profesionales"}). Detalle: ${scope}.
   - CLÁUSULA 2: ENTREGABLES Y CRONOGRAMA. Plazo total de ejecución: ${timelineDays || 15} días calendarios. Entregables: ${auditResult.validDeliverables.join(", ") || "Según especificaciones técnicas"}. Rondas de revisión incluidas: ${revisionRounds || 2}.
   - CLÁUSULA 3: CONDICIONES DE PAGO Y HONORARIOS. Monto Total: ${totalAmount || 0} ${currency}. Estructura de Pago: ${paymentStructure}. Penalización por Mora: ${lateFeePercentage || 1.5}% mensual.
   - CLÁUSULA 4: PROPIEDAD INTELECTUAL Y DERECHOS DE AUTOR. ${includeIPClause ? "La transferencia exclusiva de derechos patrimoniales se materializará ÚNICAMENTE tras la liquidación del 100% del pago acordado." : "Licencia estándar de uso."}
   - CLÁUSULA 5: CONFIDENCIALIDAD (NDA). ${includeNDA ? "Ambas partes se obligan a mantener estricta reserva sobre la información técnica y comercial intercambiada." : "Sin acuerdo expreso de confidencialidad."}
   ${customClauses ? `- CLÁUSULA ESPECIAL ADICIONAL: ${customClauses}` : ""}
   - CLÁUSULA FINAL: JURISDICCIÓN Y RESOLUCIÓN DE DISPUTAS. Sometido a las leyes aplicables de: ${jurisdiction}.
   - SECCIÓN DE FIRMAS DIGITALES Y DE CONFORMIDAD.

Genera ÚNICAMENTE el texto legal formateado en Markdown estructurado (usando títulos # y ##), limpio, formal y listo para ser firmado o exportado a PDF.
`;
}
