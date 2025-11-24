import { useMemo } from "react";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { Transition } from "@headlessui/react";
export type FormActionType = "create" | "update" | "delete" | "info";
const CONFIG = {
  create: { m: "POST",  t: "Registrar",  c: "bg-blue-500 hover:bg-blue-600",  i: <Save className="w-4 h-4"/>, d: "Ingresa los datos cuidadosamente.", p: "REGISTRO DE" },
  update: { m: "PATCH", t: "Actualizar", c: "bg-green-600 hover:bg-green-500", i: <Save className="w-4 h-4"/>, d: "Actualiza los datos con cuidado.", p: "ACTUALIZAR" },
  delete: { m: "DELETE",t: "Eliminar",  c: "bg-red-500 hover:bg-red-700 destructive", i: <Trash2 className="w-4 h-4"/>, d: "¿Estás seguro que deseas eliminar? Esta acción es irreversible.", p: "ELIMINAR", r: true },
  info:   { m: "POST",  t: "",         c: "bg-gray-500 hover:bg-gray-600", i: null, d: "Consulta la información.", p: "INFORMACIÓN DE", r: true },
} as const;
const BORDERS = { create: "border-blue-300 dark:border-blue-950", update: "border-green-300 dark:border-green-900", delete: "border-red-300 dark:border-red-900", info: "border-gray-300 dark:border-gray-700" };
const getId = (d: any, v: string) => d?.id ?? d?.[`id_${v}`];
const qs = (q?: any) => typeof q === "string" ? `?tipo=${q}` : q ? `?${new URLSearchParams(Object.entries(q).map(([k, v]) => [k, String(v)]))}` : "";
export const useFormAction = (
  action: string,
  customTitle: string,
  form_data: any,
  view: string,
  post: any,
  put: any,
  inertiaDelete: any,
  processing: boolean,
  recentlySuccessful: boolean,
  queryparams: any,
  data: any,
  setData: any,
  reset: () => void
) => useMemo(() => {
  const type = (action || "create") as FormActionType;
  const cfg = CONFIG[type];
  const id = getId(form_data, view);
  const baseTitle = (customTitle || view).replace(/s$/i, "");
const title = `${cfg.p} `;

  const q = qs(queryparams);
  const hasFile = Object.values(data ?? {}).some((v: any) => v instanceof File);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = cfg.m === "POST" ? route(`${view}.store`) : route(`${view}.update`, { [view]: id });
    if (hasFile) {
      const fd = new FormData();
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (!token) return;
      fd.append("_token", token);
      if (cfg.m !== "POST") fd.append("_method", cfg.m);
      Object.entries(data).forEach(([k, v]) => v != null && fd.append(k, v instanceof File ? v : String(v)));
      router.post(url, fd, { forceFormData: true, preserveScroll: true, onSuccess: reset });
    } else {
      cfg.m === "POST" ? post(url) :
      cfg.m === "PATCH" ? put(url) :
      inertiaDelete(route(`${view}.destroy`, { [view]: id }));
    }
  };
  const Btn = () => cfg.t ? (
    <Button size="sm" type="submit" disabled={processing} className={`${cfg.c} flex items-center gap-2 text-white`}>
      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : cfg.i}
      {cfg.t}
    </Button>
  ) : null;
  const FooterButtons = (
    <div className="flex items-center justify-between mt-4">
      <Link href={`/${view}${q}`}><Button size="sm" variant="outline"><ArrowLeft className="w-4 h-4" /> Regresar</Button></Link>
      <div className="flex items-center gap-4">
        <Transition show={recentlySuccessful} enter="transition" enterFrom="opacity-0" leave="transition" leaveTo="opacity-0">
          <p className={`text-sm ${type === "delete" ? "text-red-600" : "text-neutral-600"} dark:text-neutral-400`}>Guardado</p>
        </Transition>
        <Btn />
      </div>
    </div>
  );
  return {
    title,
    description: cfg.d,
    readonly: !!cfg.r,
    cardBorderClass: BORDERS[type],
    handleSubmit,
    FooterButtons,
  };
}, [action, customTitle, form_data, view, post, put, inertiaDelete, processing, recentlySuccessful, queryparams, data, reset]);