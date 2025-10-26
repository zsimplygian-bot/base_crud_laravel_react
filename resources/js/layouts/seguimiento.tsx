import { useState, useRef, useEffect, useMemo } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormFieldsRenderer } from "@/components/form-fields";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";

interface Registro {
  id?: number;
  [key: string]: any;
}

interface SeguimientoSectionProps {
  view: string;
  formId: number;
  action?: string;
  seguimientos?: Registro[];
  procedimientos?: Registro[];
  medicamentos?: Registro[];
  anamnesis?: Registro[];
  modalFields?: any;
  procedimientoFields?: any;
  medicamentoFields?: any;
  anamnesisFields?: any;
}

const tiposMap = {
  seguimiento: "seguimientos",
  procedimiento: "procedimientos",
  medicamento: "medicamentos",
  anamnesis: "anamnesis",
};

export default function SeguimientoSection({
  view,
  formId,
  action = "view",
  seguimientos = [],
  procedimientos = [],
  medicamentos = [],
  anamnesis = [],
  modalFields = [],
  procedimientoFields = [],
  medicamentoFields = [],
  anamnesisFields = [],
}: SeguimientoSectionProps) {
  const [modal, setModal] = useState<{ open: boolean; registro: Registro | null; tipo: string | null }>({
    open: false,
    registro: null,
    tipo: null,
  });
  const [confirm, setConfirm] = useState<{ open: boolean; registro: Registro | null; tipo: string }>({
    open: false,
    registro: null,
    tipo: "",
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const normalizeFields = (fields: any): any[] => {
    if (Array.isArray(fields)) return fields;
    if (fields && typeof fields === "object")
      return Object.entries(fields).map(([key, def]: any) => [
        key,
        def.label ?? key.toUpperCase(),
        def.type ?? "text",
        def.options ?? null,
        def.width ?? 1,
      ]);
    return [];
  };

  const modalFieldsArr = useMemo(() => normalizeFields(modalFields), [modalFields]);
  const procedimientoFieldsArr = useMemo(() => normalizeFields(procedimientoFields), [procedimientoFields]);
  const medicamentoFieldsArr = useMemo(() => normalizeFields(medicamentoFields), [medicamentoFields]);
  const anamnesisFieldsArr = useMemo(() => normalizeFields(anamnesisFields), [anamnesisFields]);

  const todosRegistros = useMemo(() => {
    const all: Registro[] = [
      ...anamnesis.map((r) => ({ ...r, tipo: "Anamnesis", fields: anamnesisFieldsArr })),
      ...seguimientos.map((r) => ({ ...r, tipo: "Seguimiento", fields: modalFieldsArr })),
      ...procedimientos.map((r) => ({ ...r, tipo: "Procedimiento", fields: procedimientoFieldsArr })),
      ...medicamentos.map((r) => ({ ...r, tipo: "Medicamento", fields: medicamentoFieldsArr })),
    ];
    return all.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [anamnesis, seguimientos, procedimientos, medicamentos]);

  const currentFieldArray = useMemo(() => {
    switch (modal.tipo) {
      case "procedimientos":
        return procedimientoFieldsArr;
      case "medicamentos":
        return medicamentoFieldsArr;
      case "anamnesis":
        return anamnesisFieldsArr;
      default:
        return modalFieldsArr;
    }
  }, [modal.tipo, procedimientoFieldsArr, medicamentoFieldsArr, anamnesisFieldsArr, modalFieldsArr]);

  const currentFormFieldsObj = useMemo(() => {
    const obj: Record<string, any> = {};
    currentFieldArray.forEach((f) => {
      if (Array.isArray(f) && f[0])
        obj[f[0]] = {
          form: { key: f[0], label: f[1], type: f[2], options: f[3], placeholder: "", width: 1 },
        };
    });
    return obj;
  }, [currentFieldArray]);

  useEffect(() => {
    if (!modal.open) return;
    setErrors({});
    const base: Record<string, any> = {};
    currentFieldArray.forEach((f) => {
      if (Array.isArray(f) && f[0]) base[f[0]] = modal.registro?.[f[0]] ?? "";
    });
    setFormData(base);
  }, [modal.open, modal.registro, currentFieldArray]);

  const getRegistroId = (registro: Registro, tipo: string) => {
    const singular = tipo === "anamnesis" ? tipo : tipo.replace(/s$/, "");
    const posibles = [
      registro[`id_historia_clinica_${singular}`],
      registro[`id_${singular}`],
      registro.id,
    ];
    return posibles.find((v) => v !== undefined && v !== null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.tipo) return;
    const tipoKey = modal.tipo === "anamnesis" ? "anamnesis" : modal.tipo.replace(/s$/, "");
    const routeName = `${view}.${tiposMap[tipoKey] ?? "anamnesis"}`;
    const registroId = modal.registro ? getRegistroId(modal.registro, modal.tipo) : null;
    const url = modal.registro
      ? route(`${routeName}.update`, { [tipoKey]: registroId })
      : route(`${routeName}.store`);
    const dataPayload = { ...formData, id_historia_clinica: formId };
    router[modal.registro ? "put" : "post"](url, {
      data: dataPayload,
      onError: setErrors,
      onSuccess: () => setModal({ open: false, registro: null, tipo: null }),
    });
  };

  const handleDelete = () => {
    if (!confirm.registro) return;
    const tipoKey = confirm.tipo === "anamnesis" ? "anamnesis" : confirm.tipo.replace(/s$/, "");
    const routeName = `${view}.${tiposMap[tipoKey] ?? "anamnesis"}`;
    const registroId = getRegistroId(confirm.registro, confirm.tipo);
    if (!registroId) return;
    const delUrl = route(`${routeName}.destroy`, { [tipoKey]: registroId });
    router.delete(delUrl, {
      onSuccess: () => setConfirm({ open: false, registro: null, tipo: "" }),
    });
  };

  const canEdit = action === "update";

  return (
    <div className="flex flex-col gap-4 mt-0">
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {Object.entries({
            anamnesis: "Anamnesis",
            seguimientos: "Seguimiento",
            procedimientos: "Procedimiento",
            medicamentos: "Medicamento",
          }).map(([tipo, label]) => (
            <Button
              key={tipo}
              variant="outline"
              size="sm"
              onClick={() => setModal({ open: true, registro: null, tipo })}
            >
              <PlusIcon className="w-4 h-4 mr-1" /> {label}
            </Button>
          ))}
        </div>
      )}

      {todosRegistros.map((r) => {
        const tipoLower = tiposMap[r.tipo.toLowerCase()] || "anamnesis";
        const recordId = getRegistroId(r, tipoLower);
        return (
          <div
            key={`${r.tipo}-${recordId}`}
            className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white">
                {r.tipo} — {r.fecha}
              </p>
              {Array.isArray(r.fields) &&
                r.fields
                  .filter((f: any[]) => Array.isArray(f) && f[0] !== "fecha")
                  .map((f: any[], i: number) => {
                    const key = f[0];
                    const label = f[1];
                    let value = r[key] ?? "-";
                    if (/^id_/.test(key)) {
                      const nombreKey = key.replace(/^id_/, "nombre_");
                      if (r[nombreKey] !== undefined && r[nombreKey] !== null) {
                        value = r[nombreKey];
                      }
                    }
                    return (
                      <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                        {label}: {value}
                      </p>
                    );
                  })}
            </div>

            {canEdit && (
              <div className="flex flex-col gap-1 ml-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setModal({ open: true, registro: r, tipo: tipoLower })}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setConfirm({ open: true, registro: r, tipo: tipoLower })}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal Form */}
      {modal.open && (
        <Dialog open={modal.open} onOpenChange={() => setModal({ open: false, registro: null, tipo: null })}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>
                {modal.registro
                  ? `Editar ${modal.tipo?.replace(/s$/, "")}`
                  : `Nuevo ${modal.tipo?.replace(/s$/, "")}`}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3 w-full">
              <div className="flex flex-col gap-3">
                {Object.entries(currentFormFieldsObj).map(([key, field]: any) => (
                  <div key={key} className="w-full">
                    <FormFieldsRenderer
                      formFields={{ [key]: field }}
                      data={formData}
                      setData={(k, v) => setFormData((p) => ({ ...p, [k]: v }))}
                      errors={errors}
                      readonly={false}
                      configReadonly={false}
                      hiddenFields={[]}
                      isMobile={true}
                      inputRefs={inputRefs}
                      view={view}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModal({ open: false, registro: null, tipo: null })}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Delete */}
      {confirm.open && (
        <Dialog open={confirm.open} onOpenChange={() => setConfirm({ open: false, registro: null, tipo: "" })}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>¿Eliminar {confirm.registro?.tipo ?? "registro"}?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => setConfirm({ open: false, registro: null, tipo: "" })}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
