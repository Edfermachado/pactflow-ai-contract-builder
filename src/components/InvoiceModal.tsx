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

  React.useEffect(() => {
    if (isOpen && initialData) {
      const newData = {
        id: initialData.id || "",
        emisor: initialData.emisor || "",
        rif: initialData.rif || "",
        fecha_emision: initialData.fecha_emision ?? null,
        fecha_pago: initialData.fecha_pago ?? null,
        concepto: initialData.concepto || "",
        subtotal: initialData.subtotal ?? 0,
        tipo_impuesto: initialData.tipo_impuesto || "",
        iva: initialData.iva ?? null,
        total: initialData.total ?? 0,
        categoria: initialData.categoria ?? "otros",
        estado_pago: initialData.estado_pago ?? "pendiente",
        moneda: initialData.moneda ?? currency,
        metodo_pago: initialData.metodo_pago || "",
        items: initialData.items ?? [],
        archivo_url: initialData.archivo_url || "",
      } as Invoice;
      setFormData(newData);
      reset(newData);
    }
  }, [isOpen, initialData, reset, currency]);

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
      className={cn(
        "fixed inset-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto",
        isOpen ? "flex" : "hidden"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            className="relative max-w-md w-full bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 transition-all duration-300 overflow-y-auto max-h-[90vh]"
            style={{ transform: "scale(1)" }}
            id="modal-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    RIF / ID Fiscal *
                  </label>
                  <input
                    {...register("rif")}
                    className={cn(
                      "mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                      errors.rif && "border-destructive focus:ring-destructive"
                    )}
                    placeholder="J-12345678-9"
                  />
                  {errors.rif && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.rif.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    N° Factura
                  </label>
                  <input
                    {...register("numero_factura")}
                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="000123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  {...register("fecha_emision", { valueAsDate: true })}
                  name="fecha_emision"
                  className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  defaultValue={formData.fecha_emision ? new Date(formData.fecha_emision).toISOString().split('T')[0] : ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Concepto
                </label>
                <textarea
                  {...register("concepto")}
                  name="concepto"
                  rows={2}
                  className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                  placeholder="Descripción breve del servicio/producto"
                  defaultValue={formData.concepto}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Subtotal
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {formData.moneda === "USD" ? "$" : "Bs"}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      {...register("subtotal", { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary numbox"
                    />
                  </div>
                </div>
                <div className="w-24">
                  <label className="text-xs font-medium text-muted-foreground truncate block">
                    Tipo Imp.
                  </label>
                  <input
                    {...register("tipo_impuesto")}
                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="16%"
                  />
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
                    defaultValue={formData.categoria}
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="servicios">Servicios</option>
                    <option value="transporte">Transporte</option>
                    <option value="oficina">Oficina</option>
                    <option value="software">Software</option>
                    <option value="otros">Otros</option>
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
                    defaultValue={formData.estado_pago}
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="pagada">Pagada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencida">Vencida</option>
                    <option value="parcial">Parcial</option>
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
                    defaultValue={formData.moneda}
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="USD">USD</option>
                    <option value="Bs">Bs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Método Pago
                  </label>
                  <select
                    {...register("metodo_pago", {})}
                    name="metodo_pago"
                    defaultValue={formData.metodo_pago || ""}
                    className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="" disabled>Seleccionar método</option>
                    <option value="tarjeta_credito">Tarjeta Crédito</option>
                    <option value="tarjeta_debito">Tarjeta Débito</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
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
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {initialData ? "Actualizar Factura" : "Guardar Factura"}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer con botón cerrar */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
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