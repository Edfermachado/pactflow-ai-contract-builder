import jsPDF from "jspdf";

/**
 * Skill / Comando: /gen-contract-pdf
 * Compila las cláusulas seleccionadas, aplica estilos tipográficos de documento formal
 * y emite el archivo descargable directamente en el frontend sin costo de servidor.
 */
export async function generateContractPDF({
  projectTitle = "Contrato de Prestación de Servicios",
  providerName = "Prestador de Servicios",
  clientName = "Cliente",
  contractText = "",
  watermark = "OFICIAL",
  filename = null
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // 1. Marca de agua suave (si es borrador u oficial)
  const addPageDecorations = (pageNum, totalPages) => {
    doc.saveGraphicsState();
    
    // Marca de agua
    if (watermark) {
      doc.setTextColor(230, 230, 235);
      doc.setFontSize(54);
      doc.setFont("helvetica", "bold");
      doc.text(watermark, pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45
      });
    }

    // Encabezado
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 150);
    doc.text("DOCUMENTO LEGAL GENERADO POR AUTO-CONTRACT AI", margin, 12);
    doc.text(`REF: ${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, pageWidth - margin, 12, { align: "right" });

    // Línea separadora superior
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Pie de página
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.text("Confidencial - Solo para uso de las partes interesadas", margin, pageHeight - 8);

    doc.restoreGraphicsState();
  };

  // 2. Membrete / Encabezado Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 30, 55); // Indigo oscuro elegante
  
  const titleLines = doc.splitTextToSize((projectTitle || "CONTRATO DE PRESTACIÓN DE SERVICIOS").toUpperCase(), contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 7 + 4;

  // Subtítulo de Partes
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 80, 105);
  doc.text(`PRESTADOR: ${providerName || "N/D"}   |   CLIENTE: ${clientName || "N/D"}`, margin, currentY);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 110, 125);
  doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, currentY);
  currentY += 8;

  // Línea divisoria de título
  doc.setDrawColor(99, 102, 241); // Accent Indigo
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // 3. Procesar el texto del contrato (Markdown a texto plano formateado)
  doc.setFontSize(9.5);
  doc.setTextColor(35, 40, 50);

  const cleanText = contractText || "No hay texto generado para este contrato.";
  const paragraphs = cleanText.split('\n');

  for (let i = 0; i < paragraphs.length; i++) {
    let line = paragraphs[i].trim();
    if (!line) {
      currentY += 4;
      continue;
    }

    // Títulos de sección (# o ## o CLÁUSULA)
    const isHeading = line.startsWith('#') || line.startsWith('CLÁUSULA') || line.startsWith('CONTRATO');
    if (isHeading) {
      currentY += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      line = line.replace(/^#+\s*/, '');
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
    }

    const wrappedLines = doc.splitTextToSize(line, contentWidth);

    // Verificar si requerimos una nueva página
    if (currentY + (wrappedLines.length * 5) > pageHeight - 25) {
      doc.addPage();
      currentY = margin + 5;
    }

    doc.text(wrappedLines, margin, currentY);
    currentY += wrappedLines.length * 5 + (isHeading ? 3 : 1);
  }

  // 4. Bloque de Firmas al final
  if (currentY + 40 > pageHeight - 25) {
    doc.addPage();
    currentY = margin + 10;
  } else {
    currentY += 15;
  }

  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.4);

  // Firma Prestador
  const boxWidth = (contentWidth - 10) / 2;
  doc.line(margin, currentY + 15, margin + boxWidth, currentY + 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`POR EL PRESTADOR:`, margin, currentY + 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${providerName}`, margin, currentY + 25);

  // Firma Cliente
  const rightBoxX = margin + boxWidth + 10;
  doc.line(rightBoxX, currentY + 15, rightBoxX + boxWidth, currentY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(`POR EL CLIENTE:`, rightBoxX, currentY + 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${clientName}`, rightBoxX, currentY + 25);

  // 5. Aplicar decoraciones a todas las páginas (Número de página total)
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addPageDecorations(p, totalPages);
  }

  // 6. Descarga del archivo
  const safeFilename = filename || `Contrato_${(clientName || "Cliente").replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeFilename);
  return safeFilename;
}
