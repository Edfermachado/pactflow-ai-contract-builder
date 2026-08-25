import "./globals.css";
import { InvoiceProvider } from "@/context/InvoiceContext";

export const metadata = {
  title: "DocuParse AI",
  description: "SaaS para digitalizar, extraer y categorizar automáticamente datos de facturas",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <InvoiceProvider initialData={[]}>
          {children}
        </InvoiceProvider>
      </body>
    </html>
  );
}