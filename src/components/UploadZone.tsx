"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "./ui";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export function UploadZone({ onUpload, isLoading, error, success }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      await onUpload(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 4 * 1024 * 1024,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        isLoading && "pointer-events-none opacity-70",
        error && "border-destructive",
        success && "border-green-500 bg-green-500/5"
      )}
    >
      <input {...getInputProps()} />

      {preview && (
        <div className="mb-4 relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg mx-auto object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!preview && (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Procesando imagen...</p>
              <p className="text-sm text-muted-foreground">
                Extrayendo datos con IA
              </p>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium text-green-600">
                ¡Procesamiento exitoso!
              </p>
            </>
          ) : (
            <>
              <div
                className={cn(
                  "p-4 rounded-full bg-muted",
                  isDragActive && "bg-primary/10"
                )}
              >
                <Upload
                  className={cn(
                    "h-10 w-10",
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? "Suelta el archivo aquí"
                    : "Arrastra tu factura o haz clic para seleccionar"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Soporta JPG, PNG y PDF (máx. 4MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}