# Skill & Comando Personalizado: /gen-contract-pdf

## Comando: `/gen-contract-pdf`

### Descripción
Skill personalizada que orquesta la compilación del texto del contrato legal generado o editado, aplica la jerarquía tipográfica formal de documentos ejecutivos (márgenes legales, marcas de agua de borrador o contrato oficial, pie de página con numeración "Página X de Y", secciones de firmas digitales o manuales) y emite un archivo PDF descargable directamente en el cliente.

### Especificaciones Técnicas
- **Librería base:** `jspdf` y `html2canvas` para renderizado en frontend.
- **Sin costo de servidor:** Todo el proceso de maquetación y renderizado corre en el cliente del usuario.
- **Soporte de Formato:** A4 estándar con márgenes de 20mm, tipografía monospace o sans-serif legibles para lectura formal.

### Parámetros
- `contractData`: Objeto con las cláusulas completas, título, cliente, prestador y firmas.
- `watermark`: Opcional ("BORRADOR", "OFICIAL", "FIRMIDO").
- `filename`: Nombre del archivo de salida (ej. `Contrato_Servicios_[Cliente]_[Fecha].pdf`).

### Código de Ejecución
```javascript
import { generateContractPDF } from '@/utils/pdfGenerator';

// Ejecución del comando
await generateContractPDF({
  title: "Contrato de Prestación de Servicios de Desarrollo Web",
  clientName: "Acme Corp",
  providerName: "DevStudio Freelance",
  content: contractText,
  signatureBase64: providerSignature,
  watermark: "OFICIAL"
});
```
