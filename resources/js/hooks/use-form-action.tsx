import { useMemo, FormEventHandler } from "react";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { Transition } from "@headlessui/react";
export type FormActionType = "create" | "update" | "delete" | "info";
interface ActionConfig {
  formAction: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  buttonText: string;
  buttonClass: string;
  buttonIcon: JSX.Element;
  description: string;
  titlePrefix: string;
  readonly?: boolean;
}
const ACTION_CONFIGS: Record<FormActionType, ActionConfig> = {
  create: {
    formAction: "store",
    method: "POST",
    buttonText: "Registrar",
    buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Ingresa los datos cuidadosamente.",
    titlePrefix: "REGISTRO DE",
  },
  update: {
    formAction: "update",
    method: "PATCH",
    buttonText: "Actualizar",
    buttonClass: "bg-green-600 hover:bg-green-500 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Actualiza los datos con cuidado.",
    titlePrefix: "ACTUALIZAR",
  },
  delete: {
    formAction: "destroy",
    method: "DELETE",
    buttonText: "Eliminar",
    buttonClass: "bg-red-500 hover:bg-red-700 text-white destructive",
    buttonIcon: <Trash2 className="w-4 h-4" />,
    description: "¿Estás seguro que deseas eliminar? Esta acción es irreversible.",
    titlePrefix: "ELIMINAR",
    readonly: true,
  },
  info: {
    formAction: "info",
    method: "POST",
    buttonText: "",
    buttonClass: "bg-gray-500 hover:bg-gray-600 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Consulta la información.",
    titlePrefix: "INFORMACIÓN DE",
    readonly: true,
  },
};
const cardBorderMap: Record<FormActionType, string> = {
  create: "border-blue-300 dark:border-blue-900",
  update: "border-green-300 dark:border-green-900",
  delete: "border-red-300 dark:border-red-900",
  info: "border-gray-300 dark:border-gray-700",
};
const getFormDataId = (
  form_data: Record<string, any>,
  view: string,
  queryparams?: any
) => {
  if (form_data?.id) return form_data.id;
  if (form_data[`id_${view}`]) return form_data[`id_${view}`];
  return undefined;
};
export const useFormAction = (
  action: string,
  customTitle: string,
  form_data: Record<string, any>,
  view: string,
  post: any,
  put: any,
  inertiaDelete: any,
  processing: boolean,
  recentlySuccessful: boolean,
  queryparams: Record<string, any> | string | undefined,
  data: Record<string, any>,      // <- CORRECTO
  setData: (updater: any) => void,
  reset: () => void
) =>
  useMemo(() => {
    const type = (action || "create") as FormActionType;
    const config = ACTION_CONFIGS[type];
    const formDataId = getFormDataId(form_data, view, queryparams);
    const singularTitle = customTitle.replace(/s$/i, "");
    const title = `${config.titlePrefix} ${singularTitle.toUpperCase()}`;
    const isDestructive = type === "delete";
    const cardBorderClass = cardBorderMap[type];
    const queryString =
      typeof queryparams === "string"
        ? `?tipo=${queryparams}`
        : queryparams
        ? `?${new URLSearchParams(
            Object.entries(queryparams).map(([k, v]) => [k, String(v)])
          )}`
        : "";
    const handleSubmit: FormEventHandler = (e) => {
      e.preventDefault();
      console.log("📤 Formulario a enviar:", data); // <- Log agregado
      const url =
        config.method === "POST"
          ? route(`${view}.store`)
          : route(`${view}.update`, { [view]: formDataId });
      const hasFile = Object.values(data ?? {}).some((v) => v instanceof File);
      console.log(`🔹 Enviando formulario vía ${config.method} a ${url}`);
      if (hasFile) {
        const formData = new FormData();
        const token = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content");
        if (!token) return console.error("❌ No se encontró meta CSRF token");
        formData.append("_token", token);
        if (config.method !== "POST") formData.append("_method", config.method);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (value instanceof File) formData.append(key, value);
            else formData.append(key, String(value));
          }
        });
        router.post(url, formData, {
          forceFormData: true,
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => reset(),
          onError: (err) => setData((prev: any) => ({ ...prev, errors: err })),
        });
      } else {
        if (config.method === "POST") post(url);
        if (config.method === "PATCH" && formDataId) put(url);
        if (config.method === "DELETE" && formDataId)
          inertiaDelete(route(`${view}.destroy`, { [view]: formDataId }));
      }
    };
    const ActionButton = () =>
      config.buttonText ? (
        <Button
          size="sm"
          type="submit"
          disabled={processing}
          className={`${config.buttonClass} flex items-center gap-2`}
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonIcon}
          {config.buttonText}
        </Button>
      ) : null;
    const FooterButtons = (
      <div className="flex items-center justify-between mt-4">
        <Link href={`/${view}${queryString}`}>
          <Button size="sm" variant="outline">
            <ArrowLeft className="w-4 h-4" /> Regresar
          </Button>
        </Link>
        <div className="flex items-center gap-x-4">
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p
              className={`text-sm ${
                isDestructive ? "text-red-600" : "text-neutral-600"
              } dark:text-neutral-400`}
            >
              Guardado
            </p>
          </Transition>
          <ActionButton />
        </div>
      </div>
    );
    return {
      config,
      title,
      description: config.description,
      readonly: config.readonly ?? false,
      cardBorderClass,
      handleSubmit,
      FooterButtons,
    };
  }, [
    action,
    customTitle,
    form_data,
    view,
    post,
    put,
    inertiaDelete,
    processing,
    recentlySuccessful,
    queryparams,
    data,
  ]);