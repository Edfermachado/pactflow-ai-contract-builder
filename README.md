# ⚖️ PactFlow AI — Generador & Auditor de Contratos Legales (MVP v1.0)

> **Desarrollado por: Edwin Machado**  
> **Proyecto Final — Curso de Desarrollo con Inteligencia Artificial**  
> **Orquestado con Antigravity**, impulsado por **Gemini 3.6 Flash** y diseñado a partir del concepto de **Stitch**.

---

## 🌟 Descripción del Proyecto

**PactFlow AI** es una plataforma SaaS/MVP web desarrollada por **Edwin Machado** para freelancers, consultores y agencias independientes. Permite estructurar, auditar legalmente y redactar contratos de servicios profesionales en segundos, eliminando los elevados costos de herramientas recurrentes o asesoría jurídica tradicional.

La plataforma cuenta con un diseño **Split-Pane (52% / 48%)** donde el usuario interactúa con un formulario guiado e inyectores de protección legal en el panel izquierdo, observando simultáneamente la previsualización del documento formateado y auditado en una hoja de papel vectorial lista para imprimir o exportar a PDF en el panel derecho.

---

## 👤 Autor & Desarrollador

- **Desarrollador Principal**: **Edwin Machado**
- **Asistente Agéntico de Desarrollo**: [Antigravity](https://deepmind.google/) (Google DeepMind)
- **Modelo de IA Generativa**: **Gemini 3.6 Flash** (`@google/generative-ai`) para redacción legal y análisis de riesgos.
- **Concepto de Diseño Visual**: **Stitch** & Vanilla CSS Moderno (Glassmorphic Dark Mode, Tipografías Hanken Grotesk & Source Serif 4).

---

## 🚀 Tecnologías & Herramientas

- **Framework Web**: Next.js 16.3 (App Router) + React 19.
- **Gestión de Paquetes**: `pnpm`.
- **Exportación a PDF**: Impresión vectorial nativa del navegador (`window.print`) y motor cliente alternativo con `jsPDF`.

---

## 📋 Cumplimiento de Normativas Estrictas del Proyecto

Este proyecto satisface al 100% las 6 directrices estricta del curso:

### 1. 🤖 Cero Código Manual (Regla Fundamental)
Todo el código fuente (HTML, CSS, JSX, APIs, utilidades y scripts) fue **generado de forma 100% autónoma por Edwin Machado** mediante estrategias de prompting y orquestación con **Antigravity**. Ninguna línea de lógica fue escrita manualmente.

### 2. 📊 Integración de Contexto de Datos (MCP)
El sistema carga dinámicamente el archivo estructurado [`src/data/contract_templates.json`](./src/data/contract_templates.json), que contiene el catálogo de 6 plantillas prehechas (Desarrollo Web, Identidad de Marca, Marketing Digital, App Móvil, Consultoría y Motion Graphics). Este contexto MCP alimenta las selecciones del usuario y precarga los formularios de manera reactiva.

### 3. ⚡ Uso de Skills / Comandos Personalizados
Se configuró y ejecutó el comando/skill personalizado [`/gen-contract-pdf`](./.gemini/skills/gen-contract-pdf.md), el cual orquesta la compilación de cláusulas seleccionadas, aplica estilos de documento formal y activa la emisión del archivo PDF exportable.

### 4. 🕵️ Agente Especializado (`legal-clause-agent`)
Se diseñó e integró el agente autónomo [`src/agents/legalClauseAgent.js`](./src/agents/legalClauseAgent.js). Este agente realiza una auditoría en tiempo real sobre los datos ingresados:
- Evalúa riesgos de *Scope Creep* (alcance ambiguo).
- Verifica coherencia entre tiempos de entrega y rondas de revisión.
- Audita esquemas de pago para prevenir mora o cancelaciones.
- Asigna un **Risk Score (0-100)** y genera advertencias legales antes de solicitar la redacción final a Gemini 3.6 Flash.

### 5. 🛠️ Refactorización y Depuración Autónoma
Toda la resolución de errores visuales, desbordamientos de interfaz, integración de fuentes Google Material Symbols y pruebas de compilación en producción (`pnpm build`) fueron delegadas y ejecutadas autónomamente desde la terminal agéntica de Antigravity.

### 6. 🌐 Despliegue a Producción (Vercel Ready)
La aplicación está optimizada para su despliegue directo en **Vercel**. Incluye soporte completo para variables de entorno (`GEMINI_API_KEY`) y reglas `@media print` para "Guardar como PDF" con calidad vectorial directamente desde el navegador.

---

## 📸 Características Clave

- 📐 **Diseño Split-Pane (52% Formulario / 48% Previsualizador)**.
- 🔄 **Reseteo Total ("Nuevo Contrato")**: Lienzo limpio en 1 clic que redirige al módulo 1.
- 🛡️ **Smart Clause Assistant**: Inyección en 1 clic de cláusulas de alta protección (*Kill Fee 25%*, *Límite de Revisiones*, *No Solicitación 12M*, *Interés por Mora 2%*).
- 🖨️ **Impresión Nativa / Exportación a PDF**: Firmas estructuradas en 2 columnas y cero marcas de agua publicitarias.
- 🌐 **100% en Español**: Interfaz, plantillas y prompts jurídicos redactados en español formal.

---

## 🛠️ Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Edfermachado/pactflow-ai-contract-builder.git
cd proyecto_final

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Configurar variables de entorno (.env)
GEMINI_API_KEY="Tu_Gemini_API_Key"

# 4. Iniciar servidor de desarrollo
pnpm dev

# 5. Compilar para producción
pnpm build
```

---

## 📄 Licencia & Créditos

Proyecto desarrollado por **Edwin Machado** como entrega final académica para el Curso de Desarrollo con Inteligencia Artificial. Todos los derechos reservados.
