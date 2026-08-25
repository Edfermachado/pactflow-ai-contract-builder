# export-history

## Comando: `/export-history`

### Descripción
Exporta los datos del historial de facturas a CSV o sincroniza el historial en la base JSON local.

### Funcionalidades

#### Exportar a CSV
```typescript
import { generateCSV } from "@/lib/utils";
import { invoices } from "@/context/InvoiceContext";

// Generar y descargar
function handleExportCSV() {
  const csv = generateCSV(invoices);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `facturas_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}
```

#### Exportar a Google Sheets (futuro)
```typescript
// Preparar datos para sincronización
const sheetsData = invoices.map((inv) => [
  inv.id,
  inv.emisor,
  inv.rif,
  inv.fecha_emision,
  inv.total,
  inv.moneda,
  inv.estado_pago,
]);

// Endpoint futuro: POST /api/sheets/sync
```

#### Sincronizar JSON Local
```typescript
import fs from "fs";
import path from "path";

export function syncInvoicesToJSON(invoices: Invoice[]) {
  const filePath = path.join(process.cwd(), "src/data/invoices_history.json");
  fs.writeFileSync(filePath, JSON.stringify(invoices, null, 2));
}
```

### Flujo de Trabajo

1. **Verificar datos**: Asegurar que haya al menos 1 factura
2. **Generar exportación**: Crear CSV o preparar datos para Sheets
3. **Trigger descarga**: Abrir diálogo de descarga o sincronizar

### Estados de la UI

| Estado | Descripción |
|--------|-------------|
| `idle` | Botón "Exportar" activo |
| `generating` | Spinner "Generando archivo..." |
| `downloading` | Auto-descarga iniciada |
| `error` | Mensaje de error si no hay datos |

### Métricas de Exportación

| Métrica | Descripción |
|---------|-------------|
| `totalRecords` | Número de facturas exportadas |
| `totalAmount` | Suma total de todas las facturas |
| `dateRange` | Desde la más antigua hasta la más reciente |