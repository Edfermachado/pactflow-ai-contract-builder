# Agente Especializado: legal-clause-agent

## Propósito
El `legal-clause-agent` es el módulo de auditoría legal inteligente del sistema. Su objetivo principal es analizar la consistencia lógica y legal entre:
1. El alcance del proyecto y los entregables declarados por el freelancer/agencia.
2. Las condiciones de pago (hitos, anticipos, pagos finales, mora).
3. Las cláusulas de propiedad intelectual (transferencia tras pago total vs al inicio).
4. La jurisdicción aplicable y los mecanismos de resolución de disputas.

## Flujo de Trabajo
1. **Auditoría de Incoherencias:**
   - Detecta si los entregables requieren pagos por hitos pero solo se definió pago 100% final.
   - Verifica si la cláusula de Propiedad Intelectual entrega derechos de autor antes de que el cliente realice el pago completo (alerta de alto riesgo).
   - Valida que los plazos de revisión del cliente no sean mayores al tiempo total del proyecto.
   - Detecta variables nulas o ambiguas (ej. "a convenir") y propone valores por defecto formales.

2. **Generación de Alertas y Sugerencias:**
   - Devuelve una lista de `warnings` (advertencias de seguridad jurídica) y `recommendations` (sugerencias para mejorar la relación comercial).

3. **Inyección de Prompts para Gemini:**
   - Reformula el contexto del usuario estructurando cláusulas legales hiper-específicas y vinculantes para la API de Gemini.

## Ejemplo de Respuesta de Auditoría (JSON)
```json
{
  "score": 95,
  "status": "Audited",
  "alerts": [
    {
      "type": "warning",
      "field": "ip_transfer",
      "message": "Se recomienda especificar que los derechos de propiedad intelectual solo se transfieren tras la recepción del pago 100% efectivo."
    }
  ],
  "clauseEnrichments": [
    "Incluir cláusula de retención de código/artefactos hasta la liquidación final.",
    "Añadir interés por mora del 1.5% mensual en facturas vencidas."
  ]
}
```
