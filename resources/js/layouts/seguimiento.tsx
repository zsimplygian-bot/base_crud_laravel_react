import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormFieldsRenderer } from "@/components/form-fields";
import { PencilIcon, TrashIcon, Save, Loader2 } from "lucide-react";

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

// Primera letra mayúscula, resto minúscula
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default function SeguimientoSection({ view, formId, action = "update" }: Props) {
  const canEdit = action === "update";
  const parentId = useMemo(() => window.location.pathname.match(/\/update\/(\d+)/)?.[1] ?? formId, [formId]);

  const [modal, setModal] = useState<{ open: boolean; tipo: string | null; reg: Field[] | null; act: Action }>({
    open: false, tipo: null, reg: null, act: "update"
  });

  const [fields, setFields] = useState<Record<string, any[]>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Record<string, Field[][]>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { post, put, delete: del, processing, errors, setData: setInertia } = useForm({});

  const load = useCallback(() => {
    fetch(`/api/historia/${parentId}/records`).then(r => r.json()).then(setRecords).catch(() => {});
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
    const onSuccess = () => { setModal(m => ({ ...m, open: false })); load(); };
    const opts = { onSuccess };
    modal.act === "create" ? post(route(modal.tipo), { data, ...opts })
      : modal.act === "update" ? put(route(modal.tipo, id), { data, ...opts })
      : del(route(modal.tipo, id), opts);
  }, [modal, data, post, put, del, load]);

  const open = (tipo: string, reg: Field[] | null, act: Action) => setModal({ open: true, tipo, reg, act });
  const close = () => setModal({ open: false, tipo: null, reg: null, act: "update" });

  const all = useMemo(() => Object.entries(records)
    .flatMap(([t, items]) => items.map(f => ({
      k: t,
      tipo: CONFIG[t as keyof typeof CONFIG],
      f,
      fecha: f.find(x => x.key === "fecha")?.value ?? null,
      id: extractId(f, t)
    })))
    .sort((a, b) => (a.fecha ? +new Date(a.fecha) : 0) - (b.fecha ? +new Date(b.fecha) : 0))
  , [records]);

  const cfg = modal.tipo ? ACTION[modal.act] : null;
  const label = modal.tipo ? CONFIG[modal.tipo as keyof typeof CONFIG] : "";

  return (
    <div className="flex flex-col gap-4">
      {/* // Título: Botones para crear nuevos registros */}
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

      {/* // Título: Lista de todos los registros */}
      {all.map(r => (
        <div
          key={`${r.k}-${r.id}`}
          className="border rounded-lg p-3 flex justify-between bg-muted/40"
        >
          <div>
            <p className="font-semibold text-purple-600 dark:text-purple-400">
  {r.tipo}
  {r.fecha ? (
    <span className="ml-2 text-purple-600 dark:text-purple-400">
      — {new Date(r.fecha).toLocaleDateString("es-PE")}
    </span>
  ) : (
    <span className="ml-2 text-gray-400 dark:text-gray-500">— Sin fecha</span>
  )}
</p>
            {r.f
              .filter(x => !["id_", "fecha", "created_at", "updated_at"].some(p => x.key.startsWith(p) || x.key === p))
              .map((f, i) => <p key={i} className="text-sm">{f.label}: {f.value ?? "-"}</p>)}
          </div>

          {canEdit && (
            <div className="flex flex-col gap-1 ml-2">
              <Button size="icon" variant="outline" onClick={() => open(r.k, r.f, "update")}>
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => open(r.k, r.f, "delete")}>
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* // Título: Modal */}
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