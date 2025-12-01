import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormFieldsRenderer } from "@/components/form/form-fields";
import { PencilIcon, TrashIcon, Save, Loader2, FileText, ImageIcon } from "lucide-react";
interface Field { label: string; key: string; value: any }
interface Props { view: string; formId: number; action?: string }
const CONFIG = {
  seguimientos: "SEGUIMIENTO",
  procedimientos: "PROCEDIMIENTO",
  medicamentos: "MEDICAMENTO",
  anamnesis: "ANAMNESIS",
} as const;
type Action = "create" | "update" | "delete";
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
export default function SeguimientoSection({ view, formId, action = "update" }: Props) {
  const canEdit = action === "update";
  const parentId = useMemo(() => window.location.pathname.match(/\/update\/(\d+)/)?.[1] ?? formId, [formId]);
  const [modal, setModal] = useState<{ open: boolean; tipo: string | null; reg: Field[] | null; act: Action }>({
    open: false, tipo: null, reg: null, act: "update"
  });
  const [fields, setFields] = useState<Record<string, any[]>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Record<string, Field[][]>>({});
  const [loadingRecords, setLoadingRecords] = useState(true);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { post, put, delete: del, processing, errors, setData: setInertia } = useForm({});
  const load = useCallback(() => {
    setLoadingRecords(true);
    fetch(`/api/historia/${parentId}/records`)
      .then(r => r.json())
      .then(setRecords)
      .finally(() => setLoadingRecords(false));
  }, [parentId]);
  useEffect(load, [load]);
  useEffect(() => {
    if (!modal.open || !modal.tipo || fields[modal.tipo]) return;
    fetch(`/api/historia/${modal.tipo}/fields`)
      .then(r => r.json())
      .then(d => setFields(p => ({
        ...p,
        [modal.tipo!]: Object.entries(d).map(([k, v]: any) => [k, v.label ?? k, v.type ?? "text", v.options ?? null])
      })));
  }, [modal.open, modal.tipo, fields]);
  useEffect(() => {
    if (!modal.open || !modal.tipo || !fields[modal.tipo]) return;
    const base: Record<string, any> = {};
    fields[modal.tipo].forEach(([k]) => base[k] = modal.reg?.find(f => f.key === k)?.value ?? "");
    const id = modal.reg ? extractId(modal.reg, modal.tipo) : null;
    if (id) base[idKey(modal.tipo)] = id;
    if (modal.act === "create") base.id_historia_clinica = parentId;
    setData(base);
  }, [modal.open, modal.tipo, modal.reg, fields, parentId]);
  useEffect(() => setInertia(data), [data, setInertia]);
  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.tipo) return;
    const id = data[idKey(modal.tipo)];
    const hasFile = Object.values(data).some(v => v instanceof File);
    const url = modal.act === "create" ? route(modal.tipo) : route(modal.tipo, id);
    const onSuccess = () => {
      setModal(m => ({ ...m, open: false }));
      load();
    };
    if (hasFile) {
      const fd = new FormData();
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (token) fd.append("_token", token);
      if (modal.act !== "create") fd.append("_method", "PUT");
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) fd.append(k, v instanceof File ? v : String(v));
      });
      router.post(url, fd, { forceFormData: true, preserveScroll: true, onSuccess });
      return;
    }
    modal.act === "create"
      ? post(url, { data, onSuccess })
      : modal.act === "update"
        ? put(url, { data, onSuccess })
        : del(url, { onSuccess });
  }, [modal, data, post, put, del, load]);
  const open = (tipo: string, reg: Field[] | null, act: Action) => setModal({ open: true, tipo, reg, act });
  const close = () => setModal({ open: false, tipo: null, reg: null, act: "update" });
  const groupedByDate = useMemo(() => {
    const map: Record<string, { tipo: string; f: Field[]; k: string }[]> = {};
    Object.entries(records).forEach(([t, items]) => {
      items.forEach(f => {
        const fecha = f.find(x => x.key === "fecha")?.value ?? "Sin fecha";
        if (!map[fecha]) map[fecha] = [];
        map[fecha].push({ tipo: CONFIG[t as keyof typeof CONFIG], f, k: t });
      });
    });
    return Object.fromEntries(
      Object.entries(map).sort(([a], [b]) => {
        const da = parseDateAsLocal(a)?.getTime() ?? 0;
        const db = parseDateAsLocal(b)?.getTime() ?? 0;
        return db - da;
      })
    );
  }, [records]);
  const cfg = modal.tipo ? ACTION[modal.act] : null;
  const label = modal.tipo ? CONFIG[modal.tipo as keyof typeof CONFIG] : "";
  const getTitleAndColor = (item: { k: string; f: Field[] }) => {
    const technicalKeys = ["id", "created_at", "updated_at", "fecha"];
    const visibleFields = item.f.filter(f => !technicalKeys.some(tk => f.key.startsWith(tk) || f.key === tk));
    let title = "Sin título";
    let color = "text-purple-600 dark:text-purple-400";
    let usedKey = "";
    if (item.k === "procedimientos") {
      const field = visibleFields.find(f =>
        f.key.toLowerCase().includes("nombre") ||
        f.key.toLowerCase().includes("procedimiento") ||
        f.label.toLowerCase().includes("procedimiento") ||
        f.label.toLowerCase().includes("nombre")
      );
      title = field ? String(field.value).toUpperCase().trim() : "PROCEDIMIENTO";
      usedKey = field?.key || "";
      color = "text-blue-600 dark:text-blue-400";
    } else if (item.k === "medicamentos") {
      const field = visibleFields.find(f =>
        f.key.toLowerCase().includes("medicamento") ||
        f.key.toLowerCase().includes("nombre") ||
        f.label.toLowerCase().includes("medicamento") ||
        f.label.toLowerCase().includes("nombre")
      );
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
  return (
    <div className="flex flex-col gap-4">
      {canEdit && (
        <ButtonGroup className="gap-1 flex flex-wrap">
          {Object.keys(CONFIG).map(t => (
            <Button
              key={t}
              size="sm"
              variant="outline"
              className="text-xs font-medium min-w-0 px-2"
              onClick={() => open(t, null, "create")}
            >
              {capitalize(CONFIG[t as keyof typeof CONFIG])}
            </Button>
          ))}
        </ButtonGroup>
      )}
      {Object.entries(groupedByDate).map(([fecha, items]) => (
        <div key={fecha} className="">
          <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {fecha === "Sin fecha" ? fecha : formatDatePeru(fecha)}
          </h3>
          {items.map((r, idx) => {
            const { title, color, usedKey } = getTitleAndColor(r);
            const archivoField = r.f.find(f => f.key === "archivo");
const archivoNombre = archivoField?.value;
const tieneArchivo = archivoNombre && typeof archivoNombre === "string" && archivoNombre.trim() !== "";
const carpeta = getFolderForType(r.k);
let archivoUrl: string | null = null;
let esImagen = false;
let esPdf = false;

if (tieneArchivo) {
  const nombre = archivoNombre.trim();
  const extension = nombre.toLowerCase().split('.').pop() || "";
  const extensionesImagen = ["jpg", "jpeg", "png", "gif", "webp"];
  if (extensionesImagen.includes(extension)) {
    archivoUrl = `/images/${carpeta}/${nombre}`;
    esImagen = true;
  } else if (extension === "pdf") {
    archivoUrl = `/pdf/${carpeta}/${nombre}`;
    esPdf = true;
  }

  // DEBUG: mostrar información del archivo y ruta
  console.log(`[DEBUG] Tipo: ${r.k}, Título: ${title}, Archivo detectado: ${archivoNombre}, URL generada: ${archivoUrl}, Es imagen: ${esImagen}, Es PDF: ${esPdf}`);
} else {
  console.log(`[DEBUG] Tipo: ${r.k}, Título: ${title}, No se detectó archivo`);
}

            return (
              <div
                key={`${r.k}-${idx}`}
                className="border rounded-lg p-3 bg-muted/40 mb-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-bold text-xl ${color}`}>
                      {title}
                    </p>
                    {r.f
                      .filter(x =>
                        !["id", "created_at", "updated_at", "fecha", "archivo"].some(p => x.key.startsWith(p) || x.key === p) &&
                        x.key !== usedKey &&
                        x.value != null &&
                        String(x.value).trim() !== ""
                      )
                      .map((f, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{f.label}:</span> {f.value}
                        </p>
                      ))}
                  </div>
                  {canEdit && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="icon" variant="outline" onClick={() => open(r.k, r.f, "update")}>
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      {tieneArchivo && archivoUrl && (
                        <Button size="icon" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" asChild>
                          <a href={archivoUrl} target="_blank" rel="noopener noreferrer">
                            {esPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                          </a>
                        </Button>
                      )}
                      <Button size="icon" variant="destructive" onClick={() => open(r.k, r.f, "delete")}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {loadingRecords && (
        <div className="w-full flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )}
      <Dialog open={modal.open} onOpenChange={close}>
        <DialogContent className={`max-w-lg p-6 ${cfg?.border || ""}`}>
          {cfg && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  {cfg.title} {label}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="sr-only">
                Formulario para {cfg.title.toLowerCase()} {label.toLowerCase()}.
              </DialogDescription>
            </>
          )}
          <form onSubmit={submit} className="space-y-3">
            {(fields[modal.tipo ?? ""] ?? [])
              .filter(([k]) => k !== "id_historia_clinica")
              .map(([k, l, t, o]) => (
                <FormFieldsRenderer
                  key={k}
                  formFields={{ [k]: { form: { key: k, label: l, type: t, options: o } } }}
                  data={data}
                  setData={(k, v) => setData(p => ({ ...p, [k]: v }))}
                  errors={errors}
                  readonly={cfg?.readonly}
                  hiddenFields={[]}
                  isMobile
                  inputRefs={inputRefs}
                  view={view}
                />
              ))}
            <div className="flex justify-end">
              <Button type="submit" disabled={processing} className={`${cfg?.cls} flex items-center gap-2`}>
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : cfg?.icon}
                {cfg?.btn}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}