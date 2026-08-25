"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowUpDown, FileBarChart, FileText, Settings, Upload, Loader2, BarChart3, FileDown } from "lucide-react";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { InvoiceTable } from "@/components/InvoiceTable";
import { useInvoices } from "@/context/InvoiceContext";
import { Invoice, Currency } from "@/lib/types";
import { formatCurrency, generateCSV } from "@/lib/utils";
import { generateSummary } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import invoicesHistory from "@/data/invoices_history.json";

export default function Home() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isSyncing, setIsSyncing] = useState(false);
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();

  useEffect(() => {
    if (invoices.length === 0) {
      invoicesHistory.forEach((inv: any) => {
        addInvoice(inv as Invoice);
      });
    }
  }, []);

  const summary = useMemo(() => generateSummary(invoices), [invoices]);

  const totalGasto = useMemo(() => {
    return invoices
      .filter((inv) => inv.moneda === currency)
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices, currency]);

  const totalIva = useMemo(() => {
    return invoices
      .filter((inv) => inv.moneda === currency)
      .reduce((sum, inv) => sum + (inv.iva ?? 0), 0);
  }, [invoices, currency]);

  const totalFacturas = invoices.length;
  const pendientes = invoices.filter((inv) => inv.estado_pago === "pendiente").length;

  const handleExportCSV = () => {
    if (invoices.length === 0) return;
    const csv = generateCSV(invoices);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facturas_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncGSheets = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      alert("¡Sincronización exitosa con Google Sheets!");
    } catch (err: any) {
      alert(`Error al sincronizar: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ToastProvider>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              DocuParse AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Digitaliza, extrae y categoriza automáticamente tus facturas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="USD">USD</option>
              <option value="Bs">Bs</option>
            </select>

            <Link
              href="/upload"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 inline-block mr-1" />
              Cargar Factura
            </Link>
          </div>
        </header>

        {/* Métricas */}
        <DashboardMetrics
          totalGasto={totalGasto}
          totalIva={totalIva}
          totalFacturas={totalFacturas}
          pendientes={pendientes}
          currency={currency}
        />

        {/* Tabla */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                Historial de Facturas
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={invoices.length === 0}
                className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                aria-label="Exportar CSV"
              >
                <FileDown className="h-4 w-4 inline-block mr-1" />
                Exportar CSV
              </button>
              <button
                onClick={handleSyncGSheets}
                disabled={invoices.length === 0 || isSyncing}
                className="rounded-lg bg-[#0F9D58] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0F9D58]/90"
                aria-label="Sincronizar Sheets"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 inline-block mr-1 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 inline-block mr-1" />
                )}
                Sincronizar Sheets
              </button>
            </div>
          </div>

          <InvoiceTable
            invoices={invoices}
            currency={currency}
            onDelete={deleteInvoice}
            onEdit={(id, data) => updateInvoice(id, data)}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* Resumen de categorías */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Resumen por Categoría</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["servicios", "transporte", "oficina", "software", "otros"].map((cat) => {
              const total = invoices
                .filter((inv) => inv.categoria === cat && inv.moneda === currency)
                .reduce((sum, inv) => sum + inv.total, 0);
              return (
                <div key={cat} className="rounded-lg bg-card p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {cat}
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {formatCurrency(total, currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}