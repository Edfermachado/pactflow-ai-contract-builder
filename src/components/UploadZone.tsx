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
        "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-md overflow-hidden",
        isDragActive
          ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
          : "border-slate-300 hover:border-indigo-400 hover:bg-white/50 bg-white/30",
        isLoading && "pointer-events-none opacity-80",
        error && "border-rose-500 bg-rose-500/5",
        success && "border-emerald-500 bg-emerald-500/10"
      )}
    >
      <input {...getInputProps()} />

      {preview && (
        <div className="mb-4 relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className={cn(
              "max-h-64 rounded-lg mx-auto object-contain transition-all duration-300 shadow-md",
              isLoading && "opacity-40 blur-sm scale-95"
            )}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-white/30 backdrop-blur-sm z-10">
              <Loader2 className="h-14 w-14 animate-spin text-indigo-600 drop-shadow-xl mb-3" />
              <div className="text-sm font-semibold bg-white/90 text-slate-800 px-5 py-2 rounded-full shadow-2xl border border-white/50 animate-pulse">
                Analizando con IA...
              </div>
            </div>
          )}

          {!isLoading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {!preview && (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          {isLoading ? (
            <>
              <Loader2 className="h-14 w-14 animate-spin text-indigo-600 drop-shadow-lg" />
              <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Procesando imagen...</p>
              <p className="text-sm font-medium text-slate-500">
                Extrayendo datos con Gemini IA
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
                  "p-5 rounded-3xl transition-colors duration-300",
                  isDragActive ? "bg-indigo-500/20 shadow-inner" : "bg-white/60 shadow-sm"
                )}
              >
                <Upload
                  className={cn(
                    "h-12 w-12 transition-colors duration-300",
                    isDragActive ? "text-indigo-600" : "text-slate-400"
                  )}
                />
              </div>
              <div className="mt-2">
                <p className="text-xl font-bold text-slate-700">
                  {isDragActive
                    ? "Suelta el archivo para escanear"
                    : "Arrastra tu comprobante aquí"}
                </p>
                <p className="text-sm font-medium text-slate-500 mt-2">
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