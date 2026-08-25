"use client";

import { useState } from "react";
import { Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { X, CheckCircle2, Download, Edit } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: Partial<Invoice>) => void;
  onExportCSV?: () => void;
  currency: "USD" | "Bs";
}

export function InvoiceTable({
  invoices,
  currency,
  onDelete,
  onEdit,
  onExportCSV,
}: InvoiceTableProps) {
  const [columns, setColumns] = useState([
    { accessorKey: "id", header: "ID", size: 100 },
    { accessorKey: "emisor", header: "Emisor", size: 200 },
    { accessorKey: "fecha_emision", header: "Fecha Emisión", size: 150 },
    { accessorKey: "total", header: "Total", size: 120 },
    { accessorKey: "estado_pago", header: "Estado", size: 120 },
  ]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filtered = invoices.filter((inv) =>
    inv.emisor.toLowerCase().includes(search.toLowerCase())
  );

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    invoices.reduce(
      (acc, inv) => ({ ...acc, [inv.id]: false }),
      {} as Record<string, boolean>
    )
  );

  return (
    <div className="overflow-x-auto rounded-lg bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border bg-background">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar emisor o categoría..."
            className="flex-1 rounded-lg border border-input py-2 pl-3 pr-8 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Buscar facturas"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRowSelection(
              invoices.reduce(
                (acc, inv) => ({ ...acc, [inv.id]: true }),
                {} as Record<string, boolean>
              )
            )}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            disabled={invoices.length === 0}
            aria-label="Seleccionar todas"
          >
            {invoices.length > 0 ? "Seleccionar todas" : "Ninguno"}
          </button>

          <button
            onClick={onExportCSV}
            disabled={invoices.length === 0}
            className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            aria-label="Exportar CSV"
          >
            <Download className="h-4 w-4 inline-block mr-1" />
            CSV
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="p-4">
        <table className="w-full caption-bottom text-sm">
          <caption className="text-muted-foreground mb-4">
            {invoices.length} factura{invoices.length !== 1 ? "s" : ""}
          </caption>
          <thead>
            <tr>
              <th className="py-3 border border-border font-medium text-muted-foreground">
                <span>Seleccionar</span>
              </th>
              <th
                className="py-3 border border-border font-medium text-left cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSortBy({ key: "id", direction: "asc" })}
              >
                {columns.find((c) => c.accessorKey === "id")?.header}
              </th>
              <th
                className="py-3 border border-border font-medium text-left cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSortBy(prev => prev?.key === "emisor" ? { key: "emisor", direction: prev.direction === "asc" ? "desc" : "asc" } : { key: "emisor", direction: "asc" })}
              >
                {columns.find((c) => c.accessorKey === "emisor")?.header}
              </th>
              <th
                className="py-3 border border-border font-medium text-left cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSortBy(prev => prev?.key === "fecha_emision" ? { key: "fecha_emision", direction: prev.direction === "asc" ? "desc" : "asc" } : { key: "fecha_emision", direction: "asc" })}
              >
                {columns.find((c) => c.accessorKey === "fecha_emision")?.header}
              </th>
              <th
                className="py-3 border border-border font-medium text-left cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSortBy(prev => prev?.key === "total" ? { key: "total", direction: prev.direction === "asc" ? "desc" : "asc" } : { key: "total", direction: "asc" })}
              >
                {columns.find((c) => c.accessorKey === "total")?.header}
              </th>
              <th
                className="py-3 border border-border font-medium text-left cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSortBy(prev => prev?.key === "estado_pago" ? { key: "estado_pago", direction: prev.direction === "asc" ? "desc" : "asc" } : { key: "estado_pago", direction: "asc" })}
              >
                {columns.find((c) => c.accessorKey === "estado_pago")?.header}
              </th>
              <th className="py-3 border border-border font-medium text-muted-foreground text-center">
                <span>Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  No hay facturas para mostrar
                </td>
              </tr>
            )}
            {filtered.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="py-3 pl-2">
                  <input
                    type="checkbox"
                    checked={rowSelection[invoice.id]}
                    onChange={(e) => setRowSelection(prev => ({ ...prev, [invoice.id]: e.target.checked }))}
                    className="checkbox-checkbox"
                  />
                </td>
                <td className="py-3">
                  <span className="text-xs text-muted-foreground">
                    {invoice.id}
                  </span>
                </td>
                <td className="py-3">
                  <div className="line-clamp-1">
                    <span className="font-medium">{invoice.emisor}</span>
                    {invoice.categoria && (
                      <span className="ml-2 text-xs font-normal rounded-md bg-muted/20 text-muted-foreground">
                        {invoice.categoria}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  {invoice.fecha_emision ? (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(invoice.fecha_emision).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/D</span>
                  )}
                </td>
                <td className="py-3">
                  <div>
                    {formatCurrency(invoice.total, invoice.moneda)}
                  </div>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-medium">
                    {invoice.estado_pago === "pagada"
                      ? "Pagada ✓"
                      : invoice.estado_pago === "pendiente"
                        ? "Pendiente ⏳"
                        : invoice.estado_pago === "vencida"
                          ? "Vencida ⚠️"
                          : "Parcial ⚡"}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <ActionButtons 
                    invoice={invoice} 
                    onEdit={onEdit!} 
                    onDelete={onDelete!} 
                    currency={currency} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  invoice: Invoice;
  onEdit: (id: string, data: Partial<Invoice>) => void;
  onDelete: (id: string) => void;
  currency: "USD" | "Bs";
}

function ActionButtons({ invoice, onEdit, onDelete, currency }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(invoice.id, invoice)}
        className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        title="Editar"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(invoice.id)}
        className="rounded-lg bg-destructive px-2.5 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
        title="Eliminar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}