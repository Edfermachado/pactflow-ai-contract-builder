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

const INVOICE_EXTRACTION_PROMPT = `Eres un experto en extracción de datos de facturas. A partir de la imagen o PDF proporcionado:

1. Identifica TODOS los campos posibles:
   - emisor: nombre de la empresa o entidad
   - rif: número de identificación fiscal (con inicial J, G o V)
   - fecha_emision: fecha de emisión (formato ISO: YYYY-MM-DD)
   - fecha_pago: fecha de pago si existe (formato ISO: YYYY-MM-DD)
   - concepto: breve descripción del servicio/producto
   - subtotal: monto antes de impuestos
   - iva: monto de IVA (puede ser null)
   - total: monto total
   - categoria: clasifica como hospedaje, transporte, servicios, equipos u otros
   - estado_pago: pagada, pendiente, vencida o parcial
   - moneda: USD o Bs
   - metodo_pago: tarjeta_credito, tarjeta_debito, efectivo, transferencia

2. Si un campo no se puede determinar, devuelve null.
3. Si hay línea de items, inclúyelos como un array de objetos con:
   - descripcion, cantidad (number), precio_unitario (number), subtotal (number)
4. Genera un ID único con prefijo "inv_".
5. Devuelve la respuesta estrictamente como JSON válido, SIN markdown, SIN explicaciones.

Ejemplo de respuesta:
{
  "id": "inv_abc123",
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