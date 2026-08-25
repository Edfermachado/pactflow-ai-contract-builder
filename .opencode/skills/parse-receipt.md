# parse-receipt

## Comando: `/parse-receipt`

### Descripción
Procesa el archivo subido (imagen o PDF), llama a la API Gemini Flash y renderiza una tarjeta de confirmación editable con los datos extraídos.

### Flujo de Trabajo

#### 1. Subida de Archivo
- Componente `UploadZone` captura el archivo
- Validación de tipo: `image/jpeg`, `image/png`, `application/pdf`
- Tamaño máximo: 10MB
- Preview en tiempo real antes del envío

#### 2. Llamada a API
```typescript
// En src/app/api/parse/route.ts
import { parseInvoiceImage } from "@/lib/gemini";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  // Convertir a base64 para Gemini
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/jpeg";
  
  const result = await parseInvoiceImage(base64, mimeType);
  return new Response(
    JSON.stringify(result),
    { headers: { "Content-Type": "application/json" } }
  );
}
```

#### 3. Renderizado de Tarjeta
- Componente `InvoiceModal` muestra los datos extraídos
- Campos editables para corrección manual
- Badges de estado por color (pagada/pendiente/vencida/parcial)
- Indicadores de campos nulos ("N/D")

### Estados de la UI durante el proceso

| Estado | Componente | Descripción |
|--------|------------|-------------|
| `idle` | UploadZone | Botón de drag & drop, sin archivo |
| `uploading` | UploadZone | Spinner, "Procesando imagen..." |
| `loading` | InvoiceModal | Skeletons mientras se formatea |
| `success` | InvoiceModal | Tarjeta con datos, botón "Guardar" |
| `error` | UploadZone | Mensaje de error, reintentar |
| `empty` | InvoiceModal | "No se detectaron datos" |

### Consideraciones de Resiliencia

- **API Key faltante**: Mostrar error amigable "Servicio de IA no configurado"
- **Imagen muy pequeña/borrosa**: Sugerir al usuario subir una mejor
- **Timeout API (>30s)**: Mostrar spinner infinito con mensaje "Procesando, espere..."
- **Respuesta JSON inválido**: Fallback a modo manual, usar dataset local
- **Campos nulos en respuesta**: Mostrar "N/D" en campos correspondientes
- **Datos parciales**: Permitir edición manual de campos no detectados