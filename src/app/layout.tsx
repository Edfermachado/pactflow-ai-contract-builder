import "./globals.css";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { Invoice } from "@/lib/types";
import initialInvoicesData from "@/data/initial_invoices.json";
import { Outfit } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "DocuParse AI",
  description: "SaaS para digitalizar, extraer y categorizar automáticamente datos de facturas",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  // Casting the imported JSON to our Invoice type to serve as initial context state
  const seedData = initialInvoicesData as unknown as Invoice[];

  return (
    <html lang="es" className={outfit.variable}>
      <body className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
        <InvoiceProvider initialData={seedData}>
          {children}
        </InvoiceProvider>
      </body>
    </html>
  );
}