import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";
import { useApi } from "@/hooks/use-api";
import InputError from "@/components/input-error";
import { SmartButton } from "@/components/smart-button";
import { Save, Edit, Trash } from "lucide-react";
import { FormField } from "@/components/form/form-fields";

const listasCacheGlobal = {};
const isCombobox = f => f.type === "combobox";

export const SimpleForm = ({ mode, endpoint, recordId, fields = [], open, onSuccess }) => {
  const MODE = {
    store:  { disabled: false, showSubmit: true,  method: "post",   icon: Save,  className: "bg-blue-600 hover:bg-blue-700 text-white" },
    update: { disabled: false, showSubmit: true,  method: "put",    icon: Edit,  className: "bg-green-600 hover:bg-green-700 text-white" },
    delete: { disabled: true,  showSubmit: true,  method: "delete", icon: Trash, className: "bg-red-600 hover:bg-red-700 text-white" },
    info:   { disabled: true,  showSubmit: false, method: null },
  }[mode];

  const normalizedFields = useMemo(() =>
    fields.map(f => {
      const name = f.name ?? f.id;
      return {
        ...f,
        name,
        lista: isCombobox(f) ? name : f.lista,
        labelKey: isCombobox(f)
          ? name.startsWith("id_") ? name.replace("id_", "") : name
          : f.labelKey
      };
    }),
  [fields]);

  const { data, setData, submit, processing, errors, reset } = useForm(
    Object.fromEntries(normalizedFields.map(f => [f.name, ""]))
  );

  const [openMap, setOpenMap] = useState({});
  const shouldFetchRecord = mode !== "store" && !!recordId;

  const { data: record, refetch } = useApi(
    shouldFetchRecord ? `${endpoint}/${recordId}` : null,
    { autoFetch: false }
  );

  useEffect(() => { shouldFetchRecord && refetch(); }, [shouldFetchRecord]);

  const resolveComboboxValue = useCallback(field => {
    if (!record) return;
    const lista = listasCacheGlobal[field.lista];
    const value = record[field.labelKey];
    if (!value || !lista?.loaded) return;
    const match = lista.options.find(o => o.label?.toString().trim() === value.toString().trim());
    match && setData(field.name, String(match.id));
  }, [record]);

  useEffect(() => {
    if (!open) return;
    normalizedFields.filter(isCombobox).forEach(async field => {
      const key = field.lista;
      if (listasCacheGlobal[key]?.loaded) return resolveComboboxValue(field);
      if (listasCacheGlobal[key]?.loading) return;
      listasCacheGlobal[key] = { options: [], loading: true };
      const res = await fetch(`/api/listas?campo=${key}`);
      const json = await res.json();
      listasCacheGlobal[key] = { options: json.data ?? [], loaded: true };
      resolveComboboxValue(field);
    });
  }, [open, normalizedFields, resolveComboboxValue]);

  useEffect(() => {
    if (!record) return;
    normalizedFields.forEach(f =>
      !isCombobox(f) && record[f.name] !== undefined && setData(f.name, record[f.name])
    );
    normalizedFields.filter(isCombobox).forEach(resolveComboboxValue);
  }, [record, normalizedFields, resolveComboboxValue]);

  const handleSubmit = e => {
    e.preventDefault();
    MODE.method && submit(
      MODE.method,
      MODE.method === "post" ? endpoint : `${endpoint}/${recordId}`,
      { onFinish: () => { reset(); onSuccess?.(); } }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
      {normalizedFields.map(field => {
        const value = data[field.name];
        const lista = isCombobox(field) && listasCacheGlobal[field.lista];
        const options = lista?.options ?? [];

        return (
          <div key={field.name} className="space-y-1.5 overflow-visible">
            <FormField
              {...{
                id: field.name,
                label: field.label,
                type: field.type,
                value,
                disabled: MODE.disabled,
                options,
                loading: !!lista?.loading,
                open: !!openMap[field.name],
                setOpen: v => setOpenMap(p => ({ ...p,[field.name]: v })),
                onChange: v =>
                  setData(field.name, v?.target ? v.target.value : v),
                onSelect: id => {
                  setData(field.name, String(id));
                  setOpenMap(p => ({ ...p,[field.name]: false }));
                }
              }}
            />
            <InputError message={errors[field.name]} />
          </div>
        );
      })}

      {MODE.showSubmit && (
        <div className="flex justify-end">
          <SmartButton
            {...{
              type: "submit",
              icon: MODE.icon,
              disabled: processing,
              className: MODE.className
            }}
          />
        </div>
      )}
    </form>
  );
};
