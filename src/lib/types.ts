import { z } from "zod";

export const currencyEnum = z.enum(["USD", "Bs"]);

export const paymentStatusEnum = z.enum([
  "pagada",
  "pendiente",
  "vencida",
  "parcial",
]);

export const categoryEnum = z.enum([
  "servicios",
  "transporte",
  "oficina",
  "software",
  "otros",
]);

export const itemSchema = z.object({
  descripcion: z.string(),
  cantidad: z.coerce.number().default(1),
  precio_unitario: z.coerce.number(),
  subtotal: z.coerce.number(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  emisor: z.string().min(1, "El emisor es requerido"),
  rif: z.string().min(1, "El RIF es requerido"),
  numero_factura: z.string().optional().nullable(),
  fecha_emision: z.string().nullable().optional(),
  fecha_pago: z.string().nullable().optional(),
  concepto: z.string().optional().nullable(),
  subtotal: z.coerce.number().default(0),
  tipo_impuesto: z.string().optional().nullable(),
  iva: z.coerce.number().nullable().default(null),
  total: z.coerce.number().default(0),
  categoria: categoryEnum.default("otros"),
  estado_pago: paymentStatusEnum,
  moneda: currencyEnum.default("USD"),
  metodo_pago: z.string().optional().nullable(),
  items: z.array(itemSchema).optional().nullable(),
  archivo_url: z.string().url().optional().nullable(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Currency = z.infer<typeof currencyEnum>;
export type PaymentStatus = z.infer<typeof paymentStatusEnum>;
export type Category = z.infer<typeof categoryEnum>;

export function formatInvoice(invoice: Invoice) {
  return {
    ...invoice,
    totalFormatted: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.moneda,
    }).format(invoice.total),
    subtotalFormatted: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.moneda,
    }).format(invoice.subtotal),
    ivaFormatted: invoice.iva != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: invoice.moneda,
        }).format(invoice.iva)
      : "N/A",
    fechaEmisionFormatted:
      invoice.fecha_emision
        ? new Date(invoice.fecha_emision).toLocaleDateString("es-VE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/D",
    fechaPagoFormatted:
      invoice.fecha_pago
        ? new Date(invoice.fecha_pago).toLocaleDateString("es-VE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/D",
  };
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function isInvoiceValid(invoice: unknown): invoice is Invoice {
  return invoiceSchema.safeParse(invoice).success;
}

export const createInvoiceDefaults = (): Invoice => invoiceSchema.parse({
  id: "",
  emisor: "",
  rif: "",
  numero_factura: "",
  fecha_emision: null,
  fecha_pago: null,
  concepto: "",
  subtotal: 0,
  tipo_impuesto: "",
  iva: null,
  total: 0,
  categoria: "otros",
  estado_pago: "pendiente",
  moneda: "USD",
  metodo_pago: undefined,
  items: null,
  archivo_url: undefined,
});