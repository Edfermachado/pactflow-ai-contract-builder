# invoice-schema-extractor

## Propósito
Agente especializado para sanitizar, tipar con Zod y validar los datos JSON extraídos del OCR/IA (specíficamente de la API Gemini Flash) para asegurar que cumplan con el esquema `InvoiceSchema` definido en `src/lib/types.ts`.

## Flujo de Trabajo

### Entrada
- JSON crudo proveniente de la respuesta de la API Gemini Flash
- Puede contener campos nulos, tipos incorrectos, strings vacías o datos faltantes

### Proceso
1. **Parse inicial**: Intentar parsear el JSON de entrada
2. **Sanitización**: 
   - Convertir tipos numéricos string a number
   - Normalizar booleanos/nulls
   - Remover campos no definidos en el esquema
3. **Validación con Zod**:
   - Ejecutar `invoiceSchema.safeParse()` sobre el dato sanitizado
   - Verificar que todos los campos obligatorios estén presentes
   - Validar tipos (string, number, null, enum values)
   - Verificar consistencias (total = subtotal + iva aprox, fechas en orden cronológico)

### Salida
- **Éxito**: Objeto `Invoice` tipado con TypeScript (`z.infer<typeof invoiceSchema>`)
- **Fallo**: Objeto con `success: false` y mensaje de error detallado indicando qué campo(s) fallaron

## Ejemplo de Uso

```typescript
import { isInvoiceValid, formatInvoice } from "@/lib/types";
import { parseInvoiceImage } from "@/lib/gemini";

const result = await parseInvoiceImage(base64Image, "image/jpeg");

if (result.success && isInvoiceValid(result.data)) {
  const formatted = formatInvoice(result.data);
  // Guardar en el historial JSON
} else {
  // Manejar error: mostrar al usuario qué campos son inválidos
  console.error("Errores de validación:", result.error);
}
```

## Casos de Resiliencia Manejados

| Escenario | Acción |
|-----------|--------|
| `fecha_emision: null` | Aceptado, se muestra "N/D" en UI |
| `items: null` | Aceptado, se muestra sin lista de items |
| `iva: null` (compras exentas) | Aceptado, se muestra "-" en totales |
| `fecha_pago: undefined` | Convertido a null, comportamiento consistente |
| RIF con formato incorrecto | Error de validación, solicitar al usuario |
| Categoría no enum | Mapeada a "otros" o error dependiendo severidad |
| Moneda no USD/Bs | Convertida a USD por defecto con warning |
| Estructura anidada extra | Campos extra ignorados (no rompen el esquema) |