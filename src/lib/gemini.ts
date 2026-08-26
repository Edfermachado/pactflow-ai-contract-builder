import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface GeminiParseResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
}

const INVOICE_EXTRACTION_PROMPT = `Eres un experto contador y procesador de datos OCR. Tu tarea es extraer de manera precisa los datos financieros de la imagen del recibo o factura proporcionada y devolver estrictamente un objeto JSON válido que cumpla con el siguiente esquema:

{
  "emisor": "Nombre de la empresa o persona que emite",
  "rif": "El ID fiscal, RIF, RUT, CUIT o similar",
  "numero_factura": "El número de recibo, factura o ticket",
  "fecha_emision": "Fecha en formato ISO 8601 (YYYY-MM-DD), null si no se encuentra",
  "fecha_pago": "Fecha de pago si la hay (YYYY-MM-DD), null si no",
  "concepto": "Descripción general de la compra o servicio",
  "subtotal": 0.0,
  "tipo_impuesto": "Porcentaje o nombre del impuesto (ej. '16%'), vacío si no aplica",
  "iva": 0.0,
  "total": 0.0,
  "categoria": "Una de estas estrictamente: servicios, transporte, oficina, software, otros",
  "estado_pago": "Una de estas: pagada, pendiente, vencida, parcial",
  "moneda": "USD o Bs",
  "metodo_pago": "Efectivo, Transferencia, Zelle, Tarjeta, etc",
  "items": [
    {
      "descripcion": "Nombre del producto/servicio",
      "cantidad": 1,
      "precio_unitario": 0.0,
      "subtotal": 0.0
    }
  ]
}

Reglas críticas:
1. Extrae los montos de "subtotal", "iva" y "total".
2. Extrae el "tipo_impuesto" (ej. 16%) si se muestra de forma explícita.
3. Categoriza inteligentemente entre: servicios, transporte, oficina, software u otros.
4. Devuelve SOLO el objeto JSON puro, sin marcadores markdown, sin explicaciones.`;

export async function parseInvoiceImage(imageBase64: string, mimeType: string = "image/jpeg"): Promise<GeminiParseResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "GEMINI_API_KEY no configurada",
      };
    }

    const result = await model.generateContent([
      INVOICE_EXTRACTION_PROMPT,
      {
        inlineData: {
          data: imageBase64.split(",")[1] || imageBase64,
          mimeType,
        },
      },
    ]);

    const response = result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = JSON.parse(text.replace(/^[\s\S]*?(\{.*?\})[\s\S]*$/, "$1"));
    }

    return {
      success: true,
      data,
      usage: {
        promptTokens: (await model.countTokens(INVOICE_EXTRACTION_PROMPT)).totalTokens,
        candidatesTokens: 0,
        totalTokens: 0,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al procesar la imagen",
    };
  }
}

export function getPrompt(): string {
  return INVOICE_EXTRACTION_PROMPT;
}