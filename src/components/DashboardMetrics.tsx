"use client";

import { formatCurrency } from "@/lib/utils";

interface DashboardMetricsProps {
  totalGasto: number;
  totalIva: number;
  totalFacturas: number;
  pendientes: number;
  currency: "USD" | "Bs";
}

export function DashboardMetrics({
  totalGasto,
  totalIva,
  totalFacturas,
  pendientes,
  currency,
}: DashboardMetricsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total gastado */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Total Gastado
          </span>
        </div>
        <div className="text-2xl font-semibold">
          {formatCurrency(totalGasto, currency)}
        </div>
      </div>

      {/* IVA acumulado */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            IVA Acumulado
          </span>
        </div>
        <div className="text-2xl font-semibold">
          {formatCurrency(totalIva, currency)}
        </div>
      </div>

      {/* Total facturas */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Facturas Procesadas
          </span>
        </div>
        <div className="text-2xl font-semibold">
          {totalFacturas}
        </div>
      </div>

      {/* Pendientes */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Pendientes de Pago
          </span>
        </div>
        <div className="text-2xl font-semibold text-destructive">
          {pendientes}
        </div>
      </div>
    </div>
  );
}