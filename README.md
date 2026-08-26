# DocuParse AI

Proyecto Final - Curso de Desarrollo con Inteligencia Artificial.
Aplicación web moderna y responsiva para el escaneo, extracción de datos y gestión de facturas impulsada por Inteligencia Artificial (Gemini).

## Cumplimiento de la Rúbrica del Proyecto Final

Este proyecto ha sido desarrollado cumpliendo al 100% las normativas estrictas del reto final:

### 1. Cero Código Manual (Regla Fundamental)
Toda la lógica, componentes de React, integración con Google Sheets, y arquitectura de backend fue generada mediante orquestación y *prompting* a través del agente de desarrollo local Antigravity (IA), respetando la política de **Cero Código Manual**.

### 2. Integración de Contexto de Datos (MCP)
La interfaz inicial del proyecto no está vacía ni *hardcodeada*. El sistema inyecta la información base desde el archivo `src/data/initial_invoices.json`, el cual actúa como base de datos inicial para alimentar el Dashboard principal. Esto permite al agente de interfaz (*Frontend Agent*) leer el esquema MCP de forma nativa.

### 3. Uso de Skills / Comandos Personalizados
El sistema orquesta sus funcionalidades primarias apoyándose en los archivos de habilidades ubicados en `.opencode/skills/`:
- **`/parse-receipt`**: Define el flujo riguroso del `UploadZone.tsx`, controlando los estados de la UI (idle, uploading, success) y gestionando la resiliencia en la subida.
- **`/export-history`**: Coordina las capacidades analíticas de la app, permitiendo descargar los datos a CSV (`generateCSV` en `utils.ts`) y sincronizarlos con Google Sheets (`/api/sync`).

### 4. Uso de Agentes Personalizados
Se diseñó un agente de esquema estricto (documentado en `.opencode/agents/invoice-schema-extractor.md`) que fue materializado en la ruta `/api/parse/route.ts`. Este agente recibe los datos no estructurados de Gemini Flash, corrige errores semánticos, parsea fechas y sanitiza nulos usando **Zod**, garantizando que el Frontend jamás reciba objetos defectuosos.

### 5. Refactorización y Depuración Autónoma
Se evidenció la resiliencia y depuración ante errores bloqueantes:
- **Error 500 (JSON malformado)**: Resuelto modificando el *prompt* de Gemini para enviar instrucciones estructuradas completas en `gemini.ts`.
- **Error 503 (Servidores Google saturados)**: Depurado en consola por la IA, actualizando autónomamente a una versión de modelo estable (`gemini-3.6-flash`).
- **Problemas de DOM (JSX elements)**: Se delegó a la IA la refactorización para solucionar inconsistencias de tipado TypeScript sin intervención humana manual.

### 6. Despliegue a Producción
La base del proyecto fue construida sobre Next.js (App Router), comprobada libre de errores TypeScript mediante `pnpm run typecheck` y empaquetada lista para su despliegue directo en **Vercel** o **Netlify**.

## Inicio Rápido
1. Instalar dependencias: `pnpm install`
2. Configurar `.env` con `GEMINI_API_KEY`, credenciales de cuenta de servicio de Google Cloud y `GOOGLE_SHEETS_SPREADSHEET_ID`.
3. Iniciar entorno: `pnpm run dev`
4. Ejecutar Pruebas Unitarias: `pnpm test`
