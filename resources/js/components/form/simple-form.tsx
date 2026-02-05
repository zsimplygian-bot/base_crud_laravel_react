import { useEffect, useMemo, useState, useRef } from "react";
import { useForm, router } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { SmartButton } from "@/components/smart-button";
import { Save, Edit, Trash } from "lucide-react";
import { FormField } from "@/components/form/form-fields";
import { getLista, getListaSync } from "@/hooks/use-listas-cache";
import axios from "axios";

const isCombobox = (f: any) => f.type === "combobox";

export const SimpleForm = ({
  mode,
  endpoint,
  recordId,
  fields = [],
  extendedFields,
  ExtendedForm,
  open,
  onSuccess,
}: any) => {
  const MODE = {
    store: {
      submit: "Registrar",
      disabled: false,
      showSubmit: true,
      method: "post",
      icon: Save,
      className: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    update: {
      submit: "Actualizar",
      disabled: false,
      showSubmit: true,
      method: "put",
      icon: Edit,
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    delete: {
      submit: "Eliminar",
      disabled: true,
      showSubmit: true,
      method: "delete",
      icon: Trash,
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
    info: { submit: null, disabled: true, showSubmit: false, method: null },
  }[mode];

  const normalizedFields = useMemo(
    () =>
      fields.map(f => ({
        ...f,
        name: f.name ?? f.id,
        lista: isCombobox(f) ? f.name ?? f.id : f.lista,
      })),
    [fields]
  );

  const initialData = useMemo(
    () =>
      Object.fromEntries(
        normalizedFields.map(f => [
          f.name,
          f.value != null ? String(f.value) : f.default != null ? String(f.default) : "",
        ])
      ),
    [normalizedFields]
  );

  const { data, setData, submit, processing, errors, reset } = useForm(initialData);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [record, setRecord] = useState<any>(null);
  const [listsReady, setListsReady] = useState(false);
  const filledRef = useRef(false);
  const shouldFetchRecord = mode !== "store" && !!recordId;

  // Cargar listas
  useEffect(() => {
    if (!open) return;
    const loadLists = async () => {
      const comboFields = normalizedFields.filter(isCombobox);
      await Promise.all(comboFields.map(f => getLista(f.lista)));
      setListsReady(true);
    };
    setListsReady(false);
    filledRef.current = false;
    loadLists();
  }, [open, normalizedFields]);

  // Aplicar defaults en store
  useEffect(() => {
    if (!open || !listsReady || mode !== "store") return;
    reset(initialData);
  }, [open, listsReady, mode, initialData, reset]);

  // Obtener registro
  useEffect(() => {
    if (!shouldFetchRecord || !listsReady) return;
    axios.get(`${endpoint}/${recordId}`).then(res => setRecord(res.data));
  }, [shouldFetchRecord, listsReady, recordId, endpoint]);

  // Llenar datos en update / delete
  useEffect(() => {
    if (!record || !listsReady || filledRef.current) return;
    filledRef.current = true;
    normalizedFields.forEach(f => {
      setData(f.name, record[f.name] != null ? String(record[f.name]) : "");
    });
  }, [record, listsReady, normalizedFields, setData]);

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado", { mode, endpoint, recordId, data });

    // ⚡ Detecta si hay archivo o flag de borrado
    const hasFileOrRemove = Object.entries(data).some(
      ([k, v]) => v instanceof File || k.endsWith("_remove")
    );

    const url = MODE.method === "post" ? endpoint : `${endpoint}/${recordId}`;

    if (hasFileOrRemove) {
      const formData = new FormData();
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (!token) return;

      formData.append("_token", token);
      if (MODE.method !== "post") formData.append("_method", MODE.method);

      Object.entries(data).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (v instanceof File) {
          formData.append(k, v);
        } else {
          formData.append(k, String(v));
        }
      });

      router.post(url, formData, {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });

      return;
    }

    // Sin archivo ni flag → submit normal JSON
    MODE.method &&
      submit(MODE.method, url, {
        onFinish: () => {
          reset();
          onSuccess?.();
        },
      });
  };

  // Render
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
        {normalizedFields.map(field => {
          const lista = isCombobox(field) && getListaSync(field.lista);
          // Campo oculto
          if (field.hidden) {
            return (
              <FormField
                key={field.name}
                {...{
                  id: field.name,
                  type: "hidden",
                  value: data[field.name],
                  hidden: true,
                  onChange: v => setData(field.name, v),
                }}
              />
            );
          }
          return (
            <div key={field.name} className="space-y-1.5 overflow-visible">
              <FormField
                {...{
                  id: field.name,
                  label: field.label,
                  type: field.type,
                  value: data[field.name],
                  disabled: MODE.disabled,
                  options: lista?.options ?? [],
                  loading: !!lista?.loading,
                  open: !!openMap[field.name],
                  setOpen: v => setOpenMap(p => ({ ...p, [field.name]: v })),
                  onChange: v => setData(field.name, v?.target ? v.target.value : v),
                  onSelect: id => {
                    setData(field.name, String(id));
                    setOpenMap(p => ({ ...p, [field.name]: false }));
                  },
                  setData,
                  view: endpoint.split("/").pop(),
                }}
              />
              <InputError message={errors[field.name]} />
            </div>
          );
        })}
        {MODE.showSubmit && (
          <div className="flex justify-end">
            <SmartButton
              type="submit"
              icon={MODE.icon}
              disabled={processing}
              className={MODE.className}
              tooltip={MODE.submit}
            />
          </div>
        )}
      </form>
      {ExtendedForm && extendedFields && (
        <ExtendedForm {...{ data, recordId, mode, extendedFields }} />
      )}
    </div>
  );
};
