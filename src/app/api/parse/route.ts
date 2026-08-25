import { NextRequest, NextResponse } from "next/server";
import { parseInvoiceImage } from "@/lib/gemini";
import { invoiceSchema } from "@/lib/types";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Servicio de IA no configurado. Contacta al administrador.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { fileBase64, mimeType, size } = body;

    if (!fileBase64) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    if (size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "El archivo es demasiado grande (máx. 4MB)" },
        { status: 413 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { success: false, error: `Tipo de archivo no soportado: ${mimeType}` },
        { status: 415 }
      );
    }

    const base64Data = fileBase64.split(",")[1] || fileBase64;
    const result = await parseInvoiceImage(base64Data, mimeType);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "No se pudieron extraer datos de la imagen",
        },
        { status: 500 }
      );
    }

    let parsedData = { ...result.data };

    if (!parsedData.id) {
      parsedData.id = `inv_${randomUUID().substring(0, 8)}`;
    }

    parsedData.fecha_emision = parsedData.fecha_emision ?? null;
    parsedData.fecha_pago = parsedData.fecha_pago ?? null;
    parsedData.items = parsedData.items ?? null;

    const validation = invoiceSchema.safeParse(parsedData);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos extraídos no cumplen con el esquema",
          details: validation.error.errors,
          partialData: parsedData,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: validation.data,
        usage: result.usage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en /api/parse:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/parse",
      method: "POST",
      description: "Procesa una imagen o PDF de factura y extrae datos estructurados",
      body: {
        type: "multipart/form-data",
        fields: {
          fileBase64: "Archivo en formato base64 (image/jpeg, image/png, application/pdf, máx. 4MB)",
        },
      },
      response: {
        success: "boolean",
        data: "Invoice (objeto validado con Zod)",
        error: "string?",
        usage: "object?",
      },
    },
    { status: 200 }
  );
}