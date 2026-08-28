"use client";

import { useState } from "react";
import templatesData from "@/data/contract_templates.json";

export default function ContractWizard({ 
  formData, 
  setFormData, 
  onGenerate, 
  isGenerating,
  onSelectTemplate,
  activeTemplateId,
  isMobileHidden
}) {
  const [activeStepTab, setActiveStepTab] = useState(1);
  const [contractRole, setContractRole] = useState("Prestador de Servicios");
  const [addedClauses, setAddedClauses] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), ""]
    }));
  };

  const handleUpdateDeliverable = (index, value) => {
    const updated = [...(formData.deliverables || [])];
    updated[index] = value;
    setFormData(prev => ({ ...prev, deliverables: updated }));
  };

  const handleRemoveDeliverable = (index) => {
    const updated = (formData.deliverables || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, deliverables: updated }));
  };

  // Cláusulas de Protección de Alto Valor para Freelancers y Agencias
  const quickClausesList = [
    {
      id: "kill_fee",
      label: "+ Kill Fee (25%)",
      title: "Rescisión Anticipada",
      icon: "shield",
      text: "- Rescisión Anticipada (Kill Fee): En caso de cancelación imprevista por parte del Cliente, este abonará el 25% del valor total por concepto de gastos operativos y reserva de disponibilidad."
    },
    {
      id: "revision_limit",
      label: "+ Máx 2 Revisiones",
      title: "Límite de Revisiones",
      icon: "published_with_changes",
      text: "- Límite de Revisiones: Los entregables incluyen hasta 2 rondas de revisiones. Revisiones adicionales se facturarán por separado a tarifa horaria estándar."
    },
    {
      id: "non_solicitation",
      label: "+ No Solicitación (12M)",
      title: "No Solicitación de Personal",
      icon: "group_off",
      text: "- No Solicitación de Personal: Durante la vigencia de este contrato y por 12 meses posteriores, el Cliente no podrá contratar directa o indirectamente al personal o subcontratistas del Prestador."
    },
    {
      id: "late_fee_boost",
      label: "+ Mora 2% Mensual",
      title: "Intereses por Mora",
      icon: "account_balance_wallet",
      text: "- Penalización por Pago Tardío: Todo saldo vencido devengará un interés de mora del 2.0% mensual hasta su cancelación efectiva."
    }
  ];

  const handleInjectClause = (clause) => {
    const exists = addedClauses[clause.id];
    if (exists) return;

    setFormData(prev => ({
      ...prev,
      customClauses: prev.customClauses ? `${prev.customClauses}\n${clause.text}` : clause.text
    }));

    setAddedClauses(prev => ({ ...prev, [clause.id]: true }));
  };

  const getProgress = () => {
    switch(activeStepTab) {
      case 1: return { pct: "25%", step: 1 };
      case 2: return { pct: "50%", step: 2 };
      case 3: return { pct: "75%", step: 3 };
      case 4: return { pct: "100%", step: 4 };
      default: return { pct: "25%", step: 1 };
    }
  };

  const progress = getProgress();

  return (
    <div className={`wizard-left-panel ${isMobileHidden ? "mobile-hidden" : ""}`}>
      
      {/* Stepper Header (Fixed at top) */}
      <header style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "var(--color-on-surface)" }}>
            Acuerdo Marco de Servicios Legales
          </h1>
          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(192, 193, 255, 0.1)", border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>
            Contexto MCP Activo
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)" }}>
            <span>Paso {progress.step} de 4</span>
            <span>{progress.pct} Completado</span>
          </div>

          <div style={{ width: "100%", height: "5px", backgroundColor: "var(--bg-surface-container-highest)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: progress.pct, height: "100%", backgroundColor: "var(--color-primary)", borderRadius: "999px", transition: "width 0.3s ease" }}></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "12px" }}>
            {[
              { id: 1, label: "1. Partes y Ley" },
              { id: 2, label: "2. Alcance y Entregables" },
              { id: 3, label: "3. Pago y Plazos" },
              { id: 4, label: "4. Propiedad e IP" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStepTab(tab.id)}
                style={{
                  borderLeft: activeStepTab === tab.id ? "3px solid var(--color-primary)" : "3px solid var(--color-outline-variant)",
                  paddingLeft: "6px",
                  textAlign: "left",
                  background: "none",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  cursor: "pointer",
                  opacity: activeStepTab === tab.id ? 1 : 0.6,
                  overflow: "hidden"
                }}
              >
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", color: activeStepTab === tab.id ? "var(--color-on-surface)" : "var(--color-on-surface-variant)", display: "block", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Form Area (Scrollable body) */}
      <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* Plantillas Prehechas (MCP Context) */}
        <div style={{ marginBottom: "20px", padding: "14px", borderRadius: "8px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", width: "100%", boxSizing: "border-box" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-tertiary)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>auto_awesome</span>
              Plantillas Prehechas (MCP)
            </span>
            <span style={{ fontSize: "10px", color: "var(--color-on-surface-variant)" }}>
              {templatesData.templates.length} disponibles
            </span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <select
              value={activeTemplateId || ""}
              onChange={(e) => {
                const tpl = templatesData.templates.find(t => t.id === e.target.value);
                if (tpl) onSelectTemplate(tpl);
              }}
              className="form-select"
              style={{ fontSize: "12px", padding: "6px 10px" }}
            >
              <option value="" disabled>-- Seleccionar una plantilla --</option>
              {templatesData.templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} (${t.totalAmount} {t.currency})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", width: "100%", boxSizing: "border-box" }}>
            {templatesData.templates.map(tpl => {
              const isSelected = activeTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--color-outline-variant)",
                    backgroundColor: isSelected ? "rgba(192, 193, 255, 0.12)" : "var(--bg-surface-container-high)",
                    color: "var(--color-on-surface)",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    minWidth: "0",
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden"
                  }}
                >
                  <span style={{ fontWeight: "700", fontSize: "11px", color: isSelected ? "var(--color-primary)" : "var(--color-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tpl.title}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tpl.scope}
                  </span>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-secondary)", marginTop: "2px" }}>
                    ${tpl.totalAmount} {tpl.currency}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", boxSizing: "border-box" }}>
          
          {/* Paso 1 */}
          {activeStepTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  ROL DE CONTRATACIÓN
                </label>
                <div style={{ display: "flex", gap: "4px", padding: "4px", backgroundColor: "var(--bg-surface-container-highest)", borderRadius: "6px", width: "fit-content" }}>
                  <button
                    type="button"
                    onClick={() => setContractRole("Prestador de Servicios")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: contractRole === "Prestador de Servicios" ? "var(--bg-surface-bright)" : "transparent",
                      color: contractRole === "Prestador de Servicios" ? "var(--color-on-surface)" : "var(--color-on-surface-variant)"
                    }}
                  >
                    Prestador de Servicios
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractRole("Cliente")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: contractRole === "Cliente" ? "var(--bg-surface-bright)" : "transparent",
                      color: contractRole === "Cliente" ? "var(--color-on-surface)" : "var(--color-on-surface-variant)"
                    }}
                  >
                    Cliente
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    JURISDICCIÓN Y LEY APLICABLE
                  </label>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(78, 222, 163, 0.1)", color: "var(--color-secondary)" }}>
                    Aviso Legal Vigente
                  </span>
                </div>
                <select 
                  className="form-select"
                  value={formData.jurisdiction || "Delaware (Recomendado)"}
                  onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                >
                  {templatesData.jurisdictions.map(j => (
                    <option key={j.id} value={j.name}>{j.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    NOMBRE DEL PRESTADOR DE SERVICIOS
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="DevStudio Freelance C.A."
                    value={formData.providerName || ""}
                    onChange={(e) => handleInputChange("providerName", e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    RIF / DNI DEL PRESTADOR
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="J-40912345-0"
                    value={formData.providerTaxId || ""}
                    onChange={(e) => handleInputChange("providerTaxId", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    NOMBRE LEGAL DEL CLIENTE
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Acme Corp LLC"
                    value={formData.clientName || ""}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    RIF / DNI / EIN DEL CLIENTE
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="XX-XXXXXXX"
                    value={formData.clientTaxId || ""}
                    onChange={(e) => handleInputChange("clientTaxId", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(2)}>
                  Siguiente: Alcance y Entregables
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Paso 2 */}
          {activeStepTab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  TÍTULO DEL PROYECTO
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Desarrollo Web Full-Stack Next.js"
                  value={formData.projectTitle || ""}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  ALCANCE DE LOS SERVICIOS
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Describa en detalle los servicios a prestar..."
                  value={formData.scope || ""}
                  onChange={(e) => handleInputChange("scope", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    ENTREGABLES DEL PROYECTO
                  </label>
                  <button type="button" className="btn-secondary" onClick={handleAddDeliverable} style={{ fontSize: "10px", padding: "3px 8px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>add</span> Agregar Item
                  </button>
                </div>

                {(formData.deliverables || []).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder={`Entregable #${idx + 1}`}
                      value={item}
                      onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                    />
                    <button type="button" className="btn-secondary" onClick={() => handleRemoveDeliverable(idx)} style={{ color: "#f87171", padding: "6px 10px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(1)}>
                  Anterior
                </button>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(3)}>
                  Siguiente: Pago y Plazos
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Paso 3 */}
          {activeStepTab === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    MONTO TOTAL
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1500"
                    value={formData.totalAmount || ""}
                    onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    MONEDA
                  </label>
                  <select
                    className="form-select"
                    value={formData.currency || "USD"}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="MXN">MXN ($)</option>
                    <option value="VES">VES (Bs.)</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    PLAZO (DÍAS)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="21"
                    value={formData.timelineDays || ""}
                    onChange={(e) => handleInputChange("timelineDays", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    ESTRUCTURA DE PAGO
                  </label>
                  <select
                    className="form-select"
                    value={formData.paymentStructure || "50_50"}
                    onChange={(e) => handleInputChange("paymentStructure", e.target.value)}
                  >
                    {templatesData.paymentStructures.map(ps => (
                      <option key={ps.id} value={ps.id}>{ps.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    INTERÉS POR MORA (% / MES)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    placeholder="1.5"
                    value={formData.lateFeePercentage || 1.5}
                    onChange={(e) => handleInputChange("lateFeePercentage", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(2)}>
                  Anterior
                </button>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(4)}>
                  Siguiente: Propiedad e IP
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Paso 4 */}
          {activeStepTab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "6px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.includeIPClause ?? true}
                    onChange={(e) => handleInputChange("includeIPClause", e.target.checked)}
                  />
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-on-surface)", display: "block" }}>Transferencia de PI tras pago del 100%</span>
                    <span style={{ fontSize: "10px", color: "var(--color-on-surface-variant)" }}>Retiene propiedad intelectual hasta cobro final</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "6px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.includeNDA ?? true}
                    onChange={(e) => handleInputChange("includeNDA", e.target.checked)}
                  />
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-on-surface)", display: "block" }}>Confidencialidad (NDA)</span>
                    <span style={{ fontSize: "10px", color: "var(--color-on-surface-variant)" }}>Protege información confidencial de las partes</span>
                  </div>
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  CLÁUSULAS PERSONALIZADAS
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Ingrese estipulaciones o acuerdos especiales..."
                  value={formData.customClauses || ""}
                  onChange={(e) => handleInputChange("customClauses", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "4px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(3)}>
                  Anterior
                </button>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Fixed Bottom Dock for Smart Clause Assistant */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", fontWeight: "700" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "var(--color-primary)" }}>auto_awesome</span>
              Asistente de Protección Legal
            </span>
            <span style={{ fontSize: "9px", color: "var(--color-on-surface-variant)" }}>
              Inyecta cláusulas de protección en 1-clic
            </span>
          </div>

          {/* Protective Clauses Chips */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {quickClausesList.map((clause) => {
              const isAdded = addedClauses[clause.id];
              return (
                <button
                  key={clause.id}
                  type="button"
                  onClick={() => handleInjectClause(clause)}
                  className="btn-secondary"
                  style={{
                    fontSize: "11px",
                    padding: "6px 8px",
                    justifyContent: "flex-start",
                    borderColor: isAdded ? "var(--color-secondary)" : "var(--color-outline-variant)",
                    backgroundColor: isAdded ? "rgba(78, 222, 163, 0.1)" : "var(--bg-surface-bright)",
                    color: isAdded ? "var(--color-secondary)" : "var(--color-on-surface)"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", color: isAdded ? "var(--color-secondary)" : "var(--color-primary)" }}>
                    {isAdded ? "check_circle" : clause.icon}
                  </span>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {isAdded ? `✓ ${clause.title}` : clause.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Primary Legal Audit & Generation Button */}
          <button 
            id="btn-audit-clauses"
            type="button" 
            onClick={onGenerate} 
            disabled={isGenerating} 
            className="btn-primary" 
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              padding: "11px", 
              fontSize: "12px",
              fontWeight: "700"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {isGenerating ? "sync" : "psychology"}
            </span>
            {isGenerating ? "Auditando con legal-clause-agent..." : "Auditar y Generar Contrato con IA"}
          </button>
        </div>
      </div>

    </div>
  );
}
