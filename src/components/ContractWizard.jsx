"use client";

import { useState } from "react";
import { 
  UserCheck, 
  FileText, 
  DollarSign, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Briefcase,
  Scale
} from "lucide-react";
import templatesData from "@/data/contract_templates.json";

export default function ContractWizard({ formData, setFormData, onGenerate, isGenerating }) {
  const [activeTab, setActiveTab] = useState("parties"); // parties | scope | payment | legal

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

  return (
    <div className="glass-card animate-fade-in" style={{ padding: "24px" }}>
      {/* Selector de Pestañas del Formulario */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        borderBottom: "1px solid var(--border-color)", 
        paddingBottom: "16px",
        marginBottom: "24px",
        overflowX: "auto" 
      }}>
        <button
          id="tab-btn-parties"
          onClick={() => setActiveTab("parties")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: activeTab === "parties" ? "var(--accent-indigo)" : "transparent",
            color: activeTab === "parties" ? "#ffffff" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <UserCheck size={16} /> 1. Partes Contratantes
        </button>

        <button
          id="tab-btn-scope"
          onClick={() => setActiveTab("scope")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: activeTab === "scope" ? "var(--accent-indigo)" : "transparent",
            color: activeTab === "scope" ? "#ffffff" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Briefcase size={16} /> 2. Alcance & Entregables
        </button>

        <button
          id="tab-btn-payment"
          onClick={() => setActiveTab("payment")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: activeTab === "payment" ? "var(--accent-indigo)" : "transparent",
            color: activeTab === "payment" ? "#ffffff" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <DollarSign size={16} /> 3. Pagos & Hitos
        </button>

        <button
          id="tab-btn-legal"
          onClick={() => setActiveTab("legal")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: activeTab === "legal" ? "var(--accent-indigo)" : "transparent",
            color: activeTab === "legal" ? "#ffffff" : "var(--text-secondary)",
            fontWeight: "600",
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Scale size={16} /> 4. Cláusulas Legales
        </button>
      </div>

      {/* Pestaña 1: Partes Contratantes */}
      {activeTab === "parties" && (
        <div className="animate-fade-in">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--accent-indigo)" }}>
            Datos de Identificación del Prestador y Cliente
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="providerName">Nombre / Empresa Prestador *</label>
              <input
                id="providerName"
                type="text"
                className="form-input"
                placeholder="Ej. DevStudio Freelance C.A."
                value={formData.providerName || ""}
                onChange={(e) => handleInputChange("providerName", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="providerTaxId">RIF / NIF / DNI Prestador</label>
              <input
                id="providerTaxId"
                type="text"
                className="form-input"
                placeholder="Ej. J-40912345-0"
                value={formData.providerTaxId || ""}
                onChange={(e) => handleInputChange("providerTaxId", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="clientName">Nombre / Empresa Cliente *</label>
              <input
                id="clientName"
                type="text"
                className="form-input"
                placeholder="Ej. AcroTech Global LLC"
                value={formData.clientName || ""}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="clientTaxId">RIF / Tax ID Cliente</label>
              <input
                id="clientTaxId"
                type="text"
                className="form-input"
                placeholder="Ej. Tax-ID US-987654"
                value={formData.clientTaxId || ""}
                onChange={(e) => handleInputChange("clientTaxId", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button 
              id="next-to-scope"
              onClick={() => setActiveTab("scope")} 
              className="btn-primary"
            >
              Siguiente: Alcance del Proyecto <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pestaña 2: Alcance & Entregables */}
      {activeTab === "scope" && (
        <div className="animate-fade-in">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--accent-indigo)" }}>
            Definición de Proyecto y Entregables Verificables
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="projectTitle">Título del Proyecto *</label>
            <input
              id="projectTitle"
              type="text"
              className="form-input"
              placeholder="Ej. Desarrollo Web E-Commerce Next.js"
              value={formData.projectTitle || ""}
              onChange={(e) => handleInputChange("projectTitle", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="scope">Alcance Detallado del Servicio *</label>
            <textarea
              id="scope"
              className="form-textarea"
              placeholder="Describe detalladamente los servicios a realizar, funcionalidades a desarrollar o especificaciones técnicas..."
              value={formData.scope || ""}
              onChange={(e) => handleInputChange("scope", e.target.value)}
            />
          </div>

          {/* Entregables */}
          <div className="form-group">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <label className="form-label">Entregables Específicos</label>
              <button 
                id="add-deliverable-btn"
                type="button" 
                onClick={handleAddDeliverable} 
                className="btn-secondary"
                style={{ padding: "4px 10px", fontSize: "0.78rem" }}
              >
                <Plus size={14} /> Añadir Entregable
              </button>
            </div>

            {(formData.deliverables || []).map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  id={`deliverable-input-${idx}`}
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder={`Entregables N° ${idx + 1}`}
                  value={item}
                  onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                />
                <button
                  id={`remove-deliverable-btn-${idx}`}
                  type="button"
                  onClick={() => handleRemoveDeliverable(idx)}
                  className="btn-secondary"
                  style={{ color: "var(--accent-rose)", borderColor: "rgba(244, 63, 94, 0.3)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button onClick={() => setActiveTab("parties")} className="btn-secondary">
              Atrás
            </button>
            <button onClick={() => setActiveTab("payment")} className="btn-primary">
              Siguiente: Pagos & Hitos <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pestaña 3: Pagos & Hitos */}
      {activeTab === "payment" && (
        <div className="animate-fade-in">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--accent-indigo)" }}>
            Condiciones Financieras y Cronograma
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="totalAmount">Monto Total *</label>
              <input
                id="totalAmount"
                type="number"
                className="form-input"
                placeholder="1500"
                value={formData.totalAmount || ""}
                onChange={(e) => handleInputChange("totalAmount", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency">Moneda</label>
              <select
                id="currency"
                className="form-select"
                value={formData.currency || "USD"}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="MXN">MXN ($)</option>
                <option value="COP">COP ($)</option>
                <option value="VES">VES (Bs.)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timelineDays">Plazo (Días)</label>
              <input
                id="timelineDays"
                type="number"
                className="form-input"
                placeholder="15"
                value={formData.timelineDays || ""}
                onChange={(e) => handleInputChange("timelineDays", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="paymentStructure">Estructura de Pagos</label>
              <select
                id="paymentStructure"
                className="form-select"
                value={formData.paymentStructure || "50_50"}
                onChange={(e) => handleInputChange("paymentStructure", e.target.value)}
              >
                {templatesData.paymentStructures.map(ps => (
                  <option key={ps.id} value={ps.id}>{ps.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lateFeePercentage">Interés por Mora Mensual (%)</label>
              <input
                id="lateFeePercentage"
                type="number"
                step="0.5"
                className="form-input"
                placeholder="1.5"
                value={formData.lateFeePercentage || 1.5}
                onChange={(e) => handleInputChange("lateFeePercentage", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button onClick={() => setActiveTab("scope")} className="btn-secondary">
              Atrás
            </button>
            <button onClick={() => setActiveTab("legal")} className="btn-primary">
              Siguiente: Cláusulas Legales <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pestaña 4: Cláusulas Legales & Disparar Agente */}
      {activeTab === "legal" && (
        <div className="animate-fade-in">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--accent-indigo)" }}>
            Jurisdicción y Cláusulas Condicionales
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="jurisdiction">Jurisdicción / Ley Aplicable</label>
            <select
              id="jurisdiction"
              className="form-select"
              value={formData.jurisdiction || "general"}
              onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
            >
              {templatesData.jurisdictions.map(j => (
                <option key={j.id} value={j.name}>{j.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <label className="glass-card" style={{ padding: "14px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input
                id="toggle-ip-clause"
                type="checkbox"
                checked={formData.includeIPClause ?? true}
                onChange={(e) => handleInputChange("includeIPClause", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Transferencia de PI tras pago 100%</span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Protege los derechos de autor hasta cobrar totalmente.</p>
              </div>
            </label>

            <label className="glass-card" style={{ padding: "14px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input
                id="toggle-nda-clause"
                type="checkbox"
                checked={formData.includeNDA ?? true}
                onChange={(e) => handleInputChange("includeNDA", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Cláusula de Confidencialidad (NDA)</span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Protege la información comercial intercambiada.</p>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customClauses">Cláusulas Especiales o Notas Adicionales</label>
            <textarea
              id="customClauses"
              className="form-textarea"
              placeholder="Ej. El cliente se compromete a proveer los textos e imágenes en un plazo máximo de 3 días..."
              value={formData.customClauses || ""}
              onChange={(e) => handleInputChange("customClauses", e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
            <button onClick={() => setActiveTab("payment")} className="btn-secondary">
              Atrás
            </button>

            <button
              id="btn-generate-contract"
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-emerald"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="animate-spin" size={20} />
                  Auditando & Redactando con IA...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Auditar con Agent & Generar Contrato
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
