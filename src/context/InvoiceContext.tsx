"use client";

import * as React from "react";
import { Invoice } from "@/lib/types";
import { generateSummary, formatCurrency } from "@/lib/utils";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getSummary: () => ReturnType<typeof generateSummary>;
  isLoading: boolean;
  error: string | null;
}

const InvoiceContext = React.createContext<InvoiceContextType | null>(null);

export function InvoiceProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: Invoice[];
}) {
  const [invoices, setInvoices] = React.useState<Invoice[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("docuparse_invoices");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading localStorage", e);
      }
    }
    return initialData || [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("docuparse_invoices", JSON.stringify(invoices));
    }
  }, [invoices]);

  const addInvoice = React.useCallback((invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  }, []);

  const updateInvoice = React.useCallback((id: string, data: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv))
    );
  }, []);

  const deleteInvoice = React.useCallback((id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const getSummary = React.useCallback(() => {
    return generateSummary(invoices);
  }, [invoices]);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getSummary,
        isLoading,
        error,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = React.useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
}