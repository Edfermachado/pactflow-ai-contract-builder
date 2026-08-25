import { Invoice } from "./types";

export function formatCurrency(amount: number, currency: Invoice["moneda"] = "USD"): string {
  if (currency === "Bs") {
    return `Bs ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/D";
  return new Date(dateStr).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPaymentStatus(status: Invoice["estado_pago"]): string {
  const map: Record<Invoice["estado_pago"], string> = {
    pagada: "Pagada",
    pendiente: "Pendiente",
    vencida: "Vencida",
    parcial: "Parcial",
  };
  return map[status] || status;
}

export function formatCategory(category: Invoice["categoria"]): string {
  const map: Record<Invoice["categoria"], string> = {
    servicios: "Servicios",
    transporte: "Transporte",
    oficina: "Oficina",
    software: "Software",
    otros: "Otros",
  };
  return map[category] || category;
}

export function generateCSV(invoices: Invoice[]): string {
  if (invoices.length === 0) return "No hay datos disponibles";

  const headers = [
    "ID",
    "Emisor",
    "RIF",
    "Fecha Emisión",
    "Fecha Pago",
    "Concepto",
    "Subtotal",
    "IVA",
    "Total",
    "Categoría",
    "Estado Pago",
    "Moneda",
    "Método Pago",
  ];

  const rows: string[][] = [headers];

  invoices.forEach((inv) => {
    const row: string[] = [
      inv.id,
      `"${inv.emisor.replace(/"/g, '""')}"`,
      `"${inv.rif}"`,
      formatDate(inv.fecha_emision),
      formatDate(inv.fecha_pago),
      `"${inv.concepto?.replace(/"/g, '""')}"`,
      formatCurrency(inv.subtotal, inv.moneda),
      inv.iva != null ? formatCurrency(inv.iva, inv.moneda) : "",
      formatCurrency(inv.total, inv.moneda),
      formatCategory(inv.categoria),
      formatPaymentStatus(inv.estado_pago),
      inv.moneda,
      inv.metodo_pago || "",
    ];

    rows.push(row);
  });

  return rows.map((row) => row.join(",")).join("\n");
}

export function generateSummary(invoices: Invoice[]) {
  const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const ivaTotal = invoices.reduce((sum, inv) => sum + (inv.iva ?? 0), 0);
  const count = invoices.length;
  const pagadas = invoices.filter((inv) => inv.estado_pago === "pagada").length;
  const pendientes = invoices.filter((inv) => inv.estado_pago === "pendiente").length;
  const vencidas = invoices.filter((inv) => inv.estado_pago === "vencida").length;
  const parciales = invoices.filter((inv) => inv.estado_pago === "parcial").length;

  const byCurrency = invoices.reduce((acc, inv) => {
    acc[inv.moneda] = (acc[inv.moneda] || 0) + inv.total;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    ivaTotal,
    count,
    pagadas,
    pendientes,
    vencidas,
    parciales,
    byCurrency,
  };
}