import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  "emisor": "Supermercado XYZ",
  "rif": "J-12345678-9",
  ...
}`;

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