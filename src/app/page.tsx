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
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
              DocuParse AI
            </h1>
            <p className="text-muted-foreground mt-1 text-lg font-medium">
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
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
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
                className="rounded-xl bg-white/80 backdrop-blur-md border border-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
                aria-label="Exportar CSV"
              >
                <FileDown className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={handleSyncGSheets}
                disabled={invoices.length === 0 || isSyncing}
                className="rounded-xl bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
                aria-label="Sincronizar Sheets"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
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