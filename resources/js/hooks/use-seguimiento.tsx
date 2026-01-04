// hooks/use-seguimiento.tsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { PencilIcon, TrashIcon, Save } from "lucide-react";
export interface Field { label: string; key: string; value: any }
export type Action = "create" | "update" | "delete";
const CONFIG = {
  seguimientos: "SEGUIMIENTO",
  procedimientos: "PROCEDIMIENTO",
  medicamentos: "MEDICAMENTO",
  anamnesis: "ANAMNESIS",
} as const;
const ACTION: Record<Action, {
  title: string;
  btn: string;
  cls: string;
  icon: JSX.Element;
  border: string;
  readonly?: true;
}> = {
  create: { title: "REGISTRAR", btn: "Guardar", cls: "bg-blue-600 hover:bg-blue-700 text-white", icon: <Save className="w-4 h-4" />, border: "border-l border-blue-500" },
  update: { title: "ACTUALIZAR", btn: "Actualizar", cls: "bg-green-600 hover:bg-green-700 text-white", icon: <PencilIcon className="w-4 h-4" />, border: "border-l border-green-500" },
  delete: { title: "ELIMINAR", btn: "Eliminar", cls: "bg-red-600 hover:bg-red-700 text-white", icon: <TrashIcon className="w-4 h-4" />, border: "border-l border-red-500", readonly: true },
};
const singular = (t: string) => t.endsWith("is") ? t : t.replace(/s$/, "");
const idKey = (t: string) => `id_historia_clinica_${singular(t)}`;
const route = (t: string, id?: number) => id ? `/historia_clinica_${singular(t)}/${id}` : `/historia_clinica_${singular(t)}/form`;
const extractId = (f: Field[], t: string) => f.find(x => x.key.startsWith("id_") || x.label.toLowerCase().includes(singular(t)))?.value ?? null;
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const parseDateAsLocal = (dateStr: string): Date | null => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const formatDatePeru = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Sin fecha";
  const date = parseDateAsLocal(dateStr);
  if (!date) return "Sin fecha";
  return date.toLocaleDateString("es-PE");
};
export const useSeguimiento = (formId: number, action: Action = "update") => {
  const parentId = useMemo(() => window.location.pathname.match(/\/update\/(\d+)/)?.[1] ?? formId, [formId]);
  const [modal, setModal] = useState<{ open: boolean; tipo: string | null; reg: Field[] | null; act: Action }>({ open: false, tipo: null, reg: null, act: "update" });
  const [fields, setFields] = useState<Record<string, any[]>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Record<string, Field[][]>>({});
  const [loadingRecords, setLoadingRecords] = useState(true);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { post, put, delete: del, processing, errors, setData: setInertia } = useForm({});
  // Carga los registros
  const loadRecords = useCallback(() => {
    setLoadingRecords(true);
    fetch(`/api/historia/${parentId}/records`)
      .then(r => r.json())
      .then(setRecords)
      .finally(() => setLoadingRecords(false));
  }, [parentId]);
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);
  // Carga los campos para el modal
  useEffect(() => {
    if (!modal.open || !modal.tipo || fields[modal.tipo]) return;
    fetch(`/api/historia/${modal.tipo}/fields`)
      .then(r => r.json())
      .then(d => {
        const mapped = Object.entries(d).map(([k, v]: any) => [k, v.label ?? k, v.type ?? "text", v.options ?? null]);
        setFields(prev => ({ ...prev, [modal.tipo!]: mapped }));
      });
  }, [modal.open, modal.tipo, fields]);
  // Inicializa los datos del formulario cuando abre el modal
  useEffect(() => {
    if (!modal.open || !modal.tipo || !fields[modal.tipo]) return;
    const base: Record<string, any> = {};
    fields[modal.tipo].forEach(([k]) => base[k] = modal.reg?.find(f => f.key === k)?.value ?? "");
    const id = modal.reg ? extractId(modal.reg, modal.tipo) : null;
    if (id) base[idKey(modal.tipo)] = id;
    if (modal.act === "create") base.id_historia_clinica = parentId;
    setData(base);
  }, [modal.open, modal.tipo, modal.reg, fields, parentId]);
  useEffect(() => {
    setInertia(data);
  }, [data, setInertia]);
  // Submit del formulario
  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.tipo) return;
    const id = data[idKey(modal.tipo)];
    const hasFile = Object.values(data).some(v => v instanceof File);
    const url = modal.act === "create" ? route(modal.tipo) : route(modal.tipo, id);
    const onSuccess = () => { setModal(m => ({ ...m, open: false })); loadRecords(); };
    if (hasFile) {
      const fd = new FormData();
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (token) fd.append("_token", token);
      if (modal.act !== "create") fd.append("_method", "PUT");
      Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, v instanceof File ? v : String(v)); });
      router.post(url, fd, { forceFormData: true, preserveScroll: true, onSuccess });
      return;
    }
    modal.act === "create"
      ? post(url, { data, onSuccess })
      : modal.act === "update"
        ? put(url, { data, onSuccess })
        : del(url, { onSuccess });
  }, [modal, data, post, put, del, loadRecords]);
  const openModal = (tipo: string, reg: Field[] | null, act: Action) => setModal({ open: true, tipo, reg, act });
  const closeModal = () => setModal({ open: false, tipo: null, reg: null, act: "update" });
  const groupedByDate = useMemo(() => {
    const map: Record<string, { tipo: string; f: Field[]; k: string }[]> = {};
    Object.entries(records).forEach(([t, items]) => {
      items.forEach(f => {
        const fecha = f.find(x => x.key === "fecha")?.value ?? "Sin fecha";
        if (!map[fecha]) map[fecha] = [];
        map[fecha].push({ tipo: CONFIG[t as keyof typeof CONFIG], f, k: t });
      });
    });
    return Object.fromEntries(Object.entries(map).sort(([a], [b]) => (parseDateAsLocal(b)?.getTime() ?? 0) - (parseDateAsLocal(a)?.getTime() ?? 0)));
  }, [records]);
  const getTitleAndColor = (item: { k: string; f: Field[] }) => {
    const technicalKeys = ["id", "created_at", "updated_at", "fecha"];
    const visibleFields = item.f.filter(f => !technicalKeys.some(tk => f.key.startsWith(tk) || f.key === tk));
    let title = "Sin título";
    let color = "text-purple-600 dark:text-purple-400";
    let usedKey = "";
    if (item.k === "procedimientos") {
      const field = visibleFields.find(f => f.key.toLowerCase().includes("nombre") || f.key.toLowerCase().includes("procedimiento") || f.label.toLowerCase().includes("procedimiento") || f.label.toLowerCase().includes("nombre"));
      title = field ? String(field.value).toUpperCase().trim() : "PROCEDIMIENTO";
      usedKey = field?.key || "";
      color = "text-blue-600 dark:text-blue-400";
    } else if (item.k === "medicamentos") {
      const field = visibleFields.find(f => f.key.toLowerCase().includes("medicamento") || f.key.toLowerCase().includes("nombre") || f.label.toLowerCase().includes("medicamento") || f.label.toLowerCase().includes("nombre"));
      title = field ? String(field.value).trim() : "MEDICAMENTO";
      usedKey = field?.key || "";
      color = "text-green-600 dark:text-green-400";
    } else if (item.k === "anamnesis") {
      title = "ANAMNESIS";
      color = "text-red-600 dark:text-red-400";
    } else if (item.k === "seguimientos") {
      title = "SEGUIMIENTO";
      color = "text-gray-600 dark:text-gray-400";
    }
    return { title, color, usedKey };
  };
  const getFolderForType = (typeKey: string) => {
    const map: Record<string, string> = {
      procedimientos: "historia_clinica_procedimiento",
      medicamentos: "historia_clinica_medicamento",
      anamnesis: "historia_clinica_anamnesis",
      seguimientos: "historia_clinica_seguimiento",
    };
    return map[typeKey] || "historia_clinica";
  };
  return {
    modal, openModal, closeModal, fields, data, setData, submit,
    groupedByDate, loadingRecords, inputRefs, processing, errors,
    getTitleAndColor, getFolderForType, CONFIG, ACTION, capitalize, formatDatePeru
  };
};