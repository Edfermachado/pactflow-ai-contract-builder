"use client";

import { UploadZone } from "@/components/UploadZone";
import { InvoiceModal } from "@/components/InvoiceModal";
import { useState } from "react";
import { invoiceSchema, Invoice } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { CheckCircle2 } from "lucide-react";

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Invoice> | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setSuccess(false);
    setExtractedData(null);

    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileBase64: base64String,
          mimeType: file.type,
          size: file.size,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      setExtractedData(result.data);
      setIsModalOpen(true);
    } catch (error: any) {
      alert(error.message || "No se pudieron extraer los datos");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = (data: Invoice) => {
    console.log("Guardando factura:", data);
    setIsModalOpen(false);
    setSuccess(true);
    setExtractedData(null);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Subir Comprobante</h1>
            <p className="text-muted-foreground mb-6">
              Carga una imagen o PDF de tu factura para extraer los datos automáticamente
            </p>

            {/* Zona de carga */}
            <UploadZone
              onUpload={handleFileUpload}
              isLoading={isProcessing}
              error={null}
              success={success}
            />

            {/* Instrucciones */}
            {!isProcessing && !success && (
              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Tips para mejores resultados:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usa imágenes claras y bien iluminadas</li>
                  <li>• Asegúrate de que el texto sea legible</li>
                  <li>• Incluye el RIF y montos totales visibles</li>
                  <li>• Formatos soportados: JPG, PNG, PDF (máx. 4MB)</li>
                </ul>
              </div>
            )}

            {/* Modal de confirmación editable */}
            <InvoiceModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              initialData={extractedData || undefined}
              onSave={handleSave}
              currency="USD"
              isLoading={false}
            />

            {/* Éxito */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Factura guardada exitosamente</p>
                  <p className="text-sm text-green-600">
                    Los datos han sido agregados al historial
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}