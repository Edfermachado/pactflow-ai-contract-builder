import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Invoice } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { invoices } = await req.json();

    if (!invoices || !Array.isArray(invoices)) {
      return NextResponse.json({ success: false, error: "Facturas inválidas" }, { status: 400 });
    }

    const credentialsStr = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!credentialsStr || !spreadsheetId) {
       return NextResponse.json({ success: false, error: "Credenciales de Google o Spreadsheet ID faltantes en .env" }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsStr,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Preparar valores
    const values = invoices.map((inv: Invoice) => [
      inv.id,
      inv.emisor,
      inv.rif,
      inv.numero_factura || "",
      inv.fecha_emision || "",
      inv.subtotal,
      inv.tipo_impuesto || "",
      inv.iva || 0,
      inv.total,
      inv.categoria,
      inv.estado_pago,
      inv.moneda
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values
      }
    });

    return NextResponse.json({ success: true, message: `${values.length} facturas sincronizadas.` });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
