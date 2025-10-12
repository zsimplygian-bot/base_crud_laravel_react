import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import LayoutForm from "@/layouts/form-layout";
import { Button } from "@/components/ui/button";

interface FormProps {
  form_data: any;
  formFields: any;
  modalFields: any[];
  procedimientoFields?: any[];
  medicamentoFields?: any[];
  anamnesisFields?: any[];
  action: string;
  custom_title: string;
  view: string;
  title: string;
  width_form?: string;
  toggleOptions?: any;
  queryparams?: any;
  apiConfig?: any;
  seguimientos?: any[];
  procedimientos?: any[];
  medicamentos?: any[];
  anamnesis?: any[];
}

type Registro = Record<string, any>;

const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 w-full flex justify-center">{children}</div>
  </div>
);

const RegistroModal: React.FC<{
  open: boolean;
  onClose: () => void;
  registro?: Registro | null;
  parentId: number;
  modalFields: any[];
  routeName: string;
  titulo: string;
  tipo: "seguimientos" | "procedimientos" | "medicamentos" | "anamnesis";
}> = ({ open, onClose, registro, parentId, modalFields, routeName, titulo, tipo }) => {
  const initialData = modalFields.reduce((acc, field) => {
    acc[field[0]] = registro?.[field[0]] ?? (field[2] === "date" ? new Date().toISOString().slice(0, 10) : "");
    return acc;
  }, {} as Record<string, any>);

  const { data, setData, post, put, reset } = useForm({
    id_historia_clinica: parentId,
    ...initialData,
  });

  useEffect(() => {
    const newData = modalFields.reduce((acc, field) => {
      acc[field[0]] = registro?.[field[0]] ?? (field[2] === "date" ? new Date().toISOString().slice(0, 10) : "");
      return acc;
    }, {} as Record<string, any>);
    setData({ id_historia_clinica: parentId, ...newData });
  }, [registro, modalFields]);

  const getRouteParam = () => {
    if (!registro) return {};
    if (registro.id_historia_clinica_anamnesis) return { anamnesis: registro.id_historia_clinica_anamnesis };
    if (registro.id_historia_clinica_procedimiento) return { procedimiento: registro.id_historia_clinica_procedimiento };
    if (registro.id_historia_clinica_medicamento) return { medicamento: registro.id_historia_clinica_medicamento };
    if (registro.id_historia_clinica_seguimiento) return { seguimiento: registro.id_historia_clinica_seguimiento };
    const id = registro.id ?? registro.id_seguimiento ?? registro.id_procedimiento ?? registro.id_medicamento ?? registro.id_anamnesis;
    return id ? { id } : {};
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registro) {
      const routeParam = getRouteParam();
      const url = route(`${routeName}.update`, routeParam);
      put(url, { data, onSuccess: () => { reset(); onClose(); } });
    } else {
      const url = route(`${routeName}.store`);
      post(url, { data, onSuccess: () => { reset(); onClose(); } });
    }
  };

  if (!open) return null;

  return (
    <ModalBackdrop>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-3/4 max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {registro ? `Editar ${titulo}` : `Nuevo ${titulo}`}
        </h3>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {modalFields.map((field) => {
            const [name, label, type] = field;
            const value = data[name] ?? "";
            if (type === "textarea") {
              return <textarea key={name} value={value} onChange={(e) => setData(name, e.target.value)} className="w-full min-h-[80px] rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2" placeholder={label} />;
            }
            if (type === "select") {
              return (
                <select key={name} value={value} onChange={(e) => setData(name, e.target.value)} className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2">
                  <option value="">Seleccione...</option>
                  {(field[3] || []).map((opt: any) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              );
            }
            if (type === "datetime") {
              const formatted = value ? value.slice(0, 16) : "";
              return <input key={name} type="datetime-local" value={formatted} onChange={(e) => setData(name, e.target.value)} className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2" placeholder={label} />;
            }
            return <input key={name} type={type} value={value} onChange={(e) => setData(name, e.target.value)} className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2" placeholder={label} />;
          })}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Guardar</button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm, itemName }: any) => {
  if (!open) return null;
  return (
    <ModalBackdrop>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-1/3 max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Confirmar eliminación</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">¿Estás seguro de que deseas eliminar <strong>{itemName}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Eliminar</button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  modalFields = [],
  procedimientoFields = [],
  medicamentoFields = [],
  anamnesisFields = [],
  action,
  custom_title,
  view,
  title,
  queryparams,
  width_form,
  toggleOptions,
  apiConfig,
  seguimientos = [],
  procedimientos = [],
  medicamentos = [],
  anamnesis = [],
}) => {
  const [modalConfig, setModalConfig] = useState<{ open: boolean; registro: Registro | null; tipo: "seguimientos" | "procedimientos" | "medicamentos" | "anamnesis" | null }>({ open: false, registro: null, tipo: null });
  const [deleteConfig, setDeleteConfig] = useState<{ open: boolean; registro: Registro | null; tipo: string }>({ open: false, registro: null, tipo: "" });

  const mainId = form_data?.[`id_${view}`] ?? Number(window.location.pathname.split("/").pop() ?? 0);
  const showActions = action !== "info" && action !== "delete";

  const tipoMap: Record<string, string> = {
    seguimiento: "seguimientos",
    procedimiento: "procedimientos",
    medicamento: "medicamentos",
    anamnesis: "anamnesis",
    anamnesiss: "anamnesis",
  };

  const getRoute = (tipo: string) => {
    switch (tipo) {
      case "seguimientos": return `${view}.seguimientos`;
      case "procedimientos": return `${view}.procedimientos`;
      case "medicamentos": return `${view}.medicamentos`;
      case "anamnesis": return `${view}.anamnesis`;
      default: return `${view}.anamnesis`;
    }
  };

  const todosRegistros = [
    ...anamnesis.map((r) => ({ ...r, tipo: "Anamnesis", $displayFields: anamnesisFields.reduce((acc, f) => { acc[f[0]] = f[1]; return acc; }, {}) })),
    ...seguimientos.map((r) => ({ ...r, tipo: "Seguimiento", $displayFields: modalFields.reduce((acc, f) => { acc[f[0]] = f[1]; return acc; }, {}) })),
    ...procedimientos.map((r) => ({ ...r, tipo: "Procedimiento", $displayFields: procedimientoFields.reduce((acc, f) => { acc[f[0]] = f[1]; return acc; }, {}) })),
    ...medicamentos.map((r) => ({ ...r, tipo: "Medicamento", $displayFields: medicamentoFields.reduce((acc, f) => { acc[f[0]] = f[1]; return acc; }, {}) })),
  ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col gap-6 p-4">
        <LayoutForm
          form_data={form_data}
          formFields={formFields}
          action={action}
          custom_title={custom_title}
          view={view}
          width_form={width_form}
          queryparams={queryparams}
          toggleOptions={toggleOptions}
          apiConfig={apiConfig}
        />

        {showActions && action !== "create" && form_data?.[`id_${view}`] && (
          <div className="flex flex-wrap gap-3 mb-0">
            {[
              { tipo: "anamnesis", label: "Anamnesis" },
              { tipo: "seguimientos", label: "Seguimiento" },
              { tipo: "procedimientos", label: "Procedimiento" },
              { tipo: "medicamentos", label: "Medicamento" },
            ].map((t) => (
              <Button key={t.tipo} variant="outline" className="border border-gray-300 bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700" onClick={() => setModalConfig({ open: true, registro: null, tipo: t.tipo as any })}>
                ➕ Agregar {t.label}
              </Button>
            ))}
          </div>
        )}

        {action !== "create" && todosRegistros.length > 0 && (
          <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-4 shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Registro de Actividades</h2>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[700px] pr-2">
              {todosRegistros.map((r) => {
                const tipoLower = tipoMap[r.tipo.toLowerCase()] || "anamnesis";
                const routeName = getRoute(tipoLower);
                const recordId = r.id ?? r.id_anamnesis ?? r.id_seguimiento ?? r.id_procedimiento ?? r.id_medicamento;

                return (
                  <div key={`${r.tipo}-${recordId}`} className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{r.tipo} — {r.fecha}</p>
                      {Object.entries(r.$displayFields).map(([field, label]) => {
                        let value = r[field];
                        if (field === "id_medicamento" && r.nombre_medicamento) value = r.nombre_medicamento;
                        if (field === "id_procedimiento" && r.nombre_procedimiento) value = r.nombre_procedimiento;
                        return <p key={field} className="text-sm text-gray-700 dark:text-gray-300">{label}: {value ?? "-"}</p>;
                      })}
                    </div>
                    {showActions && (
                      <div className="flex flex-col gap-1">
                        <button onClick={() => setModalConfig({ open: true, registro: r, tipo: tipoLower as any })} className="px-2 py-1 rounded bg-yellow-500 text-white text-xs hover:bg-yellow-600">Editar</button>
                        <button onClick={() => setDeleteConfig({ open: true, registro: r, tipo: tipoLower })} className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600">Eliminar</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <RegistroModal
          open={modalConfig.open}
          onClose={() => setModalConfig({ open: false, registro: null, tipo: null })}
          registro={modalConfig.registro}
          parentId={mainId}
          modalFields={
            modalConfig.tipo === "procedimientos"
              ? procedimientoFields
              : modalConfig.tipo === "medicamentos"
              ? medicamentoFields
              : "anamnesis" || modalConfig.tipo === "anamnesis"
              ? anamnesisFields
              : modalFields
          }
          routeName={getRoute(modalConfig.tipo ?? "anamnesis")}
          titulo={
            modalConfig.tipo === "procedimientos"
              ? "Procedimiento"
              : modalConfig.tipo === "medicamentos"
              ? "Medicamento"
              : modalConfig.tipo === "anamnesis"
              ? "Anamnesis"
              : "Anamnesis"
          }
          tipo={modalConfig.tipo as any}
        />

        <ConfirmDeleteModal
          open={deleteConfig.open}
          itemName={deleteConfig.registro?.tipo ?? "este registro"}
          onClose={() => setDeleteConfig({ open: false, registro: null, tipo: "" })}
          onConfirm={() => {
            if (!deleteConfig.registro) return;
            const routeName = getRoute(deleteConfig.tipo);
            const delParam = { id: deleteConfig.registro.id };
            const delUrl = route(`${routeName}.destroy`, delParam);
            router.delete(delUrl, { onSuccess: () => setDeleteConfig({ open: false, registro: null, tipo: "" }) });
          }}
        />
      </div>
    </AppLayout>
  );
};
