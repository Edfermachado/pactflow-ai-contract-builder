"use client";

import { useState } from "react";
import templatesData from "@/data/contract_templates.json";

export default function ContractWizard({ 
  formData, 
  setFormData, 
  onGenerate, 
  isGenerating,
  onSelectTemplate,
  activeTemplateId
}) {
  const [activeStepTab, setActiveStepTab] = useState(1);
  const [contractRole, setContractRole] = useState("Service Provider");

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

  const handleAddQuickClause = (clauseType) => {
    if (clauseType === "NDA") {
      setFormData(prev => ({ ...prev, includeNDA: true }));
    } else if (clauseType === "IP") {
      setFormData(prev => ({ ...prev, includeIPClause: true }));
    } else if (clauseType === "KillFee") {
      setFormData(prev => ({ 
        ...prev, 
        customClauses: (prev.customClauses || "") + "\n- Cláusula de Rescisión (Kill Fee): 25% del monto total en caso de cancelación imprevista." 
      }));
    } else if (clauseType === "Revisions") {
      setFormData(prev => ({ ...prev, revisionRounds: 3 }));
    }
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
    <div className="wizard-left-panel" style={{ width: "100%", overflowX: "hidden" }}>
      
      {/* Stepper Header */}
      <header style={{ padding: "24px 28px", borderBottom: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "var(--color-on-surface)" }}>
            Master Services Agreement
          </h1>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", padding: "4px 8px", borderRadius: "4px", backgroundColor: "rgba(192, 193, 255, 0.1)", border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>
            MCP Context Active
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)" }}>
            <span>Step {progress.step} of 4</span>
            <span>{progress.pct} Complete</span>
          </div>

          <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-surface-container-highest)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: progress.pct, height: "100%", backgroundColor: "var(--color-primary)", borderRadius: "999px", transition: "width 0.3s ease" }}></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "14px" }}>
            {[
              { id: 1, label: "1. Parties & Jurisdiction" },
              { id: 2, label: "2. Scope & Deliverables" },
              { id: 3, label: "3. Payment & Milestones" },
              { id: 4, label: "4. IP & Termination" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStepTab(tab.id)}
                style={{
                  borderLeft: activeStepTab === tab.id ? "3px solid var(--color-primary)" : "3px solid var(--color-outline-variant)",
                  paddingLeft: "8px",
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
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "700", color: activeStepTab === tab.id ? "var(--color-on-surface)" : "var(--color-on-surface-variant)", display: "block", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Form Area */}
      <div style={{ padding: "28px", flex: 1, overflowY: "auto", width: "100%", boxSizing: "border-box" }}>
        
        {/* Fixed & Non-Overflowing Quick Templates Selector (MCP Context) */}
        <div style={{ marginBottom: "24px", padding: "16px", borderRadius: "8px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", width: "100%", boxSizing: "border-box" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-tertiary)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_awesome</span>
              Plantillas Prehechas (MCP)
            </span>
            <span style={{ fontSize: "11px", color: "var(--color-on-surface-variant)" }}>
              {templatesData.templates.length} disponibles
            </span>
          </div>

          {/* Selector desplegable alternativo */}
          <div style={{ marginBottom: "12px" }}>
            <select
              value={activeTemplateId || ""}
              onChange={(e) => {
                const tpl = templatesData.templates.find(t => t.id === e.target.value);
                if (tpl) onSelectTemplate(tpl);
              }}
              className="form-select"
              style={{ fontSize: "12px", padding: "8px 12px" }}
            >
              <option value="" disabled>-- Seleccionar una plantilla --</option>
              {templatesData.templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} (${t.totalAmount} {t.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Grid de Tarjetas Ajustadas sin Desbordamiento */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", width: "100%", boxSizing: "border-box" }}>
            {templatesData.templates.map(tpl => {
              const isSelected = activeTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  style={{
                    padding: "10px 12px",
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
                  <span style={{ fontWeight: "700", fontSize: "12px", color: isSelected ? "var(--color-primary)" : "var(--color-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tpl.title}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tpl.scope}
                  </span>
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-secondary)", marginTop: "2px" }}>
                    ${tpl.totalAmount} {tpl.currency}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", boxSizing: "border-box" }}>
          
          {/* Step 1 */}
          {activeStepTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  CONTRACTING ROLE
                </label>
                <div style={{ display: "flex", gap: "4px", padding: "4px", backgroundColor: "var(--bg-surface-container-highest)", borderRadius: "6px", width: "fit-content" }}>
                  <button
                    type="button"
                    onClick={() => setContractRole("Service Provider")}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: contractRole === "Service Provider" ? "var(--bg-surface-bright)" : "transparent",
                      color: contractRole === "Service Provider" ? "var(--color-on-surface)" : "var(--color-on-surface-variant)"
                    }}
                  >
                    Service Provider
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractRole("Client")}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: contractRole === "Client" ? "var(--bg-surface-bright)" : "transparent",
                      color: contractRole === "Client" ? "var(--color-on-surface)" : "var(--color-on-surface-variant)"
                    }}
                  >
                    Client
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    GOVERNING LAW JURISDICTION
                  </label>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(78, 222, 163, 0.1)", color: "var(--color-secondary)" }}>
                    Legal Disclaimer Applies
                  </span>
                </div>
                <select 
                  className="form-select"
                  value={formData.jurisdiction || "Delaware (Recommended)"}
                  onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                >
                  {templatesData.jurisdictions.map(j => (
                    <option key={j.id} value={j.name}>{j.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    SERVICE PROVIDER NAME
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="DevStudio Freelance LLC"
                    value={formData.providerName || ""}
                    onChange={(e) => handleInputChange("providerName", e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    PROVIDER TAX ID
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    CLIENT LEGAL NAME
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
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    TAX ID (EIN/VAT)
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

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(2)}>
                  Next: Scope & Deliverables
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {activeStepTab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  PROJECT TITLE
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full-Stack Web Development"
                  value={formData.projectTitle || ""}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  SCOPE OF SERVICES
                </label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Describa los entregables y alcance..."
                  value={formData.scope || ""}
                  onChange={(e) => handleInputChange("scope", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    DELIVERABLES
                  </label>
                  <button type="button" className="btn-secondary" onClick={handleAddDeliverable} style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span> Add Item
                  </button>
                </div>

                {(formData.deliverables || []).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder={`Deliverable #${idx + 1}`}
                      value={item}
                      onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                    />
                    <button type="button" className="btn-secondary" onClick={() => handleRemoveDeliverable(idx)} style={{ color: "#f87171" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(1)}>
                  Back
                </button>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(3)}>
                  Next: Payment & Milestones
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {activeStepTab === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    TOTAL AMOUNT
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
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    CURRENCY
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
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    TIMELINE (DAYS)
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    PAYMENT STRUCTURE
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
                  <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                    LATE FEE (% / MONTH)
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

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(2)}>
                  Back
                </button>
                <button type="button" className="btn-primary" onClick={() => setActiveStepTab(4)}>
                  Next: IP & Termination
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {activeStepTab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "6px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.includeIPClause ?? true}
                    onChange={(e) => handleInputChange("includeIPClause", e.target.checked)}
                  />
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-on-surface)", display: "block" }}>IP Transfer on 100% Payment</span>
                    <span style={{ fontSize: "11px", color: "var(--color-on-surface-variant)" }}>Retiene propiedad intelectual hasta cobro final</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "6px", border: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.includeNDA ?? true}
                    onChange={(e) => handleInputChange("includeNDA", e.target.checked)}
                  />
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-on-surface)", display: "block" }}>Confidencialidad (NDA)</span>
                    <span style={{ fontSize: "11px", color: "var(--color-on-surface-variant)" }}>Protege información confidencial del cliente</span>
                  </div>
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                  CUSTOM CLAUSES
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Ingrese estipulaciones o acuerdos especiales..."
                  value={formData.customClauses || ""}
                  onChange={(e) => handleInputChange("customClauses", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "8px" }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveStepTab(3)}>
                  Back
                </button>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Bottom AI Assistant Dock */}
      <div style={{ padding: "18px 28px", borderTop: "1px solid var(--color-outline-variant)", backgroundColor: "var(--bg-surface-container)", marginTop: "auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-primary)" }}>auto_awesome</span>
            Smart Clause Assistant
          </span>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" className="btn-secondary" onClick={() => handleAddQuickClause("NDA")} style={{ fontSize: "11px", padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span> + NDA
            </button>
            <button type="button" className="btn-secondary" onClick={() => handleAddQuickClause("IP")} style={{ fontSize: "11px", padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span> + IP Assignment
            </button>
            <button type="button" className="btn-secondary" onClick={() => handleAddQuickClause("KillFee")} style={{ fontSize: "11px", padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span> + Kill Fee
            </button>
            <button type="button" className="btn-secondary" onClick={() => handleAddQuickClause("Revisions")} style={{ fontSize: "11px", padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span> + Revision Limits
            </button>
          </div>

          <button 
            id="btn-audit-clauses"
            type="button" 
            onClick={onGenerate} 
            disabled={isGenerating} 
            className="btn-secondary" 
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              padding: "12px", 
              color: "var(--color-primary)", 
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--bg-surface-bright)"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              {isGenerating ? "sync" : "psychology"}
            </span>
            {isGenerating ? "Auditando con legal-clause-agent..." : "Audit Clauses with Legal Agent"}
          </button>
        </div>
      </div>

    </div>
  );
}
