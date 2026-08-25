"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice, itemSchema, invoiceSchema } from "@/lib/types";
import { cn } from "./ui";
import { Save, Edit, X, Loader2, CheckCircle2, Trash, ArrowUpDown } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Invoice> | null;
  onSave: (data: Invoice) => void;
  currency: "USD" | "Bs";
  isLoading?: boolean;
}

const formSchema = invoiceSchema.extend({
  items: itemSchema.array().optional(),
});

export function InvoiceModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  currency,
  isLoading,
}: InvoiceModalProps) {
  const [formData, setFormData] = React.useState<Invoice>({
    id: initialData?.id || "",
    emisor: initialData?.emisor || "",
    rif: initialData?.rif || "",
    fecha_emision: initialData?.fecha_emision ?? null,
    fecha_pago: initialData?.fecha_pago ?? null,
    concepto: initialData?.concepto || "",
    subtotal: initialData?.subtotal ?? 0,
    iva: initialData?.iva ?? null,
    total: initialData?.total ?? 0,
    categoria: initialData?.categoria ?? "otros",
    estado_pago: initialData?.estado_pago ?? "pendiente",
    moneda: initialData?.moneda ?? currency,
    metodo_pago: initialData?.metodo_pago,
    items: initialData?.items ?? [],
    archivo_url: initialData?.archivo_url,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<Invoice>({
    defaultValues: formData,
    mode: "onBlur",
    resolver: zodResolver(formSchema) as any,
  });

  const onSubmit = (data: Invoice) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const togglePaymentStatus = (status: Invoice["estado_pago"]) => {
    setFormData((prev) => ({
      ...prev,
      estado_pago: status,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 hidden items-center justify-center overflow-x-hidden overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div
            className="relative max-w-md w-full bg-card rounded-lg p-6 shadow-lg transition-all duration-300"
            style={{ transform: "scale(0.9)" }}
            id="modal-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold">
                {initialData ? "Editar Factura" : "Nueva Factura"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted/20"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit as any)} className="mt-6 space-y-4">
              {/* Campo emisor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Emisor
                  </label>
                  <input
                    {...register("emisor", { required: "El emisor es requerido" })}
                    name="emisor"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: Hotel Caribe Resort"
                    defaultValue={formData.emisor}
                    onChange={handleChange}
                  />
                  {errors.emisor && (
                    <p className="text-xs text-destructive mt-1">{errors.emisor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    RIF
                  </label>
                  <input
                    {...register("rif", { required: "El RIF es requerido" })}
                    name="rif"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: J-12345678-9"
                    defaultValue={formData.rif}
                    onChange={handleChange}
                  />
                  {errors.rif && (
                    <p className="text-xs text-destructive mt-1">{errors.rif.message}</p>
                  )}
                </div>
              </div>

              {/* Fecha emisión */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  {...register("fecha_emision", { valueAsDate: true })} // type="date" no requiere validación Zod compleja aquí
                  name="fecha_emision"
                  className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  defaultValue={formData.fecha_emision || ""}
                  onChange={handleChange}
                />
                {formData.fecha_emision && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: YYYY-MM-DD
                  </p>
                )}
              </div>

              {/* Concepto */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Concepto
                </label>
                <textarea
                  {...register("concepto", { valueAsNumber: false })}
                  name="concepto"
                  rows={2}
                  className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                  placeholder="Descripción breve del servicio/producto"
                  defaultValue={formData.concepto}
                  onChange={handleChange}
                />
              </div>

              {/* Subtotal, IVA, Total */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Subtotal
                  </label>
                  <input
                    type="number"
                    {...register("subtotal", { required: true, min: 0 })}
                    name="subtotal"
                    className="w-full rounded-lg border border-input px-3 py-2 numbox focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    defaultValue={formData.subtotal.toString()}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    IVA
                  </label>
                  <input
                    type="number"
                    {...register("iva", {})}
                    name="iva"
                    className="w-full rounded-lg border border-input px-3 py-2 numbox focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    defaultValue={formData.iva !== null ? formData.iva.toString() : ""}
                    onChange={handleChange}
                  />
                  {formData.iva !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Dejar vacío si no aplica
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Total
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      {...register("total", { required: true, min: 0 })}
                      name="total"
                      className="flex-1 rounded-lg border border-input px-3 py-2 numbox focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      defaultValue={formData.total.toString()}
                      onChange={handleChange}
                      min="0"
                      disabled
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      (auto)
                    </span>
                  </div>
                </div>
              </div>

              {/* Categoría y Estado Pago */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Categoría
                  </label>
                  <select
                    {...register("categoria", { required: "La categoría es requerida" })}
                    name="categoria"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="hospedaje" selected={formData.categoria === "hospedaje"}>
                      Hospedaje
                    </option>
                    <option value="transporte" selected={formData.categoria === "transporte"}>
                      Transporte
                    </option>
                    <option value="servicios" selected={formData.categoria === "servicios"}>
                      Servicios
                    </option>
                    <option value="equipos" selected={formData.categoria === "equipos"}>
                      Equipos
                    </option>
                    <option value="otros" selected={formData.categoria === "otros"}>
                      Otros
                    </option>
                  </select>
                  {errors.categoria && (
                    <p className="text-xs text-destructive mt-1">{errors.categoria.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Estado Pago
                  </label>
                  <select
                    {...register("estado_pago", { required: "El estado es requerido" })}
                    name="estado_pago"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="pagada" selected={formData.estado_pago === "pagada"}>
                      Pagada
                    </option>
                    <option value="pendiente" selected={formData.estado_pago === "pendiente"}>
                      Pendiente
                    </option>
                    <option value="vencida" selected={formData.estado_pago === "vencida"}>
                      Vencida
                    </option>
                    <option value="parcial" selected={formData.estado_pago === "parcial"}>
                      Parcial
                    </option>
                  </select>
                  {errors.estado_pago && (
                    <p className="text-xs text-destructive mt-1">{errors.estado_pago.message}</p>
                  )}
                </div>
              </div>

              {/* Método Pago y Moneda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Moneda
                  </label>
                  <select
                    {...register("moneda", { required: "La moneda es requerida" })}
                    name="moneda"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="USD" selected={formData.moneda === "USD"}>
                      USD
                    </option>
                    <option value="Bs" selected={formData.moneda === "Bs"}>
                      Bs
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Método Pago
                  </label>
                  <select
                    {...register("metodo_pago", {})}
                    name="metodo_pago"
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="" disabled selected={!formData.metodo_pago}>
                      Seleccionar método
                    </option>
                    <option value="tarjeta_credito" selected={formData.metodo_pago === "tarjeta_credito"}>
                      Tarjeta Crédito
                    </option>
                    <option value="tarjeta_debito" selected={formData.metodo_pago === "tarjeta_debito"}>
                      Tarjeta Débito
                    </option>
                    <option value="efectivo" selected={formData.metodo_pago === "efectivo"}>
                      Efectivo
                    </option>
                    <option value="transferencia" selected={formData.metodo_pago === "transferencia"}>
                      Transferencia
                    </option>
                  </select>
                </div>
              </div>

              {/* Items */}
              {formData.items && formData.items.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Items ({formData.items.length})
                  </h3>
                  <div className="grid gap-3">
                    {formData.items.map((item, idx) => (
                      <div
                        key={item.descripcion}
                        className="rounded-lg border p-3 bg-muted/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            {...register(`items.${idx}.descripcion` as any)}
                            disabled
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(formData.items || [])];
                              newItems.splice(idx, 1);
                              setFormData((prev) => ({
                                ...prev,
                                items: newItems,
                              }));
                            }}
                            className="text-xs text-destructive hover:underline"
                          >
                            <Trash className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.descripcion}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span>
                            Qty: {item.cantidad}
                          </span>
                          <span>
                            ${item.precio_unitario.toFixed(2)}
                          </span>
                          <span>
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Items
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Agregue items en el procesamiento IA o edítelos manualmente
                  </p>
                </div>
              )}

              {/* Acción */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {initialData ? "Actualizar Factura" : "Guardar Factura"}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer con botón cerrar */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-destructive px-4 py-2.5 text-lg font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                aria-label="Cerrar sin guardar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}